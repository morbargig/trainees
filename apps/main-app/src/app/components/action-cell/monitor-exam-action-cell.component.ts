import { Component, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  BaseCellComponent,
  FilterObject,
  MatchMode,
} from '@softbar/front/dynamic-table';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { IExamModel } from '@softbar/api-interfaces';
import { ExamLocalStorageService } from '../../services/school/exam.service';
import { take } from 'rxjs';

@Component({
  standalone: true,
  template: `
    <mat-menu #actionMenu="matMenu" class="custom-mat-menu">
      <button mat-menu-item (click)="navigate()">
        <mat-icon>navigation</mat-icon> Navigate To
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
export class MonitorExamActionCellComponent<
  T extends { [key: string]: any },
  K extends keyof T
> extends BaseCellComponent<T, K> {
  constructor(
    cd: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private examLocalStorageService: ExamLocalStorageService
  ) {
    super(cd);
  }

  navigate() {
    this.examLocalStorageService
      .getCollectionLazyLoad('exam', {
        pageSize: Number.MAX_SAFE_INTEGER,
        pageNum: 0,
        filters: [
          {
            studentId: {
              matchMode: MatchMode.Equals,
              value: this.value,
            },
          },
        ],
      })
      .pipe(take(1))
      .subscribe((x) => {
        const filter: FilterObject<IExamModel> = {
          studentId: {
            matchMode: MatchMode.Equals,
            value: this.value,
          },
        };
        this.router.navigate(['../data'], {
          relativeTo: this.activatedRoute,
          state: { filter },
        });
      });
  }
}
