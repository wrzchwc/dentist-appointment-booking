import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { CredentialsInterceptor } from './app/shared/interceptors/credentials.interceptor';
import { provideRouter } from '@angular/router';
import { APP_ROUTES } from './app/routes';
import { provideAnimations } from '@angular/platform-browser/animations';

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: CredentialsInterceptor,
            multi: true,
        },
        provideRouter(APP_ROUTES),
        importProvidersFrom(HttpClientModule),
        provideAnimations()
    ],
}).catch(console.error);
