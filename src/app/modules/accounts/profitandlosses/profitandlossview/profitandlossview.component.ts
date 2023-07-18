import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProfitandlossComponent } from 'src/app/components/account/profitandloss/profitandloss.component';

declare var $: any;

@Component({
  selector: 'app-profitandlossview',
  templateUrl: './profitandlossview.component.html',
  styleUrls: ['./profitandlossview.component.css']
})
export class ProfitandlossviewComponent implements OnInit {
  @ViewChild("profitandlosses") profitandlosses: ProfitandlossComponent;

  profitandlossID = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.profitandloss) {
        this.profitandlossID = params.profitandloss;
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
