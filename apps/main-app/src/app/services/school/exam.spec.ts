import { TestBed } from '@angular/core/testing';
import {
  MatchMode,
  TableFiltersServiceService,
} from '@softbar/front/dynamic-table';
import { EXAM_DATA } from '../../mocks/school.mock';
import { LazyLoadEvent } from '@softbar/front/dynamic-table';
import { ExamLocalStorageService } from './exam.service';
import { IExamModel } from '@softbar/api-interfaces';

describe('examLocalStorageService', () => {
  let service: ExamLocalStorageService;
  let tableFiltersServiceService: TableFiltersServiceService;

  beforeEach(() => {
    // ✅ Mock TableFiltersServiceService
    tableFiltersServiceService = {
      filter: jest.fn((data) => ({
        data, // ✅ Simulate returning the same data (mock filtering logic)
        totalRecords: data.length,
      })),
    } as unknown as TableFiltersServiceService;

    TestBed.configureTestingModule({
      providers: [
        {
          provide: TableFiltersServiceService,
          useValue: tableFiltersServiceService,
        },
        ExamLocalStorageService,
      ],
    });
    localStorage.clear(); // ✅ Ensure a clean slate before each test
    service = TestBed.inject(ExamLocalStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize storage with mock exam data', () => {
    const storedData = JSON.parse(
      localStorage.getItem('school/exam') || '[]'
    );
    expect(storedData).toEqual(EXAM_DATA);
  });

  it('should return a BehaviorSubject from getCollection()', () => {
    const collection$ = service.getCollection('exam');
    expect(collection$).toBeDefined();
    expect(collection$.value).toEqual(EXAM_DATA);
  });

  it('should retrieve filtered data with getCollectionLazyLoad()', (done) => {
    const lazyLoadEvent: LazyLoadEvent = {
      filters: [{ id: { matchMode: MatchMode.Equals, value: 1 } }],
    };

    service
      .getCollectionLazyLoad('exam', lazyLoadEvent)
      .subscribe((response) => {
        expect(response.data).toEqual(EXAM_DATA);
        expect(response.totalRecords).toBe(EXAM_DATA.length);
        done();
      });
  });

  it('should add a new exam with post()', (done) => {
    const newExam: IExamModel = EXAM_DATA.at(0);
    service.post('exam', newExam).subscribe((addedExam) => {
      expect(addedExam.id).toBeDefined(); // ✅ ID should be assigned
      expect(service.getCollection('exam').value.length).toBe(
        EXAM_DATA.length + 1
      );
      done();
    });
  });

  it('should update an existing Exam with put()', (done) => {
    const updatedExam: IExamModel = { ...EXAM_DATA[0], grade: 100 };
    service.put('exam', updatedExam).subscribe((result) => {
      expect(result.grade).toBe(100);
      const storedData = service.getCollection('exam').value;
      expect(storedData.find((s) => s.id === updatedExam.id)?.grade).toBe(
        100
      );
      done();
    });
  });

  it('should delete a Exam with delete()', (done) => {
    const examToDelete = EXAM_DATA[0];
    service
      .delete('exam', { body: { id: examToDelete.id } })
      .subscribe((deleted) => {
        expect(deleted).toEqual(examToDelete);
        expect(service.getCollection('exam').value.length).toBe(
          EXAM_DATA.length - 1
        );
        done();
      });
  });
});
