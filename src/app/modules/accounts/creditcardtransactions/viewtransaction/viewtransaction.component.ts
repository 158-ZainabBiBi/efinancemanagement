import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-viewtransaction',
  templateUrl: './viewtransaction.component.html',
  styleUrls: ['./viewtransaction.component.css']
})
export class ViewtransactionComponent implements OnInit {
  creditcardtransactionID = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.creditcardtransaction) {
        this.creditcardtransactionID = params.creditcardtransaction;
      }
    });
  }

  cancel() {
    this.router.navigate(["/home/creditcardtransactions"], { queryParams: {} });
  }

}
