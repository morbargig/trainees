import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseHttpService } from '../../../services/base-http.service';
import { DynamicFormControl } from '@softbar/front/dynamic-forms';
import { ControllerApiType, User } from '@softbar/api-interfaces';

@Injectable({
  providedIn: 'root',
})
export class FormsApiService
  extends BaseHttpService<'students'>
  implements Pick<ControllerApiType<''>, 'helloForm'>
{
  readonly collationName = '';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
  helloForm() {
    return this.get<DynamicFormControl<User>[]>('hello-form');
  }
}
