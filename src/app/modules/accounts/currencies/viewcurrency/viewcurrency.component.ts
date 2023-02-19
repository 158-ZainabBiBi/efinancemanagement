import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-viewcurrency',
  templateUrl: './viewcurrency.component.html',
  styleUrls: ['./viewcurrency.component.css']
})
export class ViewcurrencyComponent implements OnInit {
  currencyID = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.currency) {
        this.currencyID = params.currency;
      }
    });
  }

  cancel() {
    this.router.navigate(["/home/currencies"], { queryParams: {} });
  }

}
