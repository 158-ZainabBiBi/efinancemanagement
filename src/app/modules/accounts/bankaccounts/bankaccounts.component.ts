import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLinkWithHref } from '@angular/router';
import { BankaccountComponent } from 'src/app/components/account/bankaccount/bankaccount.component';
import { BankaccountService } from 'src/app/components/account/bankaccount/bankaccount.service';
import { OnFailService } from 'src/app/services/on-fail.service';

declare var $: any;

@Component({
  selector: 'app-bankaccounts',
  templateUrl: './bankaccounts.component.html',
  styleUrls: ['./bankaccounts.component.css']
})
export class BankaccountsComponent implements OnInit {
  @ViewChild("bankaccounts") bankaccounts: BankaccountComponent;
  @ViewChild("addbankaccount") addbankaccount: BankaccountComponent;
  @ViewChild("editbankaccount") editbankaccount: BankaccountComponent;

  constructor(
    private bankaccountservice: BankaccountService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  show(row) {
    this.router.navigate(["/home/bankaccount"], { queryParams: { bankaccount: row.data.bankaccount_ID } });
  }

  view() {
  }

  refresh() {
    this.bankaccounts.ngOnInit();
    this.cancel();
  }

  addNew() {
    this.router.navigate(["/home/bankaccount"], {});
    // this.addbankaccount.add();
    // $("#addbankaccount").modal("show");
  }

  edit(row) {
    this.editbankaccount.bankaccount = {
      bankaccount_ID: row.data.bankaccount_ID,
      ledgeraccount_ID: row.data.ledgeraccount_ID,
      account_ID: row.data.account_ID,
      bankaccounttype_ID: row.data.bankaccounttype_ID,
      paymentmethod_ID: row.data.paymentmethod_ID,
      customer_ID: row.data.customer_ID,
      location_ID: row.data.location_ID,
      locations: [],

      bankaccount_CODE: row.data.bankaccount_CODE,
      bankaccount_DATE: row.data.bankaccount_DATE,
      bankaccount_BALANCE: row.data.bankaccount_BALANCE,

      isactive: row.data.isactive
    };
    if (row.data.isactive == "Y") {
      this.editbankaccount.bankaccount.isactive = true;
    } else {
      this.editbankaccount.bankaccount.isactive = false;
    }
    $("#editbankaccount").modal("show");
  }

  cancel() {
    $("#addbankaccount").modal("hide");
    $("#editbankaccount").modal("hide");
  }

}
