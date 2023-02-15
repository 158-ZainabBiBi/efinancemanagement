import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { OnFailService } from '../../../services/on-fail.service';
import { LookupService } from '../../../services/lookup.service';

@Component({
  selector: 'app-paymentstatus',
  templateUrl: './paymentstatus.component.html',
  styleUrls: ['./paymentstatus.component.css'],
})
export class PaymentstatusComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  paymentstatusID = null;

  paymentstatuses = [];
  paymentstatusesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService
  ) {}

  ngOnInit(): void {
    this.paymentstatuses = JSON.parse(
      window.sessionStorage.getItem('paymentstatuses')
    );
    this.paymentstatusesAll = JSON.parse(
      window.sessionStorage.getItem('paymentstatusesAll')
    );
    if (this.disabled == false && this.paymentstatuses == null) {
      this.paymentstatusGet();
    } else if (this.disabled == true && this.paymentstatusesAll == null) {
      this.paymentstatusGetAll();
    }
  }

  setPaymentstatuss(response) {
    if (this.disabled == false) {
      this.paymentstatuses = response;
      window.sessionStorage.setItem(
        'paymentstatuses',
        JSON.stringify(this.paymentstatuses)
      );
    } else {
      this.paymentstatusesAll = response;
      window.sessionStorage.setItem(
        'paymentstatusesAll',
        JSON.stringify(this.paymentstatusesAll)
      );
    }
  }

  paymentstatusGet() {
    this.lookupservice.lookup('PAYMENTSTATUS').subscribe(
      (response) => {
        if (response) {
          if (response.error && response.status) {
            this.toastrservice.warning('Message', ' ' + response.message);
          } else {
            this.setPaymentstatuss(response);
          }
        }
      },
      (error) => {
        this.onfailservice.onFail(error);
      }
    );
  }

  paymentstatusGetAll() {
    this.lookupservice.lookupAll('PAYMENTSTATUS').subscribe(
      (response) => {
        if (response) {
          if (response.error && response.status) {
            this.toastrservice.warning('Message', ' ' + response.message);
          } else {
            this.setPaymentstatuss(response);
          }
        }
      },
      (error) => {
        this.onfailservice.onFail(error);
      }
    );
  }
}
