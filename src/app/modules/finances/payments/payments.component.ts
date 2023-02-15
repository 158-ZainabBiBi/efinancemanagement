import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { RouterLinkWithHref } from '@angular/router';
import { PaymentComponent } from '../../../components/finances/payment/payment.component';
import { PaymentService } from '../../../components/finances/payment/payment.service';

declare var $: any;

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  @ViewChild("payments") payments: PaymentComponent;
  @ViewChild("addpayment") addpayment: PaymentComponent;
  @ViewChild("editpayment") editpayment: PaymentComponent;

  constructor(
    private paymentervice: PaymentService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  addNew() {
    this.addpayment.add();
    $("#add").modal("show");
  }
  
  edit(row) {
    this.editpayment.payment = {
      payment_ID: row.data.payment_ID,
      studentinstance_ID: row.data.studentinstance_ID,
      payment_NUMBER: row.data.payment_NUMBER,
      payment_DATE: row.data.payment_DATE,
      payment_AMOUNT: row.data.payment_AMOUNT,
      account_ID: row.data.account_ID,
      paymentmethod_ID: row.data.paymentmethod_ID,
      paymentstatus_ID: row.data.paymentstatus_ID,
      isactive: row.data.isactive
    };
    if (row.data.isactive=="Y") {
      this.editpayment.payment.isactive = true;
    } else {
      this.editpayment.payment.isactive = false;
    }
    $("#edit").modal("show");
  }
  
  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }

}



