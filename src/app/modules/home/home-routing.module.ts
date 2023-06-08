import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotfoundComponent } from '../../pages/notfound/notfound.component';
import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AboutComponent } from '../home/dashboard/about/about.component';
import { ContactComponent } from '../home/dashboard/contact/contact.component';
import { IndexComponent } from '../home/dashboard/index/index.component';
import { ServicesComponent } from '../home/dashboard/services/services.component';
import { LegalComponent } from './dashboard/legal/legal.component';
import { PrivacyComponent } from './dashboard/privacy/privacy.component';
import { TermsComponent } from './dashboard/terms/terms.component';

//accounts
import { JournalsComponent } from 'src/app/modules/accounts/journals/journals.component';
import { TrialbalancesComponent } from 'src/app/modules/accounts/trialbalances/trialbalances.component';
import { TransactionsComponent } from 'src/app/modules/accounts/transactions/transactions.component';
import { BankaccountsComponent } from 'src/app/modules/accounts/bankaccounts/bankaccounts.component';
import { AccountsComponent } from 'src/app/modules/accounts/accounts/accounts.component';
import { BankdepositsComponent } from 'src/app/modules/accounts/bankdeposits/bankdeposits.component';
import { BanktransfersComponent } from 'src/app/modules/accounts/banktransfers/banktransfers.component';

//accountview
import { BankaccountviewComponent } from 'src/app/modules/accounts/bankaccounts/bankaccountview/bankaccountview.component';
import { JournalviewComponent } from 'src/app/modules/accounts/journals/journalview/journalview.component';
import { TransactionviewComponent } from 'src/app/modules/accounts/transactions/transactionview/transactionview.component';
import { TrialbalanceviewComponent } from 'src/app/modules/accounts/trialbalances/trialbalanceview/trialbalanceview.component';
import { AccountviewComponent } from 'src/app/modules/accounts/accounts/accountview/accountview.component';
import { BankdepositviewComponent } from 'src/app/modules/accounts/bankdeposits/bankdepositview/bankdepositview.component';
import { BanktransferviewComponent } from 'src/app/modules/accounts/banktransfers/banktransferview/banktransferview.component';

//customer
import { CustomersComponent } from '../customers/customers/customers.component';

const routes: Routes = [{
  path: '', component: HomeComponent,
  children: [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'indexes', component: IndexComponent },
    { path: 'about', component: AboutComponent },
    { path: 'services', component: ServicesComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'legal', component: LegalComponent },
    { path: 'privacy', component: PrivacyComponent },
    { path: 'terms', component: TermsComponent },

    { path: 'bankaccounts', component: BankaccountsComponent },
    { path: 'bankaccount', component: BankaccountviewComponent },

    { path: 'accounts', component: AccountsComponent },
    { path: 'account', component: AccountviewComponent },

    { path: 'banktransfers', component: BanktransfersComponent },
    { path: 'banktransfer', component: BanktransferviewComponent },

    { path: 'bankdeposits', component: BankdepositsComponent },
    { path: 'bankdeposit', component: BankdepositviewComponent },

    // { path: 'journallines', component: JournallinesComponent },
    // { path: 'journalline', component: JournallineviewComponent },

    // { path: 'ledgeraccounts', component: LedgeraccountsComponent },
    // { path: 'ledgeraccount', component: LedgeraccountviewComponent },

    // { path: 'ledgerentries', component: LedgerentriesComponent },
    // { path: 'ledgerentry', component: LedgerentryviewComponent },

    // { path: 'ledgeraccountclassifications', component: LedgeraccountclassificationsComponent },

    { path: 'transactions', component: TransactionsComponent },
    { path: 'transaction', component: TransactionviewComponent },

    // { path: 'chartofaccounts', component: CoaaccountsComponent },
    // { path: 'chartofaccount', component: CoaaccountviewComponent },

    { path: 'journals', component: JournalsComponent },
    { path: 'journal', component: JournalviewComponent },

    { path: 'trialbalances', component: TrialbalancesComponent },
    { path: 'trialbalance', component: TrialbalanceviewComponent },

    { path: 'customers', component: CustomersComponent },

    { path: '', redirectTo: 'dashboard' },
    { path: '**', component: NotfoundComponent }
  ]
}]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
