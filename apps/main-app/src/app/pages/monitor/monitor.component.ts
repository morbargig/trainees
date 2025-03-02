import { Component, HostBinding, OnInit, Type } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatCard, MatCardTitle } from '@angular/material/card';
import {
  FilterDataResponse,
  FilterObject,
  ITableColumn,
  ITableFilter,
  LazyLoadEvent,
  MatchMode,
  TableBasePager,
  TableComponent,
  TableFiltersComponent,
  TableFiltersServiceService,
  TablePagingComponent,
} from '@softbar/front/dynamic-table';
import { ExamLocalStorageService } from '../../services/school/exam.service';
import { combineLatest, map, Observable, take } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { IExamModel, IMonitor, IStudentModel } from '@softbar/api-interfaces';
import { StudentLocalStorageService } from '../../services/school/student.service';

@Component({
  selector: 'softbar-monitor',
  template: ` <mat-card class="table-card h-full !m-0 p-7">
    <div class="flex justify-between">
      <mat-card-title>
        <h1>Trainee Data</h1>
      </mat-card-title>
    </div>
    <h2 class="py-4">Filters</h2>
    <div class="flex pb-2 justify-between items-center">
      <softbar-app-table-filters
        [saveStorageId]="filterLocalStorageKey"
        showResetFilters="Show All"
        (filterChange)="fireFilter($event)"
        [filters]="filters"
      />
    </div>

    <softbar-app-table
      [trStyleFunc]="trStyleFunc"
      [columns]="columns"
      [items]="items"
      [loading]="loading"
      [loadingRowsLength]="pageSize"
      [columns]="columns"
    >
    </softbar-app-table>
    @if (items?.length){
    <softbar-app-table-paging
      class="flex print:hidden"
      [pageSize]="pageSize"
      [pageNum]="((lazyEvent | async)?.pageNum || 0) + 1"
      (pageChange)="firePage($event)"
      [totalRecords]="totalRecords"
    ></softbar-app-table-paging>
    }
  </mat-card>`,
  imports: [
    MatCard,
    MatCardTitle,
    TableComponent,
    AsyncPipe,
    TablePagingComponent,
    TableFiltersComponent,
    MatButtonModule,
  ],
  standalone: true,
})
export class MonitorComponent
  extends TableBasePager<IMonitor>
  implements OnInit
{
  public getLazyEvent() {
    return this.lazyEvent;
  }
  @HostBinding('class') public class: string = ((ngClass = 'h-full') =>
    ngClass)();
  public readonly pageSize = 10;

  public readonly filters: ITableFilter<IMonitor>[] = [];
  trStyleFunc: TableComponent<IMonitor>['trStyleFunc'] = (item) =>
    item?.average
      ? item?.average > 65
        ? ((ngClass = '!bg-green-400') => ngClass)()
        : ((ngClass = '!bg-red-600') => ngClass)()
      : '';
  ngOnInit(): void {
    this.studentLocalStorageService
      .getCollection('student')
      .pipe(take(1))
      .subscribe((s) => {
        this.filters.push(
          {
            label: 'ID',
            key: 'id',
            filterType: 'multiSelect',
            matchMode: MatchMode.Contained,
            options: s?.map((i) => ({
              label: i?.id?.toString(),
              value: i?.id,
            })),
          },
          {
            label: 'Name',
            key: 'name',
            filterType: 'freeText',
            initialValue() {
              return this.matchModes[0];
            },
            matchModes: [
              {
                label: 'Contains',
                matchMode: MatchMode.Contains,
              },
              {
                label: 'Contained',
                matchMode: MatchMode.Contained,
              },
              {
                label: 'Starts With',
                matchMode: MatchMode.StartsWith,
              },
              {
                label: 'Ends With',
                matchMode: MatchMode.EndsWith,
              },
            ],
          }
        );
      });
  }
  getDataProvider(
    evt: LazyLoadEvent<IStudentModel | IExamModel>
  ): Observable<FilterDataResponse<IMonitor>> {
    return combineLatest([
      this.studentLocalStorageService.getCollectionLazyLoad('student', {
        pageSize: Number.MAX_SAFE_INTEGER,
        pageNum: 0,
      }),
      this.examLocalStorageService.getCollectionLazyLoad('exam', {
        pageSize: Number.MAX_SAFE_INTEGER,
        pageNum: 0,
      }),
    ]).pipe(
      take(1),
      map(([students, exams]) => {
        return this.tableFiltersServiceService.filter(
          this.calculateMonitorData(students?.data, exams?.data),
          evt
        );
      })
    );
  }
  calculateMonitorData(
    students: IStudentModel[],
    exams: IExamModel[]
  ): IMonitor[] {
    return students.map((student) => {
      const studentExams = exams.filter(
        (exam) => exam.studentId === student.id
      );
      const examsCount = studentExams.length;
      const averageGrade =
        examsCount > 0
          ? studentExams.reduce((sum, exam) => sum + exam.grade, 0) / examsCount
          : 0; // Avoid division by zero
      return {
        id: student.id,
        name: student.name,
        exams: examsCount,
        average: parseFloat(averageGrade.toFixed(2)), // Round to 2 decimal places
      };
    });
  }
  constructor(
    private examLocalStorageService: ExamLocalStorageService,
    private studentLocalStorageService: StudentLocalStorageService,
    private tableFiltersServiceService: TableFiltersServiceService
  ) {
    super();
    this.lazyEvent.next({
      pageNum: 0,
      pageSize: this.pageSize,
    });
  }
  filterLocalStorageKey = `page-monitor-table-filters`;

  public firePage({ pageNum }: LazyLoadEvent) {
    this.lazyEvent?.next({ ...this.lazyEvent.value, pageNum: pageNum - 1 });
  }
  public fireFilter(filter: FilterObject<IMonitor>) {
    if (!filter?.id?.matchMode) {
      filter['id']['matchMode'] = this.filters?.find(
        (i) => i?.key === 'id'
      ).matchMode;
    }
    if (!(filter?.id?.value as unknown as number[])?.length) {
      delete filter['id'];
    }
    if (!filter?.name?.matchMode) {
      filter['name']['matchMode'] = (
        this.filters?.find((i) => i?.key === 'name').initialValue() as any
      ).matchMode;
    }
    this.lazyEvent?.next({
      ...this.lazyEvent.value,
      filters: [filter],
      pageNum: 0,
    });
  }

  override columns: ITableColumn<IMonitor>[] = [
    {
      field: 'id',
      type: 'Default',
      label: 'ID',
    },
    { field: 'name', type: 'Default', label: 'Name' },
    { field: 'average', type: 'Default', label: 'Average' },
    { field: 'exams', type: 'Default', label: 'Exams No' },
    {
      field: 'id',
      label: 'Actions',
      type: 'DynamicLazy',
      loadCustomCellComponent: ({ calBack }) =>
        import(
          '../../components/action-cell/student-action-cell.component'
        ).then((m) =>
          calBack({
            component: m.StudentActionCellComponent as Type<
              InstanceType<typeof m.StudentActionCellComponent<IMonitor, 'id'>>
            >,
          })
        ),
    },
    {
      field: 'id',
      label: 'Exam Actions',
      type: 'DynamicLazy',
      loadCustomCellComponent: ({ calBack }) =>
        import(
          '../../components/action-cell/monitor-exam-action-cell.component'
        ).then((m) =>
          calBack({
            component: m.MonitorExamActionCellComponent as Type<
              InstanceType<
                typeof m.MonitorExamActionCellComponent<IMonitor, 'id'>
              >
            >,
          })
        ),
    },
  ];
}
