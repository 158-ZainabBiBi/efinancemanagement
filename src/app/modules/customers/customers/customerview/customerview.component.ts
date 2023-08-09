import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BankaccountComponent } from 'src/app/components/account/bankaccount/bankaccount.component';
import { CustomerComponent } from 'src/app/components/customer/customer/customer.component';

declare var $: any;

@Component({
  selector: 'app-customerview',
  templateUrl: './customerview.component.html',
  styleUrls: ['./customerview.component.css']
})
export class CustomerviewComponent implements OnInit {
  @ViewChild("customers") customers: CustomerComponent;

  @ViewChild("bankaccount") bankaccount: BankaccountComponent;
  @ViewChild("addbankaccount") addbankaccount: BankaccountComponent;
  @ViewChild("editbankaccount") editbankaccount: BankaccountComponent;

  customerID = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.customer) {
        this.customerID = params.customer;
      }
    });
  }

  refresh() {
    this.customers.ngOnInit();
    this.cancel();
  }

  cancel() {
    this.router.navigate(["/home/customers"], { queryParams: {} });
  }

  addNewbankaccount() {
    this.addbankaccount.add();
    $("#addbankaccount").modal("show");
  }

  editBankaccount(row) {
    this.editbankaccount.bankaccount = {
      bankaccount_ID: row.data.bankaccount_ID,
      bankaccounttype_ID: row.data.bankaccounttype_ID,
      paymentmethod_ID: row.data.paymentmethod_ID,
      customer_ID: row.data.customer_ID,

      bankaccount_CODE: row.data.bankaccount_CODE,
      bankaccount_DATE: row.data.bankaccount_DATE,
      bankaccount_BALANCE: row.data.bankaccount_BALANCE,
      bankaccount_NAME: row.data.bankaccount_NAME,
      bankaccount_DESC: row.data.bankaccount_DESC,
      bankaccount_NUMBER: row.data.bankaccount_NUMBER,
      bankaccount_BIC: row.data.bankaccount_BIC,
      bankaccount_IBAN: row.data.bankaccount_IBAN,

      isactive: row.data.isactive
    };
    if (row.data.isactive == "Y") {
      this.editbankaccount.bankaccount.isactive = true;
    } else {
      this.editbankaccount.bankaccount.isactive = false;
    }
    $("#editbankaccount").modal("show");
  }

  cancelbankaccount() {
    $("#addbankaccount").modal("hide");
    $("#editbankaccount").modal("hide");
  }
}
