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
import { TermComponent } from './dashboard/term/term.component';
import { FooterComponent } from 'src/app/partials/footer/footer.component';

//lookup
import { BankaccounttypeComponent } from 'src/app/components/lookup/account/bankaccounttype/bankaccounttype.component';
import { CurrencyComponent } from 'src/app/components/lookup/finance/currency/currency.component';
import { AccounttypeComponent } from 'src/app/components/lookup/account/accounttype/accounttype.component';
import { TransactiontypeComponent } from 'src/app/components/lookup/account/transactiontype/transactiontype.component';
import { PersontitleComponent } from 'src/app/components/person/persontitle/persontitle.component';
import { PaymentmethodComponent } from 'src/app/components/lookup/finance/paymentmethod/paymentmethod.component';

//lookup//customer
import { CustomerstatusComponent } from 'src/app/components/lookup/customer/customerstatus/customerstatus.component';
import { CredittermsComponent } from 'src/app/components/lookup/customer/creditterms/creditterms.component';
import { HoldComponent } from 'src/app/components/lookup/customer/hold/hold.component';
import { CustomercategoryComponent } from 'src/app/components/lookup/customer/customercategory/customercategory.component';
import { BusinesstypeComponent } from 'src/app/components/lookup/customer/businesstype/businesstype.component';
import { BusinessmarketnicheComponent } from 'src/app/components/lookup/customer/businessmarketniche/businessmarketniche.component';
import { CallacationstatusComponent } from 'src/app/components/lookup/customer/callacationstatus/callacationstatus.component';
import { WeekdayComponent } from 'src/app/components/lookup/customer/weekday/weekday.component';
import { TermsComponent } from 'src/app/components/lookup/customer/terms/terms.component';
import { RegulatorybodyComponent } from 'src/app/components/lookup/customer/regulatorybody/regulatorybody.component';
import { InvoicetypeComponent } from 'src/app/components/lookup/customer/invoicetype/invoicetype.component';
import { PricelevelComponent } from 'src/app/components/lookup/customer/pricelevel/pricelevel.component';

//common
import { AddressComponent } from 'src/app/components/common/address/address.component';

//customer
import { CustomerComponent } from 'src/app/components/customer/customer/customer.component';
import { CustomersComponent } from 'src/app/modules/customers/customers/customers.component';
import { CustomerviewComponent } from 'src/app/modules/customers/customers/customerview/customerview.component';

//person
import { PersonComponent } from 'src/app/components/person/person/person.component';
import { EmployeeComponent } from 'src/app/components/employee/employee/employee.component';
import { CompanyComponent } from 'src/app/components/company/company/company.component';


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
import { JournalComponent } from 'src/app/components/account/journal/journal.component';
import { TransactionComponent } from 'src/app/components/account/transaction/transaction.component';
import { TrialbalanceComponent } from 'src/app/components/account/trialbalance/trialbalance.component';
import { AccountclassificationComponent } from 'src/app/components/account/accountclassification/accountclassification.component';
import { BalancesheetComponent } from 'src/app/components/account/balancesheet/balancesheet.component';
import { ChartofaccountComponent } from 'src/app/components/account/chartofaccount/chartofaccount.component';
import { IncomestatementComponent } from 'src/app/components/account/incomestatement/incomestatement.component';
import { LedgerComponent } from 'src/app/components/account/ledger/ledger.component';
import { ProfitandlossComponent } from 'src/app/components/account/profitandloss/profitandloss.component';

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
import { BankaccountviewComponent } from 'src/app/modules/accounts/bankaccounts/bankaccountview/bankaccountview.component';
import { JournalviewComponent } from 'src/app/modules/accounts/journals/journalview/journalview.component';
import { TransactionviewComponent } from 'src/app/modules/accounts/transactions/transactionview/transactionview.component';
import { TrialbalanceviewComponent } from 'src/app/modules/accounts/trialbalances/trialbalanceview/trialbalanceview.component';
import { AccountviewComponent } from 'src/app/modules/accounts/accounts/accountview/accountview.component';
import { BankdepositviewComponent } from 'src/app/modules/accounts/bankdeposits/bankdepositview/bankdepositview.component';
import { BanktransferviewComponent } from 'src/app/modules/accounts/banktransfers/banktransferview/banktransferview.component';
import { AccountclassificationsComponent } from 'src/app/modules/accounts/accountclassifications/accountclassifications.component';
import { AccountclassificationviewComponent } from 'src/app/modules/accounts/accountclassifications/accountclassificationview/accountclassificationview.component';
import { BalancesheetsComponent } from 'src/app/modules/accounts/balancesheets/balancesheets.component';
import { BalancesheetviewComponent } from 'src/app/modules/accounts/balancesheets/balancesheetview/balancesheetview.component';
import { ChartofaccountsComponent } from 'src/app/modules/accounts/chartofaccounts/chartofaccounts.component';
import { ChartofaccountviewComponent } from 'src/app/modules/accounts/chartofaccounts/chartofaccountview/chartofaccountview.component';
import { IncomestatementsComponent } from 'src/app/modules/accounts/incomestatements/incomestatements.component';
import { IncomestatementviewComponent } from 'src/app/modules/accounts/incomestatements/incomestatementview/incomestatementview.component';
import { LedgersComponent } from 'src/app/modules/accounts/ledgers/ledgers.component';
import { LedgerviewComponent } from 'src/app/modules/accounts/ledgers/ledgerview/ledgerview.component';
import { ProfitandlossesComponent } from 'src/app/modules/accounts/profitandlosses/profitandlosses.component';
import { ProfitandlossviewComponent } from 'src/app/modules/accounts/profitandlosses/profitandlossview/profitandlossview.component';

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
    TermComponent,
    FooterComponent,

    //lookup//customer
    CustomerstatusComponent,
    CredittermsComponent,
    HoldComponent,
    CustomercategoryComponent,
    BusinesstypeComponent,
    BusinessmarketnicheComponent,
    CallacationstatusComponent,
    WeekdayComponent,
    TermsComponent,
    RegulatorybodyComponent,
    InvoicetypeComponent,
    PricelevelComponent,

    AddressComponent,

    CustomerComponent,
    CustomersComponent,
    CustomerviewComponent,

    EmployeeComponent,
    CompanyComponent,
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
    JournalComponent,
    AccounttypeComponent,
    TransactionComponent,
    TrialbalanceComponent,
    TaxcodeComponent,
    AccountclassificationComponent,
    BalancesheetComponent,
    ChartofaccountComponent,
    IncomestatementComponent,
    LedgerComponent,
    ProfitandlossComponent,

    PaymentmethodComponent,
    CurrencyComponent,
    TransactiontypeComponent,
    PersontitleComponent,

    JournalsComponent,
    TrialbalancesComponent,
    TransactionsComponent,
    BankaccountsComponent,
    AccountsComponent,
    BankdepositsComponent,
    BanktransfersComponent,

    BankaccountviewComponent,
    JournalviewComponent,
    TransactionviewComponent,
    TrialbalanceviewComponent,
    AccountviewComponent,
    BankdepositviewComponent,
    BanktransferviewComponent,
    AccountclassificationsComponent,
    AccountclassificationviewComponent,
    BalancesheetsComponent,
    BalancesheetviewComponent,
    ChartofaccountsComponent,
    ChartofaccountviewComponent,
    IncomestatementsComponent,
    IncomestatementviewComponent,
    LedgersComponent,
    LedgerviewComponent,
    ProfitandlossesComponent, ProfitandlossviewComponent
  ]
})

export class HomeModule {

  constructor() { }

  ngOnInit(): void {
  }
}
