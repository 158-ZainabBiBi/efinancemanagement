import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-viewexpense',
  templateUrl: './viewexpense.component.html',
  styleUrls: ['./viewexpense.component.css']
})
export class ViewexpenseComponent implements OnInit {
  expensecategoryID = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.expensecategory) {
        this.expensecategoryID = params.expensecategory;
      }
    });
  }

  cancel() {
    this.router.navigate(["/home/expensecategories"], { queryParams: {} });
  }

}
