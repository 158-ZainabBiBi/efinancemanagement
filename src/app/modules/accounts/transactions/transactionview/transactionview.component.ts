import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { JournalComponent } from '../../../../components/account/journal/journal.component';
import { TransactionComponent } from 'src/app/components/account/transaction/transaction.component';
import { LedgerentryComponent } from 'src/app/components/account/ledgerentry/ledgerentry.component';

declare var $: any;

@Component({
  selector: 'app-transactionview',
  templateUrl: './transactionview.component.html',
  styleUrls: ['./transactionview.component.css']
})
export class TransactionviewComponent implements OnInit {
  @ViewChild("transactions") transactions: TransactionComponent;

  @ViewChild("journals") journals: JournalComponent;
  @ViewChild("addjournal") addjournal: JournalComponent;
  @ViewChild("editjournal") editjournal: JournalComponent;

  @ViewChild("ledgerentrys") ledgerentrys: LedgerentryComponent;
  @ViewChild("addledgerentry") addledgerentry: LedgerentryComponent;
  @ViewChild("editledgerentry") editledgerentry: LedgerentryComponent;

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

  cancel() {
    this.router.navigate(["/home/transaction"], { queryParams: {} });
  }

  refresh() {
    this.transactions.ngOnInit();
    this.journalcancel();
    this.ledgerentrycancel();
  }

  journaledit(row) {
    this.editjournal.journal = {
      journal_ID: row.data.journal_ID,
      journalline_ID: row.data.journalline_ID,
      transaction_ID: row.data.transaction_ID,

      journal_CODE: row.data.journal_CODE,
      journal_DATE: row.data.journal_DATE,
      journal_NAME: row.data.journal_NAME,
      journal_DESC: row.data.journal_DESC,

      isactive: row.data.isactive
    };
    if (row.data.isactive == "Y") {
      this.editjournal.journal.isactive = true;
    } else {
      this.editjournal.journal.isactive = false;
    }
    $("#edit").modal("show");
  }

  ledgerentryedit(row) {
    this.editledgerentry.ledgerentry = {
      ledgerentry_ID: row.data.ledgerentry_ID,
      ledgeraccount_ID: row.data.ledgeraccount_ID,
      transaction_ID: row.data.transaction_ID,

      ledgerentry_CODE: row.data.ledgerentry_CODE,
      ledgerentry_NAME: row.data.ledgerentry_NAME,
      ledgerentry_DESC: row.data.ledgerentry_DESC,

      credit_AMOUNT: row.data.credit_AMOUNT,
      debit_AMOUNT: row.data.debit_AMOUNT,

      isactive: row.data.isactive
    };
    if (row.data.isactive == "Y") {
      this.editledgerentry.ledgerentry.isactive = true;
    } else {
      this.editledgerentry.ledgerentry.isactive = false;
    }
    $("#edit").modal("show");
  }

  journalshow(row) {
    this.router.navigate(["/home/journal"], { queryParams: { journal: row.data.journal_ID } });
  }

  journalcancel() {
    $("#addjournal").modal("hide");
    $("#editjournal").modal("hide");
  }

  journaladdNew() {
    this.router.navigate(["/home/journal"], {});
  }

  ledgerentryshow(row) {
    this.router.navigate(["/home/ledgerentry"], { queryParams: { ledgerentry: row.data.ledgerentry_ID } });
  }

  ledgerentrycancel() {
    $("#addledgerentry").modal("hide");
    $("#editledgerentry").modal("hide");
  }

  ledgerentryaddNew() {
    this.router.navigate(["/home/ledgerentry"], {});
  }
}
