import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProfitandlossComponent } from 'src/app/components/account/profitandloss/profitandloss.component';

declare var $: any;

@Component({
  selector: 'app-journalview',
  templateUrl: './journalview.component.html',
  styleUrls: ['./journalview.component.css']
})
export class ProfitandlossviewComponent implements OnInit {
  @ViewChild("profitandlosses") profitandlosses: ProfitandlossComponent;

  journalID = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.profitandloss) {
        this.journalID = params.profitandloss;
      }
    });
  }

  cancel() {
    this.router.navigate(["/home/profitandlosses"], { queryParams: {} });
  }

  refresh() {
    this.profitandlosses.load(true);
    this.cancel();
  }
}
