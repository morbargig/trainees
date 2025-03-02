import { IExamModel, IStudentModel } from '../../mocks';
import { controlType } from './controllers';

export const BFF_APP_CONTROL_ROUTES = {
  ...({} as {
    exam: {
      method: 'get' | 'post' | 'put';
      response: IExamModel;
    };
  }),
  ...({} as {
    student: {
      method: 'get' | 'post' | 'put';
      response: IStudentModel;
    };
  }),
} as const satisfies controlType;
