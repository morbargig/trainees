import { Component, Inject } from '@angular/core';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { IStudentModel } from '@softbar/api-interfaces';
import {
  DynamicFormGroupComponent,
  DynamicFormControl,
} from '@softbar/front/dynamic-forms';
import { MatIcon } from '@angular/material/icon';
import { MatCard } from '@angular/material/card';
import { MatToolbar } from '@angular/material/toolbar';
import { take } from 'rxjs';
import { Validators } from '@angular/forms';
import { StudentLocalStorageService } from '../../services/school/student.service';

@Component({
  template: `
    <mat-card class="header-card !m-0">
      <mat-toolbar color="primary" class="header-toolbar">
        <mat-icon>assignment</mat-icon>
        <span>{{ data?.type }}</span>
      </mat-toolbar>
      <div class="form-container">
        @if (configs?.length){
        <softbar-app-dynamic-form-group
          [hideSubmitButton]="data?.type === 'Show'"
          [config]="configs"
          [showCancelButton]="true"
          (formOnSubmit)="formOnSubmit($event)"
          (formOnCancel)="close()"
        ></softbar-app-dynamic-form-group>
        }
      </div>
    </mat-card>
  `,
  styles: [
    `
      .header-card {
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
      }

      .header-toolbar {
        display: flex;
        align-items: center;
        font-size: 1.5rem;
        font-weight: bold;
      }

      .header-toolbar mat-icon {
        margin-right: 10px;
      }

      .form-container {
        margin-top: 20px;
      }
    `,
  ],
  standalone: true,
  imports: [
    MatDialogModule,
    DynamicFormGroupComponent,
    MatIcon,
    MatCard,
    MatToolbar,
  ],
})
export class StudentFormComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      type: 'Show' | 'Edit' | 'Duplicate' | 'Create';
      id: IStudentModel['id'];
    },
    private studentLocalStorageService: StudentLocalStorageService,
    private dialogRef: MatDialogRef<StudentFormComponent> // Inject MatDialogRef
  ) {
    switch (this.data?.type) {
      case 'Edit':
      case 'Show':
      case 'Duplicate': {
        const { configs } = this;
        this.configs = [];
        this.studentLocalStorageService
          .get('student', { params: { id: this.data?.id } })
          .pipe(take(1))
          .subscribe((student) => {
            configs.forEach((dynConf) => {
              if (
                Object.prototype.hasOwnProperty.call(student, dynConf.field)
              ) {
                dynConf.value = student[dynConf.field as keyof IStudentModel];
              }
            });
            switch (this.data.type) {
              case 'Edit':
                configs.find((i) => i?.field === 'id').disabled = true;
                this.configs = configs;
                break;
              case 'Show':
                configs.forEach((i) => (i.disabled = true));
                this.configs = configs;
                break;
              case 'Duplicate': {
                this.configs = configs.filter((i) => i.field != 'id');
                break;
              }
            }
          });
        break;
      }
      case 'Create': {
        const idConfig: DynamicFormControl<IStudentModel> = this.configs.find(
          (i) => i?.field === 'id'
        );
        idConfig.hidden = true;
        idConfig.disabled = true;
      }
    }
  }
  formOnSubmit(t: IStudentModel) {
    switch (this.data.type) {
      case 'Duplicate':
      case 'Create':
      case 'Edit':
        (this.data.type === 'Edit'
          ? this.studentLocalStorageService.put
          : this.studentLocalStorageService.post
        )
          .bind(this.studentLocalStorageService)('student', t)
          .pipe()
          .subscribe((x) => {
            !!x && this.close();
          });
        break;
      default:
        break;
    }
  }
  close() {
    return this.dialogRef.close();
  }

  configs: DynamicFormControl<IStudentModel>[] = [
    {
      field: 'id',
      type: 'Default',
      label: 'Id',
      // validation: [Validators.required, Validators.min(1)],
      asyncValidation: [],
      errorMessages: {
        required: 'ID is required',
        min: 'ID must be a positive number',
      },
      data: {
        inputType: 'number',
      },
    },
    {
      field: 'name',
      type: 'Default',
      label: 'Name',
      validation: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ],
      errorMessages: {
        required: 'Name is required',
        minLength: 'Name must be at least 2 characters',
        maxLength: 'Name cannot exceed 50 characters',
      },
      data: {
        inputType: 'text',
      },
    },
    {
      field: 'dateJoined',
      type: 'Default',
      label: 'Date',
      validation: [Validators.required],
      errorMessages: {
        required: 'Date is required',
      },
      data: {
        inputType: 'date',
      },
    },
    {
      field: 'email',
      type: 'Default',
      label: 'Email',
      validation: [Validators.required, Validators.email],
      errorMessages: {
        required: 'Email is required',
        email: 'Invalid email format',
      },
      data: {
        inputType: 'email',
      },
    },
    {
      field: 'address',
      type: 'Default',
      label: 'Address',
      validation: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100),
      ],
      errorMessages: {
        required: 'Address is required',
        minLength: 'Address must be at least 5 characters',
        maxLength: 'Address cannot exceed 100 characters',
      },
      data: {
        inputType: 'text',
      },
    },
    {
      field: 'city',
      type: 'Default',
      label: 'City',
      validation: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ],
      errorMessages: {
        required: 'City is required',
        minLength: 'City must be at least 2 characters',
        maxLength: 'City cannot exceed 50 characters',
      },
      data: {
        inputType: 'text',
      },
    },
    {
      field: 'country',
      type: 'Default',
      label: 'Country',
      validation: [Validators.required],
      errorMessages: {
        required: 'Country is required',
      },
      data: {
        inputType: 'text',
      },
    },
    {
      field: 'zip',
      type: 'Default',
      label: 'Zip',
      validation: [Validators.required, Validators.pattern('^[0-9]{5,6}$')],
      errorMessages: {
        required: 'ZIP code is required',
        pattern: 'ZIP code must be a 5 or 6 digit number',
      },
      data: {
        inputType: 'number',
      },
    },
  ];
}
