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
import { CustomerComponent } from 'src/app/components/customer/customer/customer.component';

//product
import { ProductComponent } from 'src/app/components/product/product/product.component';

//person
import { PersonComponent } from 'src/app/components/person/person/person.component';
import { PersoncontactComponent } from 'src/app/components/person/personcontact/personcontact.component';

//location
import { LocationComponent } from 'src/app/components/location/location/location.component';
import { LocationleveltypeComponent } from 'src/app/components/location/locationleveltype/locationleveltype.component';
import { LocationsearchfilterComponent } from 'src/app/components/location/locationsearchfilter/locationsearchfilter.component';

//finance
import { AccountComponent } from 'src/app/components/finance/account/account.component';
import { TaxcodeComponent } from 'src/app/components/finance/taxcode/taxcode.component';

//searchfilter
import { AccountsearchfilterComponent } from 'src/app/components/accountsearchfilter/accountsearchfilter.component';

//account
import { ApprovalreturnauthComponent } from 'src/app/components/account/approvalreturnauth/approvalreturnauth.component';
import { CreditcardtransactionComponent } from 'src/app/components/account/creditcardtransaction/creditcardtransaction.component';
import { CustomerrefundComponent } from 'src/app/components/account/customerrefund/customerrefund.component';
import { ExpensecategoryComponent } from 'src/app/components/account/expensecategory/expensecategory.component';
import { RecievereturnauthComponent } from 'src/app/components/account/recievereturnauth/recievereturnauth.component';
import { ReturnauthComponent } from 'src/app/components/account/returnauth/returnauth.component';
import { BankaccountComponent } from 'src/app/components/account/bankaccount/bankaccount.component';
import { BankdepositComponent } from 'src/app/components/account/bankdeposit/bankdeposit.component';
import { BankopeningbalanceComponent } from 'src/app/components/account/bankopeningbalance/bankopeningbalance.component';
import { BankreconciliationComponent } from 'src/app/components/account/bankreconciliation/bankreconciliation.component';
import { BanktransferComponent } from 'src/app/components/account/banktransfer/banktransfer.component';
import { CoaaccountComponent } from 'src/app/components/account/coaaccount/coaaccount.component';
import { JournalComponent } from 'src/app/components/account/journal/journal.component';
import { JournallineComponent } from 'src/app/components/account/journalline/journalline.component';
import { LedgeraccountComponent } from 'src/app/components/account/ledgeraccount/ledgeraccount.component';
import { LedgeraccountopeningbalanceComponent } from 'src/app/components/account/ledgeraccountopeningbalance/ledgeraccountopeningbalance.component';
import { LedgeraccountclassificationComponent } from 'src/app/components/account/ledgeraccountclassification/ledgeraccountclassification.component';
import { JournalopeningbalanceComponent } from 'src/app/components/account/journalopeningbalance/journalopeningbalance.component';
import { TransactionComponent } from 'src/app/components/account/transaction/transaction.component';
import { TrialbalanceComponent } from 'src/app/components/account/trialbalance/trialbalance.component';
import { LedgerentryComponent } from 'src/app/components/account/ledgerentry/ledgerentry.component';

//lookup
import { BankaccounttypeComponent } from 'src/app/components/lookup/bankaccounttype/bankaccounttype.component';
import { CurrencyComponent } from 'src/app/components/lookup/currency/currency.component';
import { GeneralratetypeComponent } from 'src/app/components/lookup/generalratetype/generalratetype.component';
import { CashflowratetypeComponent } from 'src/app/components/lookup/cashflowratetype/cashflowratetype.component';
import { ReturnstatusComponent } from 'src/app/components/lookup/returnstatus/returnstatus.component';
import { SaleordertypeComponent } from 'src/app/components/lookup/saleordertype/saleordertype.component';
import { CardtypeComponent } from 'src/app/components/lookup/cardtype/cardtype.component';
import { PostingperiodComponent } from 'src/app/components/lookup/postingperiod/postingperiod.component';
import { RefundmethodComponent } from 'src/app/components/lookup/refundmethod/refundmethod.component';
import { CurrencysymbolreplacementComponent } from 'src/app/components/lookup/currencysymbolreplacement/currencysymbolreplacement.component';
import { LedgeraccounttypeComponent } from 'src/app/components/lookup/ledgeraccounttype/ledgeraccounttype.component';
import { LedgeraccountgroupComponent } from 'src/app/components/lookup/ledgeraccountgroup/ledgeraccountgroup.component';
import { TransactiontypeComponent } from 'src/app/components/lookup/transactiontype/transactiontype.component';
import { ContacttypeComponent } from 'src/app/components/lookup/contacttype/contacttype.component';
import { PersontitleComponent } from 'src/app/components/lookup/persontitle/persontitle.component';
import { PaymentmethodComponent } from 'src/app/components/lookup/paymentmethod/paymentmethod.component';

//accounts
import { JournalsComponent } from 'src/app/modules/accounts/journals/journals.component';
import { TrialbalancesComponent } from 'src/app/modules/accounts/trialbalances/trialbalances.component';
import { ChartofaccountsComponent } from 'src/app/modules/accounts/chartofaccounts/chartofaccounts.component';
import { TransactionsComponent } from 'src/app/modules/accounts/transactions/transactions.component';

import { ChartofaccountviewComponent } from 'src/app/modules/accounts/chartofaccounts/chartofaccountview/chartofaccountview.component';
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
    PersonComponent,
    PersoncontactComponent,

    LocationComponent,
    LocationleveltypeComponent,
    LocationsearchfilterComponent,

    AccountsearchfilterComponent,

    AccountComponent,
    BankaccounttypeComponent,
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
    TaxcodeComponent,
    LedgerentryComponent,

    PaymentmethodComponent,
    CurrencyComponent,
    GeneralratetypeComponent,
    CashflowratetypeComponent,
    ReturnstatusComponent,
    SaleordertypeComponent,
    CardtypeComponent,
    PostingperiodComponent,
    RefundmethodComponent,
    CurrencysymbolreplacementComponent,
    LedgeraccountclassificationComponent,
    LedgeraccountgroupComponent,
    TransactiontypeComponent,
    ContacttypeComponent,
    PersontitleComponent,

    JournalsComponent,
    TrialbalancesComponent,
    ChartofaccountsComponent,
    TransactionsComponent,

    ChartofaccountviewComponent,
  ]
})

export class HomeModule {

  constructor() { }

  ngOnInit(): void {
  }
}
