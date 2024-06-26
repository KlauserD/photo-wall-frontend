import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OrgChartModule } from 'angular13-organization-chart';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './auth.interceptor';
import { EmployeeHierarchyComponent } from './employee-hierarchy/employee-hierarchy.component';
import { EmployeeHierarchyItemComponent } from './employee-hierarchy-item/employee-hierarchy-item.component';
import { CurrentZdFsjComponent } from './current-zd-fsj/current-zd-fsj.component';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PdfPageComponent } from './photowall-page/pdf-page.component';
import { TimedProgressBarComponent } from './timed-progress-bar/timed-progress-bar.component';
import { EmployeeHierarchyChildrenContainerComponent } from './employee-hierarchy-children-container/employee-hierarchy-children-container.component';
import { VolunteersComponent } from './volunteers/volunteers.component';
import { VolunteersPageComponent } from './volunteers-page/volunteers-page.component';

@NgModule({
  declarations: [
    AppComponent,
    EmployeeHierarchyComponent,
    EmployeeHierarchyItemComponent,
    CurrentZdFsjComponent,
    PdfPageComponent,
    TimedProgressBarComponent,
    EmployeeHierarchyChildrenContainerComponent,
    VolunteersComponent,
    VolunteersPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    OrgChartModule,
    PdfViewerModule
  ],
  providers: [
    {
      provide : HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi   : true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
