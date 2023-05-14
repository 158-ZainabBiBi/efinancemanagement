import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-coaaccountview',
  templateUrl: './coaaccountview.component.html',
  styleUrls: ['./coaaccountview.component.css']
})
export class CoaaccountviewComponent implements OnInit {

  coaaccountID = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.coaaccount) {
        this.coaaccountID = params.coaaccount;
      }
    });
  }

  cancel() {
    this.router.navigate(["/home/chartofaccounts"], { queryParams: {} });
  }

  refresh() {
    this.cancel();
  }
}
