import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotfoundComponent } from '../../pages/notfound/notfound.component';
import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IndexComponent } from './dashboard/index/index.component';

//accounts
import { JournalsComponent } from 'src/app/modules/accounts/journals/journals.component';
import { TrialbalancesComponent } from 'src/app/modules/accounts/trialbalances/trialbalances.component';
import { ChartofaccountsComponent } from 'src/app/modules/accounts/chartofaccounts/chartofaccounts.component';
import { TransactionsComponent } from 'src/app/modules/accounts/transactions/transactions.component';
import { BankaccountsComponent } from 'src/app/modules/accounts/bankaccounts/bankaccounts.component';

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

    { path: 'bankaccounts', component: BankaccountsComponent },
    { path: 'bankaccount', component: BankaccountviewComponent },

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
