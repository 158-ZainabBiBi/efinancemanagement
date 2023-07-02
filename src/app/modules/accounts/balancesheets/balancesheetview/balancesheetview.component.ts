import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BalancesheetComponent } from 'src/app/components/account/balancesheet/balancesheet.component';

declare var $: any;

@Component({
  selector: 'app-balancesheetview',
  templateUrl: './balancesheetview.component.html',
  styleUrls: ['./balancesheetview.component.css']
})
export class BalancesheetviewComponent implements OnInit {
  @ViewChild("balancesheets") balancesheets: BalancesheetComponent;

  balancesheetID = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.balancesheet) {
        this.balancesheetID = params.balancesheet;
      }
    });
  }

  cancel() {
    this.router.navigate(["/home/balancesheets"], { queryParams: {} });
  }

  refresh() {
    this.balancesheets.load(true);
    this.cancel();
  }
}
