import { Injectable } from '@angular/core';
import { LocalStorageHttpService } from './local-storage.service';
import { STUDENT_DATA } from '../mocks/mock-students';
import { TableFiltersServiceService } from '@softbar/front/dynamic-table';

@Injectable({
  providedIn: 'root',
})
export class StudentLocalStorageService extends LocalStorageHttpService<'students'> {
  constructor(tableFiltersServiceService: TableFiltersServiceService) {
    super(tableFiltersServiceService);
    if (!this.getDataFromStorage('student')?.length) {
      this.saveDataToStorage('student', STUDENT_DATA);
    }
  }
}
