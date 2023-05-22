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
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';

//home
import { AboutComponent } from '../home/dashboard/about/about.component';
import { ContactComponent } from '../home/dashboard/contact/contact.component';
import { IndexComponent } from '../home/dashboard/index/index.component';
import { ServicesComponent } from '../home/dashboard/services/services.component';
import { LegalComponent } from './dashboard/legal/legal.component';
import { PrivacyComponent } from './dashboard/privacy/privacy.component';
import { TermsComponent } from './dashboard/terms/terms.component';

//lookup
import { BankaccounttypeComponent } from 'src/app/components/lookup/account/bankaccounttype/bankaccounttype.component';
import { CurrencyComponent } from 'src/app/components/lookup/finance/currency/currency.component';
import { LedgeraccounttypeComponent } from 'src/app/components/lookup/account/ledgeraccounttype/ledgeraccounttype.component';
import { TransactiontypeComponent } from 'src/app/components/lookup/account/transactiontype/transactiontype.component';
import { PersontitleComponent } from 'src/app/components/lookup/person/persontitle/persontitle.component';
import { PaymentmethodComponent } from 'src/app/components/lookup/finance/paymentmethod/paymentmethod.component';

//customer
import { CustomerComponent } from 'src/app/components/customer/customer/customer.component';

//person
import { PersonComponent } from 'src/app/components/person/person/person.component';

//location
import { LocationComponent } from 'src/app/components/location/location/location.component';
import { LocationleveltypeComponent } from 'src/app/components/location/locationleveltype/locationleveltype.component';
import { LocationsearchfilterComponent } from 'src/app/components/location/locationsearchfilter/locationsearchfilter.component';

//finance
import { TaxcodeComponent } from 'src/app/components/finance/taxcode/taxcode.component';

//account
import { AccountComponent } from 'src/app/components/account/account/account.component';
import { BankaccountComponent } from 'src/app/components/account/bankaccount/bankaccount.component';
import { BankdepositComponent } from 'src/app/components/account/bankdeposit/bankdeposit.component';
import { BanktransferComponent } from 'src/app/components/account/banktransfer/banktransfer.component';
import { CoaaccountComponent } from 'src/app/components/account/coaaccount/coaaccount.component';
import { JournalComponent } from 'src/app/components/account/journal/journal.component';
import { JournallineComponent } from 'src/app/components/account/journalline/journalline.component';
import { LedgeraccountComponent } from 'src/app/components/account/ledgeraccount/ledgeraccount.component';
import { LedgeraccountclassificationComponent } from 'src/app/components/account/ledgeraccountclassification/ledgeraccountclassification.component';
import { TransactionComponent } from 'src/app/components/account/transaction/transaction.component';
import { TrialbalanceComponent } from 'src/app/components/account/trialbalance/trialbalance.component';
import { LedgerentryComponent } from 'src/app/components/account/ledgerentry/ledgerentry.component';

//searchfilter
import { AccountsearchfilterComponent } from 'src/app/components/accountsearchfilter/accountsearchfilter.component';

//accounts
import { JournalsComponent } from 'src/app/modules/accounts/journals/journals.component';
import { TrialbalancesComponent } from 'src/app/modules/accounts/trialbalances/trialbalances.component';
import { TransactionsComponent } from 'src/app/modules/accounts/transactions/transactions.component';
import { BankaccountsComponent } from 'src/app/modules/accounts/bankaccounts/bankaccounts.component';
import { AccountsComponent } from 'src/app/modules/accounts/accounts/accounts.component';
import { BankdepositsComponent } from 'src/app/modules/accounts/bankdeposits/bankdeposits.component';
import { BanktransfersComponent } from 'src/app/modules/accounts/banktransfers/banktransfers.component';
import { JournallinesComponent } from 'src/app/modules/accounts/journallines/journallines.component';
import { LedgeraccountsComponent } from 'src/app/modules/accounts/ledgeraccounts/ledgeraccounts.component';
import { LedgeraccountclassificationsComponent } from 'src/app/modules/accounts/ledgeraccountclassifications/ledgeraccountclassifications.component';
import { LedgerentriesComponent } from 'src/app/modules/accounts/ledgerentries/ledgerentries.component';
import { CoaaccountsComponent } from 'src/app/modules/accounts/coaaccounts/coaaccounts.component';

//accountview
import { BankaccountviewComponent } from 'src/app/modules/accounts/bankaccounts/bankaccountview/bankaccountview.component';
import { JournalviewComponent } from 'src/app/modules/accounts/journals/journalview/journalview.component';
import { TransactionviewComponent } from 'src/app/modules/accounts/transactions/transactionview/transactionview.component';
import { TrialbalanceviewComponent } from 'src/app/modules/accounts/trialbalances/trialbalanceview/trialbalanceview.component';
import { CoaaccountviewComponent } from 'src/app/modules/accounts/coaaccounts/coaaccountview/coaaccountview.component';
import { AccountviewComponent } from 'src/app/modules/accounts/accounts/accountview/accountview.component';
import { BankdepositviewComponent } from 'src/app/modules/accounts/bankdeposits/bankdepositview/bankdepositview.component';
import { BanktransferviewComponent } from 'src/app/modules/accounts/banktransfers/banktransferview/banktransferview.component';
import { JournallineviewComponent } from 'src/app/modules/accounts/journallines/journallineview/journallineview.component';
import { LedgeraccountviewComponent } from 'src/app/modules/accounts/ledgeraccounts/ledgeraccountview/ledgeraccountview.component';
import { LedgerentryviewComponent } from 'src/app/modules/accounts/ledgerentries/ledgerentryview/ledgerentryview.component';

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
    LegalComponent,
    PrivacyComponent,
    TermsComponent,

    CustomerComponent,
    PersonComponent,

    LocationComponent,
    LocationleveltypeComponent,
    LocationsearchfilterComponent,

    AccountsearchfilterComponent,

    AccountComponent,
    BankaccounttypeComponent,
    BankaccountComponent,
    BankdepositComponent,
    BanktransferComponent,
    CoaaccountComponent,
    JournalComponent,
    JournallineComponent,
    LedgeraccountComponent,
    LedgeraccounttypeComponent,
    TransactionComponent,
    TrialbalanceComponent,
    TaxcodeComponent,
    LedgerentryComponent,

    PaymentmethodComponent,
    CurrencyComponent,
    LedgeraccountclassificationComponent,
    TransactiontypeComponent,
    PersontitleComponent,

    JournalsComponent,
    TrialbalancesComponent,
    CoaaccountsComponent,
    TransactionsComponent,
    BankaccountsComponent,
    AccountsComponent,
    BankdepositsComponent,
    BanktransfersComponent,
    JournallinesComponent,
    LedgeraccountsComponent,
    LedgeraccountclassificationsComponent,
    LedgerentriesComponent,

    CoaaccountviewComponent,
    BankaccountviewComponent,
    JournalviewComponent,
    TransactionviewComponent,
    TrialbalanceviewComponent,
    AccountviewComponent,
    BankdepositviewComponent,
    BanktransferviewComponent,
    JournallineviewComponent,
    LedgeraccountviewComponent,
    LedgerentryviewComponent
  ]
})

export class HomeModule {

  constructor() { }

  ngOnInit(): void {
  }
}
