import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { CurrencyComponent } from '../../../components/accounts/currency/currency.component'
import { CurrencyService } from '../../../components/accounts/currency/currency.service';
import { Router, RouterLinkWithHref } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.css']
})
export class CurrenciesComponent implements OnInit {
  @ViewChild("currencies") currencies: CurrencyComponent;
  @ViewChild("addcurrency") addcurrency: CurrencyComponent;
  @ViewChild("editcurrency") editcurrency: CurrencyComponent;

  constructor(
    private currencieservice: CurrencyService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  show(row) {
    this.router.navigate(["/home/currency"], { queryParams: { currency: row.data.currency_ID } });
  }

  view() {
  }

  addNew() {
    this.router.navigate(["/home/currency"], {});
  }

  edit(row) {
    this.editcurrency.currency = {
      currency_ID: row.data.currency_ID,
      country_ID: row.data.country_ID,
      currencysymbolreplacement_ID: row.data.currencysymbolreplacement_ID,
      iso_CODE: row.data.iso_CODE,
      exchange_RATE: row.data.exchange_RATE,
      currency_FORMAT: row.data.currency_FORMAT,
      currency_SYMBOL: row.data.currency_SYMBOL,
      isactive: row.data.isactive
    };
    if (row.data.isactive=="Y") {
      this.editcurrency.currency.isactive = true;
    } else {
      this.editcurrency.currency.isactive = false;
    }
    $("#edit").modal("show");
  }

  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }
}
