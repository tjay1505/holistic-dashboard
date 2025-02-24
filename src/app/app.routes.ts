import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LandDigitComponent } from './land-digit/land-digit.component';
import { MonitoringComponent } from './monitoring/monitoring.component';
import { PersonnelComponent } from './personnel/personnel.component';
import { PayrollComponent } from './payroll/payroll.component';
import { Payroll2Component } from './payroll2/payroll2.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'tnhb',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'land-digit', component: LandDigitComponent },
      { path: 'monitoring', component: MonitoringComponent },
      { path: 'personnel', component: PersonnelComponent },
      { path: 'payroll', component: Payroll2Component },
    ],
  },
];
