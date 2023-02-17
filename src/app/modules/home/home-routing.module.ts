import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotfoundComponent } from '../../pages/notfound/notfound.component';
import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';

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

const routes: Routes = [{
  path: '', component: HomeComponent,
  children: [
    { path: 'dashboard', component: DashboardComponent },

    { path: 'accounts', component: AccountsComponent },
    { path: 'accounttypes', component: AccounttypesComponent },

    { path: 'approvalreturnauths', component: ApprovalreturnauthsComponent },
    { path: 'recievereturnauths', component: RecievereturnauthsComponent },
    { path: 'returnauths', component: ReturnauthsComponent },

    { path: 'currencies', component: CurrenciesComponent },
    { path: 'currencyexchangerates', component: CurrencyexchangeratesComponent },

    { path: 'creditcardtransactions', component: CreditcardtransactionsComponent },
    { path: 'customerrefunds', component: CustomerrefundsComponent },
    { path: 'expensecategories', component: ExpensecategoriesComponent },

    { path: '', redirectTo: 'dashboard' },
    { path: '**', component: NotfoundComponent }
  ]
}]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
