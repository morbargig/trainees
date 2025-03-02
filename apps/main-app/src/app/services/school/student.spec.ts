import { TestBed } from '@angular/core/testing';
import {
  MatchMode,
  TableFiltersServiceService,
} from '@softbar/front/dynamic-table';
import { LazyLoadEvent } from '@softbar/front/dynamic-table';
import { StudentLocalStorageService } from './student.service';
import { STUDENT_DATA } from '../../mocks/school.mock';
import { IStudentModel } from '@softbar/api-interfaces';

describe('StudentLocalStorageService', () => {
  let service: StudentLocalStorageService;
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
        StudentLocalStorageService,
      ],
    });
    localStorage.clear(); // ✅ Ensure a clean slate before each test
    service = TestBed.inject(StudentLocalStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize storage with mock student data', () => {
    const storedData = JSON.parse(
      localStorage.getItem('students/student') || '[]'
    );
    expect(storedData).toEqual(STUDENT_DATA);
  });

  it('should return a BehaviorSubject from getCollection()', () => {
    const collection$ = service.getCollection('exam');
    expect(collection$).toBeDefined();
    expect(collection$.value).toEqual(STUDENT_DATA);
  });

  it('should retrieve filtered data with getCollectionLazyLoad()', (done) => {
    const lazyLoadEvent: LazyLoadEvent = {
      filters: [{ id: { matchMode: MatchMode.Equals, value: 1 } }],
    };

    service
      .getCollectionLazyLoad('exam', lazyLoadEvent)
      .subscribe((response) => {
        expect(response.data).toEqual(STUDENT_DATA);
        expect(response.totalRecords).toBe(STUDENT_DATA.length);
        done();
      });
  });

  it('should add a new student with post()', (done) => {
    const newStudent: IStudentModel = STUDENT_DATA.at(0);
    service.post('student', newStudent).subscribe((addedStudent) => {
      expect(addedStudent.id).toBeDefined(); // ✅ ID should be assigned
      expect(service.getCollection('student').value.length).toBe(
        STUDENT_DATA.length + 1
      );
      done();
    });
  });

  it('should update an existing student with put()', (done) => {
    const updatedStudent = { ...STUDENT_DATA[0], name: 'Updated Name' };
    service.put('student', updatedStudent).subscribe((result) => {
      expect(result.name).toBe('Updated Name');
      const storedData = service.getCollection('exam').value;
      expect(storedData.find((s) => s.id === updatedStudent.id)?.name).toBe(
        'Updated Name'
      );
      done();
    });
  });

  it('should delete a student with delete()', (done) => {
    const studentToDelete = STUDENT_DATA[0];
    service
      .delete('exam', { body: { id: studentToDelete.id } })
      .subscribe((deleted) => {
        expect(deleted).toEqual(studentToDelete);
        expect(service.getCollection('exam').value.length).toBe(
          STUDENT_DATA.length - 1
        );
        done();
      });
  });

  it('should return an empty array if there is no data in storage', () => {
    localStorage.clear();
    const collection$ = service.getCollection('exam');
    expect(collection$.value).toEqual([]);
  });
});
