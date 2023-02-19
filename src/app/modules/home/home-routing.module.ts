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

import { ViewaccountComponent } from '../accounts/accounts/viewaccount/viewaccount.component';
import { ViewaccounttypeComponent } from '../accounts/accounttypes/viewaccounttype/viewaccounttype.component';
import { ViewapprovalComponent } from '../accounts/approvalreturnauths/viewapproval/viewapproval.component';
import { ViewrecieveComponent } from '../accounts/recievereturnauths/viewrecieve/viewrecieve.component';
import { ViewreturnComponent } from '../accounts/returnauths/viewreturn/viewreturn.component';
import { ViewcurrencyComponent } from '../accounts/currencies/viewcurrency/viewcurrency.component';
import { ViewexchangerateComponent } from '../accounts/currencyexchangerates/viewexchangerate/viewexchangerate.component';
import { ViewtransactionComponent } from '../accounts/creditcardtransactions/viewtransaction/viewtransaction.component';
import { ViewrefundComponent } from '../accounts/customerrefunds/viewrefund/viewrefund.component';
import { ViewexpenseComponent } from '../accounts/expensecategories/viewexpense/viewexpense.component';

const routes: Routes = [{
  path: '', component: HomeComponent,
  children: [
    { path: 'dashboard', component: DashboardComponent },

    { path: 'accounts', component: AccountsComponent },
    { path: 'account', component: ViewaccountComponent },
    { path: 'accounttypes', component: AccounttypesComponent },
    { path: 'accounttype', component: ViewaccounttypeComponent },

    { path: 'approvalreturnauths', component: ApprovalreturnauthsComponent },
    { path: 'approvalreturnauth', component: ViewapprovalComponent },
    { path: 'recievereturnauths', component: RecievereturnauthsComponent },
    { path: 'recievereturnauth', component: ViewrecieveComponent },
    { path: 'returnauths', component: ReturnauthsComponent },
    { path: 'returnauth', component: ViewreturnComponent },

    { path: 'currencies', component: CurrenciesComponent },
    { path: 'currency', component: ViewcurrencyComponent },
    { path: 'currencyexchangerates', component: CurrencyexchangeratesComponent },
    { path: 'currencyexchangerate', component: ViewexchangerateComponent },

    { path: 'creditcardtransactions', component: CreditcardtransactionsComponent },
    { path: 'creditcardtransaction', component: ViewtransactionComponent },
    { path: 'customerrefunds', component: CustomerrefundsComponent },
    { path: 'customerrefund', component: ViewrefundComponent },
    { path: 'expensecategories', component: ExpensecategoriesComponent },
    { path: 'expensecategory', component: ViewexpenseComponent },

    { path: '', redirectTo: 'dashboard' },
    { path: '**', component: NotfoundComponent }
  ]
}]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
