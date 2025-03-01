import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FilterDataResponse,
  FilterObject,
  ITableFilter,
  LazyLoadEvent,
  MatchMode,
  TableFiltersComponent,
} from '@softbar/front/dynamic-table';
import { IStudentElementModel } from '@softbar/api-interfaces';
import { StudentLocalStorageService } from '../../services/student.service';
import { Observable, take } from 'rxjs';
import { MatCard, MatCardContent } from '@angular/material/card';
import { DragDropModule } from '@angular/cdk/drag-drop';
@Component({
  selector: 'softbar-analysis',
  imports: [
    CommonModule,
    TableFiltersComponent,
    MatCard,
    MatCardContent,
    DragDropModule,
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
          />
          <!-- charts -->
          <div
            cdkDropList
            class="analysis-charts-row"
            (cdkDropListDropped)="drop($event)"
          >
            <!-- @for (chart of chartsInfo; track chart.name; let last=$last) { -->
            <div class="box" cdkDrag>
              <!-- <h2 class="header">{{ chart.name }}</h2> -->
              <div class="context">
                <!-- @if (chart.id === eChartId.ANALYSIS_ALL_STUDENT_CHART) {
                <app-analysis-chart-line [hideData]="last" />
                } @else if (chart.id === eChartId.ANALYSIS_STUDENT_AVG_CHART) {
                <app-analysis-student-average-chart-bar
                  [hideData]="last"
                  [chartData]="chart.data"
                />
                } @else {
                <app-analysis-grades-average-chart-bar
                  [hideData]="last"
                  [chartData]="chart.data"
                />
                } -->
              </div>
            </div>
            <!-- } -->
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
})
export class AnalysisComponent implements OnInit {
  public readonly filters: ITableFilter<IStudentElementModel>[] = [];
  drop(t: any) {}
  public getDataProvider(
    evt: LazyLoadEvent
  ): Observable<FilterDataResponse<IStudentElementModel>> {
    return this.studentLocalStorageService.getCollectionLazyLoad(
      'student',
      evt
    );
  }
  ngOnInit(): void {
    this.studentLocalStorageService
      .getCollection<IStudentElementModel>('student')
      .pipe(take(1))
      .subscribe((x) => {
        this.filters.push(
          {
            label: 'ID',
            key: 'id',
            filterType: 'multiSelect',
            matchMode: MatchMode.Contained,
            options: x?.map((i) => ({
              label: i?.id?.toString(),
              value: i?.id,
            })),
          },
          {
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
          }
        );
      });
  }
  constructor(
    private studentLocalStorageService: StudentLocalStorageService // private appMainAppTranslationService: AppMainAppTranslationService
  ) {}
  filterLocalStorageKey = `page-analysis-table-filters`;

  public fireFilter(filter: FilterObject<IStudentElementModel>) {
    debugger
    // this.lazyEvent?.next({
    //   ...this.lazyEvent.value,
    //   filters: [filter],
    //   pageNum: 0,
    // });
  }
}
