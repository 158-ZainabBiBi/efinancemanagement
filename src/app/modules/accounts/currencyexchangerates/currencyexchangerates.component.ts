import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { RouterLinkWithHref } from '@angular/router';

import { CurrencyexchangerateComponent } from 'src/app/components/account/currencyexchangerate/currencyexchangerate.component';
import { CurrencyexchangerateService } from 'src/app/components/account/currencyexchangerate/currencyexchangerate.service';

declare var $: any;

@Component({
  selector: 'app-currencyexchangerates',
  templateUrl: './currencyexchangerates.component.html',
  styleUrls: ['./currencyexchangerates.component.css']
})
export class CurrencyexchangeratesComponent implements OnInit {
  @ViewChild("currencyexchangerates") currencyexchangerates: CurrencyexchangerateComponent;
  @ViewChild("addcurrencyexchangerate") addcurrencyexchangerate: CurrencyexchangerateComponent;
  @ViewChild("editcurrencyexchangerate") editcurrencyexchangerate: CurrencyexchangerateComponent;

  constructor(
    private currencyexchangerateservice: CurrencyexchangerateService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  addNew() {
    this.addcurrencyexchangerate.add();
    $("#add").modal("show");
  }

  edit(row) {
    this.editcurrencyexchangerate.currencyexchangerate = {
      currencyexchangerate_ID: row.data.currencyexchangerate_ID,
      currency_ID: row.data.currency_ID,
      effective_DATE: row.data.effective_DATE,
      isactive: row.data.isactive
    };
    if (row.data.isactive == "Y") {
      this.editcurrencyexchangerate.currencyexchangerate.isactive = true;
    } else {
      this.editcurrencyexchangerate.currencyexchangerate.isactive = false;
    }
    $("#edit").modal("show");
  }

  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }

  advancedSearch(search) {
    this.currencyexchangerates.currencyexchangerateAdvancedSearch(search);
  }

  advancedSearchAll(search) {
    this.currencyexchangerates.currencyexchangerateAdvancedSearchAll(search);
  }

}
