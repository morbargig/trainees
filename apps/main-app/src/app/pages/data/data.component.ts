import { Component, HostBinding, Type, OnInit } from '@angular/core';
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
  TablePagingComponent,
} from '@softbar/front/dynamic-table';
import { MatDialog } from '@angular/material/dialog';
import { IExamModel, IStudentModel } from '@softbar/api-interfaces';
import { ExamFormComponent } from '../../components/popups/exam-form.component';
import { ExamLocalStorageService } from '../../services/school/exam.service';
import { MatIcon } from '@angular/material/icon';
import { Observable, skip, take } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { StudentLocalStorageService } from '../../services/school/student.service';

@Component({
  selector: 'softbar-home',
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
      <button
        class=" h-[3em] flex items-center gap-2 px-4 py-2 border border-gray-300 bg-blue-600 text-white hover:bg-blue-700 transition duration-200 shadow-md rounded-lg"
        (click)="openPopUp('Create')"
      >
        <mat-icon>add</mat-icon>
        <span class="font-medium">Add</span>
      </button>
    </div>

    <softbar-app-table
      #tc
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
    MatIcon,
    TablePagingComponent,
    TableFiltersComponent,
    MatButtonModule,
  ],
  standalone: true,
})
export class DataComponent
  extends TableBasePager<IExamModel>
  implements OnInit
{
  public getLazyEvent() {
    return this.lazyEvent;
  }
  @HostBinding('class') public class: string = ((ngClass = 'h-full') =>
    ngClass)();
  public readonly pageSize = 10;
  public override readonly filters: ITableFilter<IExamModel>[] = [
    {
      label: 'ID',
      key: 'id',
      type: 'number',
      filterType: 'freeText',
      matchModes: [
        {
          label: 'Equals (=)',
          matchMode: MatchMode.Equals,
        },
        {
          label: 'Less Than (>)',
          matchMode: MatchMode.LessThan,
        },
        {
          label: 'Less Than Or Equals (>=)',
          matchMode: MatchMode.LessThanOrEquals,
        },
        {
          label: 'Greater Than (<)',
          matchMode: MatchMode.GreaterThan,
        },
        {
          label: 'Greater Than Or Equals (=<)',
          matchMode: MatchMode.GreaterThanOrEquals,
        },
        {
          label: 'Contains',
          matchMode: MatchMode.Contains,
        },
        {
          label: 'None',
          matchMode: undefined,
        },
      ],
    },
    {
      label: 'Date',
      key: 'date',
      type: 'date',
      filterType: 'freeText',
      matchModes: [
        {
          label: 'Equals (=)',
          matchMode: MatchMode.Equals,
        },
        {
          label: 'Before Than (>)',
          matchMode: MatchMode.Before,
        },
        {
          label: 'Before Than Or Equals (>=)',
          matchMode: MatchMode.BeforeOrEquals,
        },
        {
          label: 'After Than (<)',
          matchMode: MatchMode.After,
        },
        {
          label: 'After Than Or Equals (=<)',
          matchMode: MatchMode.EqualsOrAfter,
        },
        {
          label: 'None',
          matchMode: undefined,
        },
      ],
    },
  ];

  ngOnInit(): void {
    const filter = history.state?.filter;
    if (filter) {
      this.lazyEvent
        .pipe(skip(1), take(1))
        .subscribe(() => {
          requestAnimationFrame(() => {
            this.fireFilter(filter);
          });
        });
    }
  }

  getDataProvider(
    evt: LazyLoadEvent
  ): Observable<FilterDataResponse<IExamModel>> {
    return this.examLocalStorageService.getCollectionLazyLoad('exam', evt);
  }
  students: IStudentModel[];
  constructor(
    private dialog: MatDialog,
    private examLocalStorageService: ExamLocalStorageService,
    studentLocalStorageService: StudentLocalStorageService
  ) {
    super();
    studentLocalStorageService
      .getCollection('student')
      .pipe(take(1))
      .subscribe((x) => (this.students = x));
    this.lazyEvent.next({
      pageNum: 0,
      pageSize: this.pageSize,
    });
  }
  filterLocalStorageKey = `page-data-table-filters` as const;

  openPopUp(type: ExamFormComponent['data']['type']) {
    this.dialog.open<ExamFormComponent, ExamFormComponent['data']>(
      ExamFormComponent,
      {
        data: {
          id: undefined,
          type,
        },
        width: '500px',
      }
    );
  }

  public firePage({ pageNum }: LazyLoadEvent) {
    this.lazyEvent?.next({ ...this.lazyEvent.value, pageNum: pageNum - 1 });
  }
  public fireFilter(filter: FilterObject<IExamModel>) {
    this.lazyEvent?.next({
      ...this.lazyEvent.value,
      filters: [filter],
      pageNum: 0,
    });
  }

  override columns: ITableColumn<IExamModel>[] = [
    { field: 'id', type: 'Default', label: 'ID' },
    {
      field: 'studentId',
      type: 'Default',
      label: 'Name',
      parsedData: (studentId) =>
        this.students?.find((i) => i?.id === studentId)?.name,
    },
    { field: 'date', label: 'Date', type: 'Date' },
    { field: 'grade', label: 'Grade', type: 'Default' },
    { field: 'subject', label: 'Subject', type: 'Default' },
    {
      field: 'id',
      label: 'Test Actions',
      type: 'DynamicLazy',
      loadCustomCellComponent: ({ calBack }) =>
        import('../../components/action-cell/exam-action-cell.component').then(
          (m) =>
            calBack({
              component: m.ExamActionCellComponent,
            })
        ),
    },
    {
      field: 'studentId',
      label: 'Student Actions',
      type: 'DynamicLazy',
      loadCustomCellComponent: ({ calBack }) =>
        import(
          '../../components/action-cell/student-action-cell.component'
        ).then((m) =>
          calBack({
            component: m.StudentActionCellComponent as Type<
              InstanceType<
                typeof m.StudentActionCellComponent<IExamModel, 'studentId'>
              >
            >,
          })
        ),
    },
  ];
}
