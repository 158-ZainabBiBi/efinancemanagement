import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ChartofaccountComponent } from 'src/app/components/account/chartofaccount/chartofaccount.component';

declare var $: any;

@Component({
  selector: 'app-chartofaccountview',
  templateUrl: './chartofaccountview.component.html',
  styleUrls: ['./chartofaccountview.component.css']
})
export class ChartofaccountviewComponent implements OnInit {
  @ViewChild("chartofaccounts") chartofaccounts: ChartofaccountComponent;

  chartofaccountID = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.chartofaccount) {
        this.chartofaccountID = params.chartofaccount;
      }
    });
  }

  cancel() {
    this.router.navigate(["/home/chartofaccounts"], { queryParams: {} });
  }

  refresh() {
    this.chartofaccounts.load(true);
    this.cancel();
  }
}
