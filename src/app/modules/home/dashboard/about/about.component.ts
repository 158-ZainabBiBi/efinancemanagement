import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from 'src/app/services/on-fail.service';
import 'owl.carousel';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

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
}
