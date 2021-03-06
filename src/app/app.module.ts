import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AddQuickQuestionDialogComponent } from './dialogs/add-quick-question-dialog.component';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete-dialog.component';
import { PrintDialogComponent } from './dialogs/print-dialog.component';
import { PublishDialogComponent } from './dialogs/publish-dialog.component';
import { SaveAsDialogComponent } from './dialogs/save-as-dialog.component';
import { SearchConvDialogComponent } from './dialogs/search-conv-dialog.component';
import { SearchTagDialogComponent } from './dialogs/search-tag-dialog.component';
import { ShareSurveyDialogComponent } from './dialogs/share-survey-dialog.component';
import { NavbarComponent } from './home/navbar/navbar.component';
import { BackendService } from './services/backend.service';
import { ReteComponent } from './home/rete/rete.component';
import { AppRoutingModule } from './routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPrintModule } from 'ngx-print';

import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { AuthHtppInterceptorService } from './services/auth-http-interceptor.service';
import { ImportConversationDialogComponent } from './dialogs/import-conversation-dialog.component';
import { UtilsService } from './services/utils.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AddQuickQuestionDialogComponent,
    ConfirmDialogComponent,
    DeleteDialogComponent,
    PrintDialogComponent,
    PublishDialogComponent,
    SaveAsDialogComponent,
    SearchConvDialogComponent,
    SearchTagDialogComponent,
    ShareSurveyDialogComponent,
    ImportConversationDialogComponent,
    NavbarComponent,
    ReteComponent,
    LoginComponent,
    LogoutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatSliderModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatButtonModule,
    MatRadioModule,
    MatInputModule,
    MatMenuModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    NgbModule,
    RouterModule,
    NgxPrintModule,
  ],
  exports: [
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: AuthHtppInterceptorService, multi: true
    },
    BackendService,
    UtilsService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    SearchConvDialogComponent,
    SaveAsDialogComponent,
    DeleteDialogComponent,
    ConfirmDialogComponent,
    PublishDialogComponent,
    AddQuickQuestionDialogComponent,
    PrintDialogComponent,
    SearchTagDialogComponent,
    ShareSurveyDialogComponent,
    ImportConversationDialogComponent,
  ]
})
export class AppModule { }
