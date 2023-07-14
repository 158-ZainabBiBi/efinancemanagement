import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LedgerComponent } from 'src/app/components/account/ledger/ledger.component';

declare var $: any;

@Component({
  selector: 'app-ledgerview',
  templateUrl: './ledgerview.component.html',
  styleUrls: ['./ledgerview.component.css']
})
export class LedgerviewComponent implements OnInit {
  @ViewChild("ledgers") ledgers: LedgerComponent;

  ledgerID = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.ledger) {
        this.ledgerID = params.ledger;
      }
    });
  }

  cancel() {
    this.router.navigate(["/home/ledgers"], { queryParams: {} });
  }

  refresh() {
    this.ledgers.load(true);
    this.cancel();
  }
}
