import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  showindex() {
    this.router.navigate(["/home/indexes"], {});
  }

  showcontact() {
    this.router.navigate(["/home/contact"], {});
  }

  showabout() {
    this.router.navigate(["/home/about"], {});
  }

  showservices() {
    this.router.navigate(["/home/services"], {});
  }

  showlegal() {
    this.router.navigate(["/home/legal"], {});
  }

  showprivacy() {
    this.router.navigate(["/home/privacy"], {});
  }

  showterms() {
    this.router.navigate(["/home/terms"], {});
  }

  showbankaccount() {
    this.router.navigate(["/home/bankaccounts"], {});
  }

  showtransaction() {
    this.router.navigate(["/home/transactions"], {});
  }

  showjournal() {
    this.router.navigate(["/home/journals"], {});
  }

  showledger() {
    this.router.navigate(["/home/ledgers"], {});
  }

  showchartofaccount() {
    this.router.navigate(["/home/chartofaccounts"], {});
  }

  showtrialbalance() {
    this.router.navigate(["/home/trialbalances"], {});
  }

  showincomestatement() {
    this.router.navigate(["/home/incomestatements"], {});
  }

  showprofitandloss() {
    this.router.navigate(["/home/profitandlosses"], {});
  }

  showbalancesheet() {
    this.router.navigate(["/home/balancesheets"], {});
  }

}
