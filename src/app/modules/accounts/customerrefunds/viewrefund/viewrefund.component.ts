import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-viewrefund',
  templateUrl: './viewrefund.component.html',
  styleUrls: ['./viewrefund.component.css']
})
export class ViewrefundComponent implements OnInit {
  customerrefundID = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.customerrefund) {
        this.customerrefundID = params.customerrefund;
      }
    });
  }

  cancel() {
    this.router.navigate(["/home/customerrefunds"], { queryParams: {} });
  }

}
