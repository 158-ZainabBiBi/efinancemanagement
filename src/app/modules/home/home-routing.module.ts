import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotfoundComponent } from '../../pages/notfound/notfound.component';
import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { AccountsComponent } from '../finances/accounts/accounts.component';
import { AccounttypesComponent } from '../finances/accounttypes/accounttypes.component';
import { TaxcodesComponent } from '../finances/taxcodes/taxcodes.component';
import { PaymentsComponent } from '../finances/payments/payments.component';

const routes: Routes = [{
  path: '', component: HomeComponent,
  children: [
    { path: 'dashboard', component: DashboardComponent },

    { path: 'accounts', component: AccountsComponent },
    { path: 'accounttypes', component: AccounttypesComponent },

    { path: 'payments', component: PaymentsComponent },
    // { path: 'paymentinvoices', component: PaymentinvoicesComponent },

    { path: 'taxcodes', component: TaxcodesComponent },

    { path: '', redirectTo: 'dashboard' },
    { path: '**', component: NotfoundComponent }
  ]
}]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
