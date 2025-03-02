import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataComponent } from './data.component';
import { ExamLocalStorageService } from '../../services/school/exam.service';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LazyLoadEvent, MatchMode } from '@softbar/front/dynamic-table';
import { IExamModel } from '@softbar/api-interfaces';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('DataComponent', () => {
  let component: DataComponent;
  let fixture: ComponentFixture<DataComponent>;
  let studentLocalStorageService: ExamLocalStorageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataComponent, TranslateModule.forRoot(), NoopAnimationsModule],
      providers: [
        ExamLocalStorageService,
        { provide: MatDialog, useValue: { open: jest.fn() } },
        TranslateService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DataComponent);
    studentLocalStorageService = TestBed.inject(ExamLocalStorageService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call `getCollectionLazyLoad` on init', async () => {
    jest.spyOn(studentLocalStorageService, 'getCollectionLazyLoad');

    const lazyLoadEvent: LazyLoadEvent<IExamModel> = {
      filters: [{ id: { matchMode: MatchMode.Equals, value: 1 } }],
    };

    component.getDataProvider(lazyLoadEvent);
    fixture.detectChanges();

    expect(
      studentLocalStorageService.getCollectionLazyLoad
    ).toHaveBeenCalledTimes(1);
  });

  it('should update lazyEvent when firePage is called', () => {
    const event: LazyLoadEvent = { pageNum: 1 };
    component.firePage({ pageNum: event.pageNum });
    expect(component.getLazyEvent().value.pageNum).toBe(event.pageNum - 1);
  });

  it('should update lazyEvent when fireFilter is called', () => {
    const lazyLoadEvent = {
      filters: [
        {
          id: {
            matchMode: MatchMode.Equals,
            value: 1,
          },
        },
      ],
    } as LazyLoadEvent<IExamModel>;
    component.fireFilter(lazyLoadEvent['filters'][0]);
    expect(component.getLazyEvent().value.filters?.length).toBe(
      lazyLoadEvent?.filters?.length
    );
  });

  it('should open the dialog when openPopUp is called', () => {
    const dialog = TestBed.inject(MatDialog);
    component.openPopUp('Create');
    expect(dialog.open).toHaveBeenCalled();
  });
});
