import { Component, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { IStudentElementModel } from '@softbar/api-interfaces';
import { BaseCellComponent } from '@softbar/front/dynamic-table';
import { StudentLocalStorageService } from '../../services/student.service';
import { StudentFormComponent } from '../student-form/student-form.component';
import { MatMenuModule } from '@angular/material/menu';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  standalone: true,
  template: `
    <mat-menu #actionMenu="matMenu" class="custom-mat-menu">
      <button mat-menu-item (click)="onCopy()">
        <mat-icon>content_copy</mat-icon> Copy
      </button>
      <button mat-menu-item (click)="openPopUp('Edit')">
        <mat-icon>edit</mat-icon> Edit
      </button>
      <button mat-menu-item (click)="openPopUp('Show')">
        <mat-icon>visibility</mat-icon> Show
      </button>
      <button mat-menu-item (click)="onDelete()">
        <mat-icon>delete</mat-icon> Remove
      </button>
      <button mat-menu-item (click)="openPopUp('Duplicate')">
        <mat-icon>file_copy</mat-icon> Duplicate
      </button>
    </mat-menu>

    <!-- More Actions Button -->
    <button mat-icon-button [matMenuTriggerFor]="actionMenu">
      <mat-icon>more_vert</mat-icon>
    </button>
  `,
  styles: [
    `
      .mat-mdc-menu-content {
        background: white !important;
        border-radius: 4px;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
      }
    `,
  ],
  imports: [MatIconModule, MatMenuModule, MatButtonModule],
  encapsulation: ViewEncapsulation.None,
})
export class ClaimNumCellComponent extends BaseCellComponent<
  IStudentElementModel,
  'id'
> {
  constructor(
    private studentLocalStorageService: StudentLocalStorageService,
    cd: ChangeDetectorRef,
    private clipboard: Clipboard,
    private dialog: MatDialog
  ) {
    super(cd);
  }

  onCopy() {
    this.clipboard.copy(JSON.stringify(this.item));
  }
  openPopUp(type: StudentFormComponent['data']['type']) {
    this.dialog.open<StudentFormComponent, StudentFormComponent['data']>(
      StudentFormComponent,
      {
        data: {
          id: this.value,
          type,
        },
        width: '500px',
      }
    );
  }
  onDelete() {
    this.studentLocalStorageService.delete('student', {
      body: {
        id: this.item.id,
      },
    });
  }
}
