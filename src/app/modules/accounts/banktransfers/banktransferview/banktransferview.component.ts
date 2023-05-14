import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-banktransferview',
  templateUrl: './banktransferview.component.html',
  styleUrls: ['./banktransferview.component.css']
})
export class BanktransferviewComponent implements OnInit {

  banktransferID = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.banktransfer) {
        this.banktransferID = params.banktransfer;
      }
    });
  }

  cancel() {
    this.router.navigate(["/home/banktransfers"], { queryParams: {} });
  }

  refresh() {
    this.cancel();
  }
}
