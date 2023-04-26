import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
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
import { IconPickerModule } from "ngx-icon-picker";
import { SharedModule } from '../shared/shared.module';

//home
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AboutComponent } from '../home/dashboard/about/about.component';
import { ContactComponent } from '../home/dashboard/contact/contact.component';
import { IndexComponent } from '../home/dashboard/index/index.component';
import { ServicesComponent } from '../home/dashboard/services/services.component';

//customer
import { CustomerComponent } from '../../components/customer/customer/customer.component';

//product
import { ProductComponent } from '../../components/product/product/product.component';

//location
import { LocationComponent } from 'src/app/components/location/location/location.component';
import { LocationleveltypeComponent } from 'src/app/components/location/locationleveltype/locationleveltype.component';
import { LocationsearchfilterComponent } from 'src/app/components/location/locationsearchfilter/locationsearchfilter.component';

//searchfilter
import { AccountsearchfilterComponent } from 'src/app/components/accountsearchfilter/accountsearchfilter.component';

//account
import { AccountComponent } from '../../components/account/account/account.component';
import { ApprovalreturnauthComponent } from '../../components/account/approvalreturnauth/approvalreturnauth.component';
import { CreditcardtransactionComponent } from '../../components/account/creditcardtransaction/creditcardtransaction.component';
import { CustomerrefundComponent } from '../../components/account/customerrefund/customerrefund.component';
import { ExpensecategoryComponent } from '../../components/account/expensecategory/expensecategory.component';
import { RecievereturnauthComponent } from '../../components/account/recievereturnauth/recievereturnauth.component';
import { ReturnauthComponent } from '../../components/account/returnauth/returnauth.component';
import { BankaccountComponent } from '../../components/account/bankaccount/bankaccount.component';
import { BankdepositComponent } from '../../components/account/bankdeposit/bankdeposit.component';
import { BankopeningbalanceComponent } from '../../components/account/bankopeningbalance/bankopeningbalance.component';
import { BankreconciliationComponent } from '../../components/account/bankreconciliation/bankreconciliation.component';
import { BanktransferComponent } from '../../components/account/banktransfer/banktransfer.component';
import { CoaaccountComponent } from '../../components/account/coaaccount/coaaccount.component';
import { JournalComponent } from '../../components/account/journal/journal.component';
import { JournallineComponent } from '../../components/account/journalline/journalline.component';
import { LedgeraccountComponent } from '../../components/account/ledgeraccount/ledgeraccount.component';
import { LedgeraccountopeningbalanceComponent } from '../../components/account/ledgeraccountopeningbalance/ledgeraccountopeningbalance.component';
import { LedgeraccounttypeComponent } from '../../components/account/ledgeraccounttype/ledgeraccounttype.component';
import { JournalopeningbalanceComponent } from '../../components/account/journalopeningbalance/journalopeningbalance.component';
import { TransactionComponent } from '../../components/account/transaction/transaction.component';
import { TrialbalanceComponent } from '../../components/account/trialbalance/trialbalance.component';

//lookup
import { BankaccounttypeComponent } from '../../components/lookup/bankaccounttype/bankaccounttype.component';
import { CurrencyComponent } from '../../components/lookup/currency/currency.component';
import { GeneralratetypeComponent } from '../../components/lookup/generalratetype/generalratetype.component';
import { CashflowratetypeComponent } from '../../components/lookup/cashflowratetype/cashflowratetype.component';
import { ReturnstatusComponent } from '../../components/lookup/returnstatus/returnstatus.component';
import { SaleordertypeComponent } from '../../components/lookup/saleordertype/saleordertype.component';
import { CardtypeComponent } from '../../components/lookup/cardtype/cardtype.component';
import { PostingperiodComponent } from '../../components/lookup/postingperiod/postingperiod.component';
import { RefundmethodComponent } from '../../components/lookup/refundmethod/refundmethod.component';
import { CurrencysymbolreplacementComponent } from '../../components/lookup/currencysymbolreplacement/currencysymbolreplacement.component';
import { PaymentmethodComponent } from 'src/app/components/lookup/paymentmethod/paymentmethod.component';
import { StatusComponent } from 'src/app/components/lookup/status/status.component';
import { TransactiontypeComponent } from 'src/app/components/lookup/transactiontype/transactiontype.component';

//accounts
// import { AccountsComponent } from '../accounts/accounts/accounts.component';
// import { CompaniesComponent } from '../accounts/companies/companies.component';
// import { TransactionsComponent } from '../accounts/transactions/transactions.component';

@NgModule({
  imports: [
    HomeRoutingModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
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

    AboutComponent,
    ContactComponent,
    IndexComponent,
    ServicesComponent,

    CustomerComponent,
    ProductComponent,
    LocationComponent,
    LocationleveltypeComponent,
    LocationsearchfilterComponent,
    AccountsearchfilterComponent,

    AccountComponent,
    ApprovalreturnauthComponent,
    CreditcardtransactionComponent,
    CustomerrefundComponent,
    ExpensecategoryComponent,
    RecievereturnauthComponent,
    ReturnauthComponent,
    BankaccountComponent,
    BankdepositComponent,
    BankopeningbalanceComponent,
    BankreconciliationComponent,
    BanktransferComponent,
    CoaaccountComponent,
    JournalComponent,
    JournallineComponent,
    LedgeraccountComponent,
    LedgeraccountopeningbalanceComponent,
    LedgeraccounttypeComponent,
    JournalopeningbalanceComponent,
    TransactionComponent,
    TrialbalanceComponent,

    CurrencyComponent,
    GeneralratetypeComponent,
    CashflowratetypeComponent,
    ReturnstatusComponent,
    SaleordertypeComponent,
    CardtypeComponent,
    PostingperiodComponent,
    RefundmethodComponent,
    CurrencysymbolreplacementComponent,
    PaymentmethodComponent,
    StatusComponent,
    TransactiontypeComponent,
    BankaccounttypeComponent,

    // AccountsComponent,
    // CompaniesComponent,
    // TransactionsComponent
  ]
})

export class HomeModule {

  constructor() { }

  ngOnInit(): void {
  }
}
