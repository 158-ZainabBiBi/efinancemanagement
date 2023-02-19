import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { CurrencyexchangerateComponent } from '../../../components/accounts/currencyexchangerate/currencyexchangerate.component'
import { CurrencyexchangerateService } from '../../../components/accounts/currencyexchangerate/currencyexchangerate.service';
import { Router, RouterLinkWithHref } from '@angular/router';

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
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  show(row) {
    this.router.navigate(["/home/currencyexchangerate"], { queryParams: { currencyexchangerate: row.data.currencyexchangerate_ID } });
  }

  view() {
  }

  addNew() {
    this.router.navigate(["/home/currencyexchangerate"], {});
  }

  edit(row) {
    this.editcurrencyexchangerate.currencyexchangerate = {
      currencyexchangerate_ID: row.data.currencyexchangerate_ID,
      currency_ID: row.data.currency_ID,
      effective_DATE: row.data.effective_DATE,
      isactive: row.data.isactive
    };
    if (row.data.isactive=="Y") {
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
}
