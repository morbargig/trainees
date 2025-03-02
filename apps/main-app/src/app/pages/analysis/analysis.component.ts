import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FilterDataResponse,
  FilterObject,
  ITableFilter,
  LazyLoadEvent,
  MatchMode,
  TableBasePager,
  TableFiltersComponent,
} from '@softbar/front/dynamic-table';
import { IExamModel, IStudentModel } from '@softbar/api-interfaces';
import { ExamLocalStorageService } from '../../services/school/exam.service';
import { combineLatest, Observable, Subject, take, tap } from 'rxjs';
import { MatCard, MatCardContent } from '@angular/material/card';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { ChartType } from './types/chart.type';
import { AverageBySubjectComponent } from './charts/average-by-subject.component';
import { StudentLocalStorageService } from '../../services/school/student.service';
import { AverageByStudentComponent } from './charts/average-by-student.component';
import { AverageOverTimeComponent } from './charts/average-by-student-over-tie.component';
@Component({
  selector: 'softbar-analysis',
  imports: [
    CommonModule,
    TableFiltersComponent,
    MatCard,
    MatCardContent,
    DragDropModule,
    AverageBySubjectComponent,
    AverageByStudentComponent,
    AverageOverTimeComponent,
  ],
  template: `
    <div class="analysis-view-wrapper p-3">
      <mat-card>
        <mat-card-content>
          <!-- filters -->
          <softbar-app-table-filters
            [saveStorageId]="filterLocalStorageKey"
            showResetFilters="Show All"
            (filterChange)="fireFilter($event)"
            [filters]="filters"
            [CDRefEvent]="filtersCDRefEvent"
          />
          <!-- charts -->
          <div
            cdkDropList
            class="analysis-charts-row flex flex-wrap gap-4"
            (cdkDropListDropped)="drop($event)"
          >
            @for (chart of charts; track chart.id; let last=$last; let index =
            $index) {
            <div
              class="box p-4 bg-white shadow-md rounded-lg"
              cdkDrag
              [ngClass]="{ 'w-full': last, 'w-[calc(50%-0.5rem)]': !last }"
            >
              <h2 class="header text-lg font-semibold">
                Chart {{ index + 1 }}:
                {{ chart.label }}
              </h2>
              <div class="context">
                @if (chart.id === chartType.StudentsGradeAverageOverTime) {
                <softbar-analysis-average-over-time-chart
                  [last]="last"
                  [index]="index"
                  [students]="students"
                  [exams]="examsByStudent"
                >
                </softbar-analysis-average-over-time-chart>
                } @else if (chart.id === chartType.StudentsGradeAverage) {
                <softbar-analysis-average-by-student-chart
                  [last]="last"
                  [index]="index"
                  [students]="students"
                  [exams]="examsByStudent"
                ></softbar-analysis-average-by-student-chart>
                } @else if (chart.id === chartType.GradeSubjectAverage){
                <softbar-analysis-average-by-subject-chart
                  [last]="last"
                  [index]="index"
                  [exams]="examsBySubject"
                ></softbar-analysis-average-by-subject-chart>

                <!-- <app-analysis-grades-average-chart-bar
        [hideData]="last"
        [chartData]="chart.data"
      /> -->
                }
              </div>
            </div>
            }
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
})
export class AnalysisComponent
  extends TableBasePager<IExamModel>
  implements OnInit
{
  filtersCDRefEvent: Subject<keyof ChangeDetectorRef> = new Subject<
    keyof ChangeDetectorRef
  >();

  examsBySubject: IExamModel[];
  examsByStudent: IExamModel[];
  students: IStudentModel[];
  public readonly filters: ITableFilter<IExamModel>[] = [];
  drop(e: CdkDragDrop<any>) {
    moveItemInArray(this.charts, e.previousIndex, e.currentIndex);
    this.hideSubjectFilter(
      this.charts?.at(-1)?.id === ChartType.GradeSubjectAverage
    );
  }
  private splitAndCapitalize(id: ChartType): string {
    const words = ChartType[id].match(/^[a-z]+|[A-Z][a-z]*/g) || [];
    // Capitalize first word
    if (words.length > 0) {
      words[0] =
        words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
    }
    return words.join(' ');
  }
  get chartType() {
    return ChartType;
  }
  charts: { id: ChartType; label: (typeof ChartType)[ChartType] }[] = (
    [
      ChartType.StudentsGradeAverageOverTime,
      ChartType.StudentsGradeAverage,
      ChartType.GradeSubjectAverage,
    ] as ChartType[]
  ).map((i) => ({
    id: i,
    label: this.splitAndCapitalize(i),
  }));

  constructor(
    private examLocalStorageService: ExamLocalStorageService,
    private studentLocalStorageService: StudentLocalStorageService
  ) {
    super();
  }
  public getDataProvider(
    evt: LazyLoadEvent<IExamModel>
  ): Observable<FilterDataResponse<any>> {
    return combineLatest([
      this.examLocalStorageService
        .getCollectionLazyLoad('exam', {
          pageSize: Number.MAX_SAFE_INTEGER,
          pageNum: 0,
          filters: evt?.filters?.map((i) => ({ ['subject']: i['subject'] })),
        })
        .pipe(tap((x) => (this.examsBySubject = x?.data))),
      this.examLocalStorageService
        .getCollectionLazyLoad('exam', {
          pageSize: Number.MAX_SAFE_INTEGER,
          pageNum: 0,
          filters: evt?.filters?.map((i) => ({
            ['studentId']: i['studentId'],
          })),
        })
        .pipe(tap((x) => (this.examsByStudent = x?.data))),
      this.studentLocalStorageService
        .getCollectionLazyLoad('student', {
          pageSize: Number.MAX_SAFE_INTEGER,
          pageNum: 0,
          filters: evt?.filters?.map((i) => ({
            ['id']: i['studentId'],
          })),
        })
        .pipe(tap((x) => (this.students = x?.data))),
    ]) as any;
  }
  hideSubjectFilter(hidden: boolean) {
    const filter = this.filters?.find((i) => i?.key === 'subject');
    filter && (filter['hidden'] = hidden);
    this.filtersCDRefEvent.next('detectChanges');
  }
  ngOnInit(): void {
    combineLatest(
      this.studentLocalStorageService.getCollection('student').pipe(
        take(1),
        tap((x) => {
          this.filters.push({
            label: 'Trainees Id',
            key: 'studentId',
            filterType: 'multiSelect',
            matchMode: MatchMode.Contained,
            options: x?.map((i) => ({
              label: i?.id?.toString(),
              value: i?.id,
            })),
          });
        })
      ),
      this.examLocalStorageService.getCollection('exam').pipe(
        take(1),
        tap((x) => {
          this.filters.push({
            label: 'Subject',
            filterType: 'multiSelect',
            key: 'subject',
            matchMode: MatchMode.Contained,
            options: Array.from(
              new Set(x?.map((record) => record.subject))
            ).map((i) => ({
              label: i,
              value: i,
            })),
          });
        })
      )
    ).subscribe();
    this.lazyEvent.next({
      pageSize: Number.MAX_SAFE_INTEGER,
      pageNum: 0,
    });
  }

  filterLocalStorageKey = `page-analysis-table-filters`;

  public fireFilter(filter: FilterObject<IExamModel>) {
    // subject filter
    if (!filter?.subject?.matchMode) {
      filter['subject']['matchMode'] = this.filters?.find(
        (i) => i?.key === 'subject'
      ).matchMode;
    }
    if (!(filter?.subject?.value as unknown as number[])?.length) {
      delete filter['subject'];
    }
    // id filter
    if (!filter?.studentId?.matchMode) {
      filter['studentId']['matchMode'] = this.filters?.find(
        (i) => i?.key === 'studentId'
      ).matchMode;
    }
    if (!(filter?.studentId?.value as unknown as number[])?.length) {
      delete filter['studentId'];
    }
    this.lazyEvent?.next({
      ...this.lazyEvent.value,
      filters: [filter],
      pageNum: 0,
    });
  }
}
