import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-ledgeraccountview',
  templateUrl: './ledgeraccountview.component.html',
  styleUrls: ['./ledgeraccountview.component.css']
})
export class LedgeraccountviewComponent implements OnInit {

  ledgeraccountID = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.ledgeraccount) {
        this.ledgeraccountID = params.ledgeraccount;
      }
    });
  }

  cancel() {
    this.router.navigate(["/home/ledgeraccounts"], { queryParams: {} });
  }

  refresh() {
    this.cancel();
  }
}
