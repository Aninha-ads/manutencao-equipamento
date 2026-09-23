import { ApplicationConfig, provideBrowserGlobalErrorListeners, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideNgxMask } from 'ngx-mask';
import { provideHttpClient } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';

// Registra os dados do idioma português
registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideNgxMask(),
    provideHttpClient(),
    { provide: LOCALE_ID, useValue: 'pt-BR' } // Coloca o idioma aqui
  ]
};

 
