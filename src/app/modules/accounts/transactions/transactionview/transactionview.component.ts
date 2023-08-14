import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { TransactionComponent } from 'src/app/components/account/transaction/transaction.component';
import { BankdepositComponent } from 'src/app/components/account/bankdeposit/bankdeposit.component';
import { BanktransferComponent } from 'src/app/components/account/banktransfer/banktransfer.component';

declare var $: any;

@Component({
  selector: 'app-transactionview',
  templateUrl: './transactionview.component.html',
  styleUrls: ['./transactionview.component.css']
})
export class TransactionviewComponent implements OnInit {
  @ViewChild("transactions") transactions: TransactionComponent;

  @ViewChild("banktransfer") banktransfer: BanktransferComponent;
  @ViewChild("addbanktransfer") addbanktransfer: BanktransferComponent;
  @ViewChild("editbanktransfer") editbanktransfer: BanktransferComponent;

  @ViewChild("bankdeposit") bankdeposit: BankdepositComponent;
  @ViewChild("addbankdeposit") addbankdeposit: BankdepositComponent;
  @ViewChild("editbankdeposit") editbankdeposit: BankdepositComponent;

  transactionID = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.transaction) {
        this.transactionID = params.transaction;
      }
    });
  }

  refresh() {
    this.transactions.ngOnInit();
    this.cancel();
  }

  cancel() {
    this.router.navigate(["/home/transactions"], { queryParams: {} });
  }

  addNewbanktransfer() {
    this.addbanktransfer.add();
    $("#addbanktransfer").modal("show");
  }

  editBanktransfer(row) {
    this.editbanktransfer.banktransfer = {
      banktransfer_ID: row.data.banktransfer_ID,
      frombankaccount_ID: row.data.frombankaccount_ID,
      tobankaccount_ID: row.data.tobankaccount_ID,
      transaction_ID: row.data.transaction_ID,
      banktransfer_CODE: row.data.banktransfer_CODE,
      banktransfer_NAME: row.data.banktransfer_NAME,
      banktransfer_AMOUNT: row.data.banktransfer_AMOUNT,
      banktransfer_DESC: row.data.banktransfer_DESC,
      isactive: row.data.isactive
    };
    if (row.data.isactive == "Y") {
      this.editbanktransfer.banktransfer.isactive = true;
    } else {
      this.editbanktransfer.banktransfer.isactive = false;
    }
    $("#editbanktransfer").modal("show");
  }

  cancelbanktransfer() {
    $("#addbanktransfer").modal("hide");
    $("#editbanktransfer").modal("hide");
  }

  addNewbankdeposit() {
    this.addbankdeposit.add();
    $("#addbankdeposit").modal("show");
  }

  editBankdeposit(row) {
    this.editbankdeposit.bankdeposit = {
      bankdeposit_ID: row.data.bankdeposit_ID,
      frombankaccount_ID: row.data.frombankaccount_ID,
      tobankaccount_ID: row.data.tobankaccount_ID,
      transaction_ID: row.data.transaction_ID,
      bankdeposit_CODE: row.data.bankdeposit_CODE,
      bankdeposit_NAME: row.data.bankdeposit_NAME,
      bankdeposit_AMOUNT: row.data.bankdeposit_AMOUNT,
      bankdeposit_DESC: row.data.bankdeposit_DESC,
      isactive: row.data.isactive
    };
    if (row.data.isactive == "Y") {
      this.editbankdeposit.bankdeposit.isactive = true;
    } else {
      this.editbankdeposit.bankdeposit.isactive = false;
    }
    $("#editbankdeposit").modal("show");
  }

  cancelbankdeposit() {
    $("#addbankdeposit").modal("hide");
    $("#editbankdeposit").modal("hide");
  }

}
