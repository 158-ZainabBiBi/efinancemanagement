import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotfoundComponent } from '../../pages/notfound/notfound.component';
import { HomeComponent } from './home.component';

import { DashboardComponent } from './dashboard/dashboard.component';
// import { AccountsComponent } from '../accounts/accounts/accounts.component';
// import { CompaniesComponent } from '../accounts/companies/companies.component';
// import { TransactionsComponent } from '../accounts/transactions/transactions.component';
import { IndexComponent } from './dashboard/index/index.component';

const routes: Routes = [{
  path: '', component: HomeComponent,
  children: [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'indexes', component: IndexComponent },

    // { path: 'companies', component: CompaniesComponent },
    // { path: 'transactions', component: TransactionsComponent },
    // { path: 'accounts', component: AccountsComponent },

    { path: '', redirectTo: 'dashboard' },
    { path: '**', component: NotfoundComponent }
  ]
}]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
