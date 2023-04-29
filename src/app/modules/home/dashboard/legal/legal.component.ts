import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-legal',
  templateUrl: './legal.component.html',
  styleUrls: ['./legal.component.css']
})
export class LegalComponent implements OnInit {

  constructor(
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  // showcontact() {
  //   this.router.navigate(["/home/contact"], {});
  // }

  // showabout() {
  //   this.router.navigate(["/home/about"], {});
  // }

  // showservices() {
  //   this.router.navigate(["/home/services"], {});
  // }

  // showlegal() {
  //   this.router.navigate(["/home/legal"], {});
  // }

  // showprivacy() {
  //   this.router.navigate(["/home/privacy"], {});
  // }

  // showterms() {
  //   this.router.navigate(["/home/terms"], {});
  // }

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

  showtransaction() {
    window.open('http://localhost:4200/#/home/transactions', '_blank');
  }

  showjournal() {
    window.open('http://localhost:4200/#/home/journals', '_blank');
  }

}
