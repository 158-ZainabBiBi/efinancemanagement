import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BankdepositComponent } from 'src/app/components/account/bankdeposit/bankdeposit.component';

declare var $: any;

@Component({
  selector: 'app-bankdepositview',
  templateUrl: './bankdepositview.component.html',
  styleUrls: ['./bankdepositview.component.css']
})
export class BankdepositviewComponent implements OnInit {
  @ViewChild("bankdeposits") bankdeposits: BankdepositComponent;

  bankdepositID = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.bankdeposit) {
        this.bankdepositID = params.bankdeposit;
      }
    });
  }

  cancel() {
    this.router.navigate(["/home/bankdeposits"], { queryParams: {} });
  }

  refresh() {
    this.bankdeposits.load(true);
    this.cancel();
  }
}
