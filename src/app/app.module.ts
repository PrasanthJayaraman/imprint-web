import { Httpservice } from './services/httpservice.service';
import { AlertService } from './services/alert.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AlertsComponent } from './helpers/alerts/alerts.component';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarComponent } from './helpers/navbar/navbar.component';
import { DsrComponent } from './dsr/dsr.component';
import { HeaderComponent } from './helpers/header/header.component';
import { DatepickerComponent } from './helpers/datepicker/datepicker.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AlertsComponent,
    DashboardComponent,
    NavbarComponent,
    DsrComponent,
    HeaderComponent,    
    DatepickerComponent    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    FormsModule,
    HttpClientModule
  ],
  providers: [AlertService, Httpservice],
  bootstrap: [AppComponent]
})
export class AppModule { }