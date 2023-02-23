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

import { CustomerComponent } from '../../components/customers/customer/customer.component';
import { ProductComponent } from '../../components/products/product/product.component';
import { LocationComponent } from 'src/app/components/locations/location/location.component';
import { LocationleveltypeComponent } from 'src/app/components/locations/locationleveltype/locationleveltype.component';
import { LocationsearchfilterComponent } from 'src/app/components/locations/locationsearchfilter/locationsearchfilter.component';

import { AccountComponent } from '../../components/accounts/account/account.component';
import { AccounttypeComponent } from '../../components/accounts/accounttype/accounttype.component';
import { ApprovalreturnauthComponent } from '../../components/accounts/approvalreturnauth/approvalreturnauth.component';
import { CreditcardtransactionComponent } from '../../components/accounts/creditcardtransaction/creditcardtransaction.component';
import { CurrencyComponent } from '../../components/accounts/currency/currency.component';
import { CurrencyexchangerateComponent } from '../../components/accounts/currencyexchangerate/currencyexchangerate.component';
import { CustomerrefundComponent } from '../../components/accounts/customerrefund/customerrefund.component';
import { ExpensecategoryComponent } from '../../components/accounts/expensecategory/expensecategory.component';
import { RecievereturnauthComponent } from '../../components/accounts/recievereturnauth/recievereturnauth.component';
import { ReturnauthComponent } from '../../components/accounts/returnauth/returnauth.component';

import { GeneralratetypeComponent } from '../../components/lookups/generalratetype/generalratetype.component';
import { CashflowratetypeComponent } from '../../components/lookups/cashflowratetype/cashflowratetype.component';

import { ReturnstatusComponent } from'../../components/lookups/returnstatus/returnstatus.component';
import { SaleordertypeComponent } from'../../components/lookups/saleordertype/saleordertype.component';
import { CardtypeComponent } from'../../components/lookups/cardtype/cardtype.component';
import { PostingperiodComponent } from'../../components/lookups/postingperiod/postingperiod.component';
import { RefundmethodComponent } from'../../components/lookups/refundmethod/refundmethod.component';
import { CurrencysymbolreplacementComponent } from'../../components/lookups/currencysymbolreplacement/currencysymbolreplacement.component';

import { AccountsComponent } from '../accounts/accounts/accounts.component';
import { AccounttypesComponent } from '../accounts/accounttypes/accounttypes.component';
import { ApprovalreturnauthsComponent } from '../accounts/approvalreturnauths/approvalreturnauths.component';
import { CreditcardtransactionsComponent } from '../accounts/creditcardtransactions/creditcardtransactions.component';
import { CurrenciesComponent } from '../accounts/currencies/currencies.component';
import { CurrencyexchangeratesComponent } from '../accounts/currencyexchangerates/currencyexchangerates.component';
import { CustomerrefundsComponent } from '../accounts/customerrefunds/customerrefunds.component';
import { ExpensecategoriesComponent } from '../accounts/expensecategories/expensecategories.component';
import { RecievereturnauthsComponent } from '../accounts/recievereturnauths/recievereturnauths.component';
import { ReturnauthsComponent } from '../accounts/returnauths/returnauths.component';

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

    CustomerComponent,
    ProductComponent,
    LocationComponent,
    LocationleveltypeComponent,
    LocationsearchfilterComponent,

    AccountComponent,
    AccounttypeComponent,
    ApprovalreturnauthComponent,
    CreditcardtransactionComponent,
    CurrencyComponent,
    CurrencyexchangerateComponent,
    CustomerrefundComponent,
    ExpensecategoryComponent,
    RecievereturnauthComponent,
    ReturnauthComponent,

    GeneralratetypeComponent,
    CashflowratetypeComponent,
    ReturnstatusComponent,
    SaleordertypeComponent,
    CardtypeComponent,
    PostingperiodComponent,
    RefundmethodComponent,
    CurrencysymbolreplacementComponent,

    AccountsComponent,
    AccounttypesComponent,
    ApprovalreturnauthsComponent,
    CreditcardtransactionsComponent,
    CurrenciesComponent,
    CurrencyexchangeratesComponent,
    CustomerrefundsComponent,
    ExpensecategoriesComponent,
    RecievereturnauthsComponent,
    ReturnauthsComponent,
  ],
})
export class HomeModule {
  constructor() {}

  ngOnInit(): void {}
}
