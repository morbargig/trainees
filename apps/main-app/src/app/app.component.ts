import { Component, HostListener, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatListModule, MatNavList, MatListItem } from '@angular/material/list';

@Component({
  selector: 'softbar-root',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    MatToolbar,
    MatIcon,
    MatSidenavModule,
    MatListModule,
    MatNavList,
    MatListItem,
  ],
  template: `
    <mat-sidenav-container class="app-container">
      <mat-sidenav
        class="sidenav print:!hidden"
        #sidenav
        [mode]="isMobile ? 'over' : 'side'"
        [opened]="!isMobile"
      >
        @if (isMobile) {
        <mat-toolbar color="primary" (click)="closeSidenav()">
          <mat-icon>close</mat-icon> Menu</mat-toolbar
        >
        } @else {
        <mat-toolbar color="primary">Menu</mat-toolbar>
        }

        <mat-nav-list>
          <a mat-list-item routerLink="/" (click)="closeSidenav()">Data</a>
          <a mat-list-item routerLink="/analysis" (click)="closeSidenav()"
            >Analysis</a
          >
          <a mat-list-item routerLink="/monitor" (click)="closeSidenav()"
            >Monitor</a
          >
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content class="w-full print:!m-0">
        <mat-toolbar color="primary" class="sticky-header">
          <button
            class="p-0 pr-4 flex"
            mat-icon-button
            (click)="toggleSidenav()"
            *ngIf="isMobile"
          >
            <mat-icon>menu</mat-icon>
          </button>
          <span>Training System</span>
        </mat-toolbar>

        <div class="content h-full">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      .app-container {
        height: 100vh;
        display: flex;
      }
      .sidenav {
        width: 250px;
      }
      @media (max-width: 768px) {
        .sidenav {
          width: 100%;
        }
      }
      .table-card {
        margin: 20px;
        padding: 20px;
      }
      .sticky-header {
        position: sticky;
        top: 0;
        z-index: 1000;
      }
    `,
  ],
})
export class AppComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  isMobile: boolean = window.innerWidth < 768;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const target = event.target as Window;
    this.isMobile = target.innerWidth < 768;
    if (!this.isMobile) {
      this.sidenav.open();
    } else {
      this.sidenav.close();
    }
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }

  closeSidenav() {
    if (this.isMobile) {
      this.sidenav.close();
    }
  }
}
