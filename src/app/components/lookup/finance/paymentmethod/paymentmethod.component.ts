import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-paymentmethod',
  templateUrl: './paymentmethod.component.html',
  styleUrls: ['./paymentmethod.component.css']
})
export class PaymentmethodComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  paymentmethodID = null;

  paymentmethods = [];
  paymentmethodsAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.paymentmethods = JSON.parse(window.sessionStorage.getItem('paymentmethods'));
    this.paymentmethodsAll = JSON.parse(window.sessionStorage.getItem('paymentmethodsAll'));

    if (this.paymentmethods == null) {
      this.paymentmethodGet();
    }

    if (this.paymentmethodsAll == null) {
      this.paymentmethodGetAll();
    }
  }

  paymentmethodGet() {
    this.lookupservice.lookup("PAYMENTMETHOD").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.paymentmethods = response;
          window.sessionStorage.setItem("paymentmethods", JSON.stringify(this.paymentmethods));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  paymentmethodGetAll() {
    this.lookupservice.lookupAll("PAYMENTMETHOD").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.paymentmethodsAll = response;
          window.sessionStorage.setItem("paymentmethodsAll", JSON.stringify(this.paymentmethodsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
