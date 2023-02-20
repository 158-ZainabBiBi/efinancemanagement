import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { RouterLinkWithHref } from '@angular/router';

import { CustomerrefundComponent } from 'src/app/components/accounts/customerrefund/customerrefund.component';
import { CustomerrefundService } from 'src/app/components/accounts/customerrefund/customerrefund.service';

declare var $: any;

@Component({
  selector: 'app-customerrefunds',
  templateUrl: './customerrefunds.component.html',
  styleUrls: ['./customerrefunds.component.css']
})
export class CustomerrefundsComponent implements OnInit {
  @ViewChild("customerrefunds") customerrefunds: CustomerrefundComponent;
  @ViewChild("addcustomerrefund") addcustomerrefund: CustomerrefundComponent;
  @ViewChild("editcustomerrefund") editcustomerrefund: CustomerrefundComponent;

  constructor(
    private customerrefundservice: CustomerrefundService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  addNew() {
    this.addcustomerrefund.add();
    $("#add").modal("show");
  }

  edit(row) {
    this.editcustomerrefund.customerrefund = {
      customerrefund_ID: row.data.customerrefund_ID,
      customer_ID: row.data.customer_ID,
      account_ID: row.data.account_ID,
      currency_ID:  row.data.currency_ID,
      postingperiod_ID: row.data.postingperiod_ID,
      refundmethod_ID: row.data.refundmethod_ID,
      customerrefund_CODE: row.data.customerrefund_CODE,
      customerrefund_DATE: row.data.customerrefund_DATE,
      customer_BALANCE: row.data.customer_BALANCE,
      customerrefund_AMOUNT: row.data.customerrefund_AMOUNT,
      exchange_RATE: row.data.exchange_RATE,
      check_NUMBER: row.data.check_NUMBER,
      creditcard_NUMBER: row.data.creditcard_NUMBER,
      expire_DATE: row.data.expire_DATE,
      name_ONCARD: row.data.name_ONCARD,
      card_STREET: row.data.card_STREET,
      card_ZIPCODE: row.data.card_ZIPCODE,
      isapproved: row.data.isapproved,
      isactive: row.data.isactive
    };
    if (row.data.isactive=="Y") {
      this.editcustomerrefund.customerrefund.isactive = true;
    } else {
      this.editcustomerrefund.customerrefund.isactive = false;
    }
    $("#edit").modal("show");
  }

  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }

}
