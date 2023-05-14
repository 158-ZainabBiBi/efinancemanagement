import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { JournalComponent } from '../../../../components/account/journal/journal.component';
import { TransactionComponent } from 'src/app/components/account/transaction/transaction.component';

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
  }

  journaledit(row) {
    this.editjournal.journal = {
      journal_ID: row.data.journal_ID,
      journalline_ID: row.data.journalline_ID,
      transaction_ID: row.data.transaction_ID,

      journal_CODE: row.data.journal_CODE,

      isactive: row.data.isactive
    };
    if (row.data.isactive == "Y") {
      this.editjournal.journal.isactive = true;
    } else {
      this.editjournal.journal.isactive = false;
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

}
