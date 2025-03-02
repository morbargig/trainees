import { Routes } from '@angular/router';

export const ROUTES: Routes = [
  {
    title: 'Dashboard',
    path: '',
    loadComponent: () =>
      import('./pages/data/data.component').then(
        (m) => m.DataComponent
      ),
  },
  {
    title: 'Analysis',
    path: 'analysis',
    loadComponent: () =>
      import('./pages/analysis/analysis.component').then(
        (m) => m.AnalysisComponent
      ),
  },
  {
    title: 'Monitor',
    path: 'monitor',
    loadComponent: () =>
      import('./pages/monitor/monitor.component').then(
        (m) => m.MonitorComponent
      ),
  },
  { path: '**', title: 'Dashboard', redirectTo: '' },
];
