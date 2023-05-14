import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-ledgerentryview',
  templateUrl: './ledgerentryview.component.html',
  styleUrls: ['./ledgerentryview.component.css']
})
export class LedgerentryviewComponent implements OnInit {

  ledgerentryID = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.ledgerentry) {
        this.ledgerentryID = params.ledgerentry;
      }
    });
  }

  cancel() {
    this.router.navigate(["/home/ledgerentries"], { queryParams: {} });
  }

  refresh() {
    this.cancel();
  }
}
