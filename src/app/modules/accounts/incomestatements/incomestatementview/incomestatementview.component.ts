import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IncomestatementComponent } from 'src/app/components/account/incomestatement/incomestatement.component';

declare var $: any;

@Component({
  selector: 'app-incomestatementview',
  templateUrl: './incomestatementview.component.html',
  styleUrls: ['./incomestatementview.component.css']
})
export class IncomestatementviewComponent implements OnInit {
  @ViewChild("incomestatements") incomestatements: IncomestatementComponent;

  incomestatementID = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.incomestatement) {
        this.incomestatementID = params.incomestatement;
      }
    });
  }

  cancel() {
    this.router.navigate(["/home/incomestatements"], { queryParams: {} });
  }

  refresh() {
    this.incomestatements.load(true);
    this.cancel();
  }
}
