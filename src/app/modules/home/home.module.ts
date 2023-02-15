import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  DxMenuModule,
  DxRangeSelectorModule,
  DxPopupModule,
  DxChartModule,
  DxPieChartModule,
  DxVectorMapModule,
  DxDataGridModule,
  DxBulletModule,
  DxButtonModule,
  DxCheckBoxModule,
  DxSelectBoxModule,
  DxDropDownButtonModule,
} from 'devextreme-angular';
import { IconPickerModule } from 'ngx-icon-picker';

import { SharedModule } from '../shared/shared.module';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';

import { StudentinstanceComponent } from 'src/app/components/students/studentinstance/studentinstance.component';

import { AccountComponent } from '../../components/finances/account/account.component';
import { AccounttypeComponent } from '../../components/finances/accounttype/accounttype.component';
import { TaxcodeComponent } from '../../components/finances/taxcode/taxcode.component';
import { PaymentComponent } from '../../components/finances/payment/payment.component';
import { PaymentinvoiceComponent } from '../../components/finances/paymentinvoice/paymentinvoice.component';

import { GeneralratetypeComponent } from '../../components/lookups/generalratetype/generalratetype.component';
import { CashflowratetypeComponent } from '../../components/lookups/cashflowratetype/cashflowratetype.component';
import { PaymentmethodComponent } from '../../components/lookups/paymentmethod/paymentmethod.component';
import { PaymentstatusComponent } from '../../components/lookups/paymentstatus/paymentstatus.component';

import { AccountsComponent } from '../finances/accounts/accounts.component';
import { AccounttypesComponent } from '../finances/accounttypes/accounttypes.component';
import { TaxcodesComponent } from '../finances/taxcodes/taxcodes.component';
import { PaymentsComponent } from '../finances/payments/payments.component';

@NgModule({
  imports: [
    HomeRoutingModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    NgxSpinnerModule,
    NgSelectModule,
    CommonModule,
    SharedModule,
    DxMenuModule,
    DxRangeSelectorModule,
    DxPopupModule,
    DxChartModule,
    DxPieChartModule,
    DxVectorMapModule,
    DxDataGridModule,
    DxBulletModule,
    DxButtonModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
    DxDropDownButtonModule,
    IconPickerModule,
  ],
  declarations: [
    HomeComponent,
    DashboardComponent,

    StudentinstanceComponent,

    AccountComponent,
    AccounttypeComponent,
    TaxcodeComponent,
    PaymentComponent,
    PaymentinvoiceComponent,

    GeneralratetypeComponent,
    CashflowratetypeComponent,
    PaymentmethodComponent,
    PaymentstatusComponent,

    AccountsComponent,
    AccounttypesComponent,
    TaxcodesComponent,
    PaymentsComponent,
  ],
})
export class HomeModule {
  constructor() {}

  ngOnInit(): void {}
}
