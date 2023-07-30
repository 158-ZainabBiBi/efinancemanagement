import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BankaccountComponent } from 'src/app/components/account/bankaccount/bankaccount.component';
import { TransactionComponent } from 'src/app/components/account/transaction/transaction.component';

declare var $: any;

@Component({
  selector: 'app-bankaccountview',
  templateUrl: './bankaccountview.component.html',
  styleUrls: ['./bankaccountview.component.css']
})
export class BankaccountviewComponent implements OnInit {
  @ViewChild("bankaccounts") bankaccounts: BankaccountComponent;

  @ViewChild("transaction") transaction: TransactionComponent;
  @ViewChild("addtransaction") addtransaction: TransactionComponent;
  @ViewChild("edittransaction") edittransaction: TransactionComponent;

  bankaccountID = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.bankaccount) {
        this.bankaccountID = params.bankaccount;
      }
    });
  }

  refresh() {
    this.bankaccounts.ngOnInit();
    this.cancel();
  }

  cancel() {
    this.router.navigate(["/home/bankaccounts"], { queryParams: {} });
  }

  addNewtransaction() {
    this.addtransaction.add();
    $("#addtransaction").modal("show");
  }

  editTransaction(row) {
    this.edittransaction.transaction = {
      transaction_ID: row.data.transaction_ID,
      bankaccount_ID: row.data.bankaccount_ID,
      transactiontype_ID: row.data.transactiontype_ID,
      currency_ID: row.data.currency_ID,
      transaction_CODE: row.data.transaction_CODE,
      transaction_DATE: row.data.transaction_DATE,
      transaction_NAME: row.data.transaction_NAME,
      transaction_AMOUNT: row.data.transaction_AMOUNT,
      transaction_DESC: row.data.transaction_DESC,
      isactive: row.data.isactive
    };
    if (row.data.isactive == "Y") {
      this.edittransaction.transaction.isactive = true;
    } else {
      this.edittransaction.transaction.isactive = false;
    }
    $("#edittransaction").modal("show");
  }

  canceltransaction() {
    $("#addtransaction").modal("hide");
    $("#edittransaction").modal("hide");
  }
}
