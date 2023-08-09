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
    this.transactions.load(true);
    this.cancel();
  }

}
