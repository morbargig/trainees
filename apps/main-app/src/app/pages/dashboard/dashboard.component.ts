import { Component, HostBinding } from '@angular/core';
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
import { IStudentElementModel } from '@softbar/api-interfaces';
import { StudentFormComponent } from '../../components/student-form/student-form.component';
import { StudentLocalStorageService } from '../../services/student.service';
import { MatIcon } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

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
    <softbar-app-table-paging
      class="flex print:hidden"
      [pageSize]="pageSize"
      [pageNum]="((lazyEvent | async)?.pageNum || 0) + 1"
      (pageChange)="firePage($event)"
      [totalRecords]="totalRecords"
    ></softbar-app-table-paging>
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
})
export class DashboardComponent extends TableBasePager<IStudentElementModel> {
  @HostBinding('class') public class: string = ((ngClass = 'h-full') =>
    ngClass)();
  public readonly pageSize = 10;
  public override readonly filters: ITableFilter<IStudentElementModel>[] = [
    {
      label: 'ID',
      key: 'id',
      type: 'number',
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
          label: 'None',
          matchMode: undefined,
        },
      ],
    },
    {
      label: 'Date',
      key: 'date',
      type: 'date',
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
  public override getDataProvider(
    evt: LazyLoadEvent
  ): Observable<FilterDataResponse<IStudentElementModel>> {
    return this.studentLocalStorageService.getCollectionLazyLoad(
      'student',
      evt
    );
  }
  constructor(
    private dialog: MatDialog,
    private studentLocalStorageService: StudentLocalStorageService // private appMainAppTranslationService: AppMainAppTranslationService
  ) {
    super();
    this.lazyEvent.next({
      pageNum: 0,
      pageSize: this.pageSize,
    });
  }
  openPopUp(type: StudentFormComponent['data']['type']) {
    this.dialog.open<StudentFormComponent, StudentFormComponent['data']>(
      StudentFormComponent,
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
  public fireFilter(filter: FilterObject<IStudentElementModel>) {
    this.lazyEvent?.next({ ...this.lazyEvent.value, filters: [filter] });
  }

  override columns: ITableColumn<IStudentElementModel>[] = [
    { field: 'id', type: 'Default', label: 'ID' },
    { field: 'name', type: 'Default', label: 'Name' },
    { field: 'date', label: 'Date', type: 'Date' },
    { field: 'grade', label: 'Grade', type: 'Default' },
    { field: 'subject', label: 'Subject', type: 'Default' },
    {
      field: 'id',
      label: 'Actions',
      type: 'DynamicLazy',
      loadCustomCellComponent: ({ calBack }) =>
        import('../../components/action-cell/action-cell.component').then((m) =>
          calBack({
            component: m.ClaimNumCellComponent,
          })
        ),
    },
  ];
}
