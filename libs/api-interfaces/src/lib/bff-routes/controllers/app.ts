import { IStudentElementModel } from '../../mocks';
import { controlType } from './controllers';

export const BFF_APP_CONTROL_ROUTES = {
  // students: {
  //   method: 'get',
  //   response: null as IStudentElementModel[],
  // },
  ...({} as
    | {
        student: {
          method: 'get' | 'post' | 'put' | 'delete';
          response: IStudentElementModel;
        };
      }
    // | {
    //     student: {
    //       method: 'delete';
    //       response: {
    //         status: boolean;
    //         method: 'delete';
    //       };
    //     };
    //   }
    ),
} as const satisfies controlType;
