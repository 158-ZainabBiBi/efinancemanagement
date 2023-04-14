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

import { CustomerComponent } from '../../components/customer/customer/customer.component';
import { ProductComponent } from '../../components/product/product/product.component';
import { LocationComponent } from 'src/app/components/location/location/location.component';
import { LocationleveltypeComponent } from 'src/app/components/location/locationleveltype/locationleveltype.component';
import { LocationsearchfilterComponent } from 'src/app/components/location/locationsearchfilter/locationsearchfilter.component';
import { AccountsearchfilterComponent } from 'src/app/components/accountsearchfilter/accountsearchfilter.component';

import { AccountComponent } from '../../components/account/account/account.component';
import { AccounttypeComponent } from '../../components/account/accounttype/accounttype.component';
import { ApprovalreturnauthComponent } from '../../components/account/approvalreturnauth/approvalreturnauth.component';
import { CreditcardtransactionComponent } from '../../components/account/creditcardtransaction/creditcardtransaction.component';
import { CustomerrefundComponent } from '../../components/account/customerrefund/customerrefund.component';
import { ExpensecategoryComponent } from '../../components/account/expensecategory/expensecategory.component';
import { RecievereturnauthComponent } from '../../components/account/recievereturnauth/recievereturnauth.component';
import { ReturnauthComponent } from '../../components/account/returnauth/returnauth.component';

import { GeneralratetypeComponent } from '../../components/lookup/generalratetype/generalratetype.component';
import { CashflowratetypeComponent } from '../../components/lookup/cashflowratetype/cashflowratetype.component';
import { CurrencyComponent } from 'src/app/components/lookup/currency/currency.component';
import { ReturnstatusComponent } from '../../components/lookup/returnstatus/returnstatus.component';
import { SaleordertypeComponent } from '../../components/lookup/saleordertype/saleordertype.component';
import { CardtypeComponent } from '../../components/lookup/cardtype/cardtype.component';
import { PostingperiodComponent } from '../../components/lookup/postingperiod/postingperiod.component';
import { RefundmethodComponent } from '../../components/lookup/refundmethod/refundmethod.component';
import { CurrencysymbolreplacementComponent } from '../../components/lookup/currencysymbolreplacement/currencysymbolreplacement.component';

import { AccountsComponent } from '../accounts/accounts/accounts.component';
import { AccounttypesComponent } from '../accounts/accounttypes/accounttypes.component';
import { ApprovalreturnauthsComponent } from '../accounts/approvalreturnauths/approvalreturnauths.component';
import { CreditcardtransactionsComponent } from '../accounts/creditcardtransactions/creditcardtransactions.component';
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
    AccountsearchfilterComponent,

    AccountComponent,
    AccounttypeComponent,
    ApprovalreturnauthComponent,
    CreditcardtransactionComponent,
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
    CurrencyComponent,
    CurrencysymbolreplacementComponent,

    AccountsComponent,
    AccounttypesComponent,
    ApprovalreturnauthsComponent,
    CreditcardtransactionsComponent,
    CustomerrefundsComponent,
    ExpensecategoriesComponent,
    RecievereturnauthsComponent,
    ReturnauthsComponent,
  ],
})
export class HomeModule {
  constructor() { }

  ngOnInit(): void { }
}
