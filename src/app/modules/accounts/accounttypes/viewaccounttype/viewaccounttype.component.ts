import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-viewaccounttype',
  templateUrl: './viewaccounttype.component.html',
  styleUrls: ['./viewaccounttype.component.css']
})
export class ViewaccounttypeComponent implements OnInit {
  accounttypeID = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.accounttype) {
        this.accounttypeID = params.accounttype;
      }
    });
  }

  cancel() {
    this.router.navigate(["/home/accounttypes"], { queryParams: {} });
  }

}
