import { Routes } from '@angular/router';
import { FormBuilderComponent } from './components/form-builder/form-builder.component';
import { FormListComponent } from './components/form-list/form-list.component';
import { FormPreviewComponent } from './components/form-preview/form-preview.component';
import { FormSubmissionComponent } from './components/form-submission/form-submission.component';
import { LoginComponent } from './components/login/login.component';
import { SubmittedFormsComponent } from './components/submitted-forms/submitted-forms.component'; // Import new component
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'forms', component: FormListComponent, canActivate: [AuthGuard] },
  { path: 'form-builder/:id', component: FormBuilderComponent, canActivate: [AuthGuard], data: { role: 'admin' } },
  { path: 'form-preview/:id', component: FormPreviewComponent, canActivate: [AuthGuard] },
  { path: 'form-submission/:id', component: FormSubmissionComponent, canActivate: [AuthGuard] },
  { path: 'submitted-forms', component: SubmittedFormsComponent, canActivate: [AuthGuard], data: { role: 'admin' } }, // New route
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];