import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-viewexchangerate',
  templateUrl: './viewexchangerate.component.html',
  styleUrls: ['./viewexchangerate.component.css']
})
export class ViewexchangerateComponent implements OnInit {
  currencyexchangerateID = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.currencyexchangerate) {
        this.currencyexchangerateID = params.currencyexchangerate;
      }
    });
  }

  cancel() {
    this.router.navigate(["/home/currencyexchangerates"], { queryParams: {} });
  }

}
