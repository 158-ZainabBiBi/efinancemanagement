import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TrialbalanceComponent } from 'src/app/components/account/trialbalance/trialbalance.component';

declare var $: any;

@Component({
  selector: 'app-trialbalanceview',
  templateUrl: './trialbalanceview.component.html',
  styleUrls: ['./trialbalanceview.component.css']
})
export class TrialbalanceviewComponent implements OnInit {
  @ViewChild("trialbalances") trialbalances: TrialbalanceComponent;

  trialbalanceID = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.trialbalance) {
        this.trialbalanceID = params.trialbalance;
      }
    });
  }

  cancel() {
    this.router.navigate(["/home/trialbalances"], { queryParams: {} });
  }

  refresh() {
    this.trialbalances.load(true);
    this.cancel();
  }
}
