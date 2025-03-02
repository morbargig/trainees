import { Injectable } from '@angular/core';
import { LocalStorageHttpService } from '../local-storage.service';
import { STUDENT_DATA } from '../../mocks/school.mock';
import { TableFiltersServiceService } from '@softbar/front/dynamic-table';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentLocalStorageService extends LocalStorageHttpService<'school'> {
  constructor(tableFiltersServiceService: TableFiltersServiceService) {
    super('school', tableFiltersServiceService);
    if (!this.getDataFromStorage('student')?.length) {
      this.saveDataToStorage('student', STUDENT_DATA);
    }
  }
  override delete: LocalStorageHttpService<'school'>['delete'] = (
    key,
    option
  ) => {
    this.getCollection('exam')
      .pipe(take(1))
      .subscribe((exams) => {
        this.saveDataToStorage(
          'exam',
          exams?.filter((e) => e?.studentId !== option?.body?.id)
        );
      });
    return super.delete('student', option);
  };
}
