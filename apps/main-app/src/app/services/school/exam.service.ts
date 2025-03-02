import { Injectable } from '@angular/core';
import { LocalStorageHttpService } from '../local-storage.service';
import { EXAM_DATA } from '../../mocks/school.mock';
import { TableFiltersServiceService } from '@softbar/front/dynamic-table';

@Injectable({
  providedIn: 'root',
})
export class ExamLocalStorageService extends LocalStorageHttpService<'school'> {
  constructor(tableFiltersServiceService: TableFiltersServiceService) {
    super('school', tableFiltersServiceService);
    if (!this.getDataFromStorage('exam')?.length) {
      this.saveDataToStorage('exam', EXAM_DATA);
    }
  }
}
