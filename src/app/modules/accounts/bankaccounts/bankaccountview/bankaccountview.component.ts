import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BankdepositComponent } from '../../../../components/account/bankdeposit/bankdeposit.component';
import { BankaccountComponent } from 'src/app/components/account/bankaccount/bankaccount.component';
import { BanktransferComponent } from 'src/app/components/account/banktransfer/banktransfer.component';

declare var $: any;

@Component({
  selector: 'app-bankaccountview',
  templateUrl: './bankaccountview.component.html',
  styleUrls: ['./bankaccountview.component.css']
})
export class BankaccountviewComponent implements OnInit {
  @ViewChild("bankaccounts") bankaccounts: BankaccountComponent;

  @ViewChild("bankdeposits") bankdeposits: BankdepositComponent;
  @ViewChild("addbankdeposit") addbankdeposit: BankdepositComponent;
  @ViewChild("editbankdeposit") editbankdeposit: BankdepositComponent;

  @ViewChild("banktransfers") banktransfers: BanktransferComponent;
  @ViewChild("addbanktransfer") addbanktransfer: BanktransferComponent;
  @ViewChild("editbanktransfer") editbanktransfer: BanktransferComponent;

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

  cancel() {
    this.router.navigate(["/home/bankaccount"], { queryParams: {} });
  }

  refresh() {
    this.bankaccounts.ngOnInit();
    this.bankdepositcancel();
    this.banktransfercancel();
  }

  bankdepositedit(row) {
    this.editbankdeposit.bankdeposit = {
      bankdeposit_ID: row.data.bankdeposit_ID,
      frombankaccount_ID: row.data.frombankaccount_ID,
      tobankaccount_ID: row.data.tobankaccount_ID,
      transaction_ID: row.data.transaction_ID,

      bankdeposit_CODE: row.data.bankdeposit_CODE,
      bankdeposit_DATE: row.data.bankdeposit_DATE,

      cash_AMOUNT: row.data.cash_AMOUNT,
      cheque_AMOUNT: row.data.cheque_AMOUNT,
      total_AMOUNT: row.data.total_AMOUNT,

      isactive: row.data.isactive
    };
    if (row.data.isactive == "Y") {
      this.editbankdeposit.bankdeposit.isactive = true;
    } else {
      this.editbankdeposit.bankdeposit.isactive = false;
    }
    $("#editbankdeposit").modal("show");
  }

  banktransferedit(row) {
    this.editbanktransfer.banktransfer = {
      banktransfer_ID: row.data.banktransfer_ID,
      frombankaccount_ID: row.data.frombankaccount_ID,
      tobankaccount_ID: row.data.tobankaccount_ID,
      transaction_ID: row.data.transaction_ID,

      banktransfer_NAME: row.data.banktransfer_NAME,
      banktransfer_CODE: row.data.banktransfer_CODE,
      banktransfer_DATE: row.data.banktransfer_DATE,
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

  bankdepositshow(row) {
    this.router.navigate(["/home/bankdeposit"], { queryParams: { bankdeposit: row.data.bankdeposit_ID } });
  }

  bankdepositcancel() {
    $("#addbankdeposit").modal("hide");
    $("#editbankdeposit").modal("hide");
  }

  bankdepositaddNew() {
    // this.router.navigate(["/home/bankdeposit"], {});
    this.addbankdeposit.add();
    $("#addbankdeposit").modal("show");
  }

  banktransfershow(row) {
    this.router.navigate(["/home/banktransfer"], { queryParams: { banktransfer: row.data.banktransfer_ID } });
  }

  banktransfercancel() {
    $("#addbanktransfer").modal("hide");
    $("#editbanktransfer").modal("hide");
  }

  banktransferaddNew() {
    // this.router.navigate(["/home/banktransfer"], {});
    this.addbanktransfer.add();
    $("#addbanktransfer").modal("show");
  }
}
