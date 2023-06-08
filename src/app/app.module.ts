import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';
import { HttpModule, RequestOptions } from '@angular/http';
import { ToastrModule } from 'ngx-toastr';
import { LoadingBarHttpModule } from '@ngx-loading-bar/http';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { RequestOptionsService } from './services/setting.headers';
import { HttpErrorInterceptor } from './services/http-error.interceptor';
import { DxiTotalItemModule } from 'devextreme-angular/ui/nested';
import { DxDataGridModule } from "devextreme-angular";
import { AccountclassificationsComponent } from './modules/accounts/accountclassifications/accountclassifications.component';
import { AccountclassificationviewComponent } from './modules/accounts/accountclassifications/accountclassificationview/accountclassificationview.component';
import { BalancesheetsComponent } from './modules/accounts/balancesheets/balancesheets.component';
import { BalancesheetviewComponent } from './modules/accounts/balancesheets/balancesheetview/balancesheetview.component';
import { ChartofaccountsComponent } from './modules/accounts/chartofaccounts/chartofaccounts.component';
import { ChartofaccountviewComponent } from './modules/accounts/chartofaccounts/chartofaccountview/chartofaccountview.component';
import { IncomestatementsComponent } from './modules/accounts/incomestatements/incomestatements.component';
import { IncomestatementviewComponent } from './modules/accounts/incomestatements/incomestatementview/incomestatementview.component';
import { LedgersComponent } from './modules/accounts/ledgers/ledgers.component';
import { LedgerviewComponent } from './modules/accounts/ledgers/ledgerview/ledgerview.component';
import { ProfitandlossesComponent } from './modules/accounts/profitandlosses/profitandlosses.component';
import { ProfitandlossviewComponent } from './modules/accounts/profitandlosses/profitandlossview/profitandlossview.component';

@NgModule({
  declarations: [AppComponent, LoginComponent, NotfoundComponent, AccountclassificationsComponent, AccountclassificationviewComponent, BalancesheetsComponent, BalancesheetviewComponent, ChartofaccountsComponent, ChartofaccountviewComponent, IncomestatementsComponent, IncomestatementviewComponent, LedgersComponent, LedgerviewComponent, ProfitandlossesComponent, ProfitandlossviewComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(),
    HttpClientModule,
    HttpModule,
    LoadingBarHttpModule,
    LoadingBarRouterModule,
    LoadingBarHttpClientModule,
    LoadingBarModule.forRoot(),
    SweetAlert2Module.forRoot(),
    NgxSpinnerModule,
    ReactiveFormsModule,
    AppRoutingModule,
    DxiTotalItemModule,
    DxDataGridModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
    {
      provide: RequestOptions,
      useClass: RequestOptionsService,
    },
    // AuthGuardService,
    DatePipe,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
