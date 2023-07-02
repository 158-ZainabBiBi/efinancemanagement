import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BanktransferComponent } from 'src/app/components/account/banktransfer/banktransfer.component';

declare var $: any;

@Component({
  selector: 'app-banktransferview',
  templateUrl: './banktransferview.component.html',
  styleUrls: ['./banktransferview.component.css']
})
export class BanktransferviewComponent implements OnInit {
  @ViewChild("banktransfers") banktransfers: BanktransferComponent;

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
    this.banktransfers.load(true);
    this.cancel();
  }
}
