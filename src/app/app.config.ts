import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { reducers } from './store/reducers';
import { FormEffects } from './store/effects/form.effects';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormService } from './services/form.service';
import { MockApiService } from './services/mock-api.service';
import { AuthService } from './services/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideStore(reducers),
    provideEffects([FormEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),
    provideAnimations(),
    { provide: FormService, useClass: FormService },
    { provide: MockApiService, useClass: MockApiService },
    { provide: AuthService, useClass: AuthService }
  ]
};

// Log to confirm providers are registered
console.log('[appConfig] Providers registered:', [
  'FormService',
  'MockApiService',
  'AuthService',
  'FormEffects'
]);