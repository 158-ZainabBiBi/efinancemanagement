import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { TransactionComponent } from '../../../components/account/transaction/transaction.component'
import { TransactionService } from '../../../components/account/transaction/transaction.service';
import { RouterLinkWithHref } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  @ViewChild("transactions") transactions: TransactionComponent;
  @ViewChild("addtransaction") addtransaction: TransactionComponent;
  @ViewChild("edittransaction") edittransaction: TransactionComponent;

  constructor(
    private transactionservice: TransactionService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  refresh() {
    this.transactions.ngOnInit();
    this.cancel();
  }

  addNew() {
    this.addtransaction.add();
    $("#add").modal("show");
  }

  edit(row) {
    this.edittransaction.transaction = {
      transaction_ID: row.data.transaction_ID,
      person_ID: row.data.person_ID,
      currency_ID: row.data.currency_ID,
      transactiontype_ID: row.data.transactiontype_ID,

      transaction_CODE: row.data.transaction_CODE,
      transaction_DATE: row.data.transaction_DATE,
      transaction_TOTAL: row.data.transaction_TOTAL,
      transaction_NAME: row.data.transaction_NAME,
      transaction_DESC: row.data.transaction_DESC,

      isactive: row.data.isactive
    };
    if (row.data.isactive == "Y") {
      this.edittransaction.transaction.isactive = true;
    } else {
      this.edittransaction.transaction.isactive = false;
    }
    $("#edit").modal("show");
  }
  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }

}
