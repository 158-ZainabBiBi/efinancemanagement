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

//account
import { BankdepositComponent } from 'src/app/components/account/bankdeposit/bankdeposit.component';
import { BanktransferComponent } from 'src/app/components/account/banktransfer/banktransfer.component';
import { JournallineComponent } from 'src/app/components/account/journalline/journalline.component';
import { LedgeraccountComponent } from 'src/app/components/account/ledgeraccount/ledgeraccount.component';
import { LedgerentryComponent } from 'src/app/components/account/ledgerentry/ledgerentry.component';

//accounts
import { JournalsComponent } from 'src/app/modules/accounts/journals/journals.component';
import { TrialbalancesComponent } from 'src/app/modules/accounts/trialbalances/trialbalances.component';
import { ChartofaccountsComponent } from 'src/app/modules/accounts/chartofaccounts/chartofaccounts.component';
import { TransactionsComponent } from 'src/app/modules/accounts/transactions/transactions.component';
import { BankaccountsComponent } from 'src/app/modules/accounts/bankaccounts/bankaccounts.component';
import { AccountsComponent } from 'src/app/modules/accounts/accounts/accounts.component';
import { BankdepositsComponent } from 'src/app/modules/accounts/bankdeposits/bankdeposits.component';
import { BanktransfersComponent } from 'src/app/modules/accounts/banktransfers/banktransfers.component';
import { JournallinesComponent } from 'src/app/modules/accounts/journallines/journallines.component';
import { LedgeraccountsComponent } from 'src/app/modules/accounts/ledgeraccounts/ledgeraccounts.component';
import { LedgeraccountclassificationsComponent } from 'src/app/modules/accounts/ledgeraccountclassifications/ledgeraccountclassifications.component';
import { LedgerentriesComponent } from 'src/app/modules/accounts/ledgerentries/ledgerentries.component';


//accountview
import { ChartofaccountviewComponent } from 'src/app/modules/accounts/chartofaccounts/chartofaccountview/chartofaccountview.component';
import { BankaccountviewComponent } from 'src/app/modules/accounts/bankaccounts/bankaccountview/bankaccountview.component';
import { JournalviewComponent } from 'src/app/modules/accounts/journals/journalview/journalview.component';
import { TransactionviewComponent } from 'src/app/modules/accounts/transactions/transactionview/transactionview.component';
import { TrialbalanceviewComponent } from 'src/app/modules/accounts/trialbalances/trialbalanceview/trialbalanceview.component';

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
    { path: 'banktransfers', component: BanktransfersComponent },
    { path: 'bankdeposits', component: BankdepositsComponent },
    { path: 'journallines', component: JournallinesComponent },
    { path: 'ledgeraccounts', component: LedgeraccountsComponent },
    { path: 'ledgerentries', component: LedgerentriesComponent },
    { path: 'ledgeraccountclassifications', component: LedgeraccountclassificationsComponent },

    { path: 'transactions', component: TransactionsComponent },
    { path: 'transaction', component: TransactionviewComponent },

    { path: 'chartofaccounts', component: ChartofaccountsComponent },
    { path: 'chartofaccount', component: ChartofaccountviewComponent },

    { path: 'journals', component: JournalsComponent },
    { path: 'journal', component: JournalviewComponent },

    { path: 'trialbalances', component: TrialbalancesComponent },
    { path: 'trialbalance', component: TrialbalanceviewComponent },

    { path: '', redirectTo: 'dashboard' },
    { path: '**', component: NotfoundComponent }
  ]
}]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
