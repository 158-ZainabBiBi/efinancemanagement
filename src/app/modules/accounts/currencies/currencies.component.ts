import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { RouterLinkWithHref } from '@angular/router';

import { CurrencyComponent } from 'src/app/components/accounts/currency/currency.component';
import { CurrencyService } from 'src/app/components/accounts/currency/currency.service';

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
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  addNew() {
    this.addcurrency.add();
    $("#add").modal("show");
  }

  edit(row) {
    this.editcurrency.currency = {
      currency_ID: row.data.currency_ID,
      location_ID: row.data.location_ID,
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
