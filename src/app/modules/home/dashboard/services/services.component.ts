import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {

  constructor(
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    // show the first div by default
    this.showDiv(1);
  }

  showDiv(index: number): void {
    const divs = document.querySelectorAll('.tab');
    divs.forEach((div, i) => {
      if (i === index - 1) {
        (div as HTMLElement).style.display = "block";
      } else {
        (div as HTMLElement).style.display = "none";
      }
    });
  }

  showindex() {
    window.open('http://localhost:4200/#/home/indexes', '_blank');
  }

  showcontact() {
    window.open('http://localhost:4200/#/home/contact', '_blank');
  }

  showabout() {
    window.open('http://localhost:4200/#/home/about', '_blank');
  }

  showservices() {
    window.open('http://localhost:4200/#/home/services', '_blank');
  }

  showlegal() {
    window.open('http://localhost:4200/#/home/legal', '_blank');
  }

  showprivacy() {
    window.open('http://localhost:4200/#/home/privacy', '_blank');
  }

  showterms() {
    window.open('http://localhost:4200/#/home/terms', '_blank');
  }

  showbankaccount() {
    window.open('http://localhost:4200/#/home/bankaccounts', '_blank');
  }

  showbanktransfer() {
    window.open('http://localhost:4200/#/home/banktransfer', '_blank');
  }

  showbankdeposit() {
    window.open('http://localhost:4200/#/home/bankdeposit', '_blank');
  }

  showtransaction() {
    window.open('http://localhost:4200/#/home/transactions', '_blank');
  }

  showjournal() {
    window.open('http://localhost:4200/#/home/journals', '_blank');
  }

  showjournalline() {
    window.open('http://localhost:4200/#/home/journallines', '_blank');
  }

  showchartofaccount() {
    window.open('http://localhost:4200/#/home/chartofaccounts', '_blank');
  }

  showtrialbalance() {
    window.open('http://localhost:4200/#/home/trialbalances', '_blank');
  }

}
