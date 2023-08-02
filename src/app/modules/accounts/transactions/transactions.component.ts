import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { TransactionComponent } from 'src/app/components/account/transaction/transaction.component';
import { TransactionService } from 'src/app/components/account/transaction/transaction.service';
import { Router } from '@angular/router';

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
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  refresh() {
    this.transactions.load(true);
    this.cancel();
  }

  show(row) {
    this.router.navigate(["/home/transaction"], { queryParams: { transaction: row.data.transaction_ID } });
  }

  addNew() {
    // this.router.navigate(["/home/transaction"], {});
    this.addtransaction.add();
    $("#add").modal("show");
  }

  edit(row) {
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
    $("#edit").modal("show");
  }

  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }

}
