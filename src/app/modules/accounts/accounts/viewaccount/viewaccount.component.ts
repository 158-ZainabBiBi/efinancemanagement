import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-viewaccount',
  templateUrl: './viewaccount.component.html',
  styleUrls: ['./viewaccount.component.css']
})
export class ViewaccountComponent implements OnInit {
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

}
