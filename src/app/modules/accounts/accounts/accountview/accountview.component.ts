import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-accountview',
  templateUrl: './accountview.component.html',
  styleUrls: ['./accountview.component.css']
})
export class AccountviewComponent implements OnInit {

  accountID = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.account) {
        this.accountID = params.account;
      }
    });
  }

  cancel() {
    this.router.navigate(["/home/accounts"], { queryParams: {} });
  }

  refresh() {
    this.cancel();
  }
}
