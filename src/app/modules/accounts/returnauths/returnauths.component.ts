import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { RouterLinkWithHref } from '@angular/router';

import { ReturnauthComponent } from 'src/app/components/accounts/returnauth/returnauth.component';
import { ReturnauthService } from 'src/app/components/accounts/returnauth/returnauth.service';

declare var $: any;

@Component({
  selector: 'app-returnauths',
  templateUrl: './returnauths.component.html',
  styleUrls: ['./returnauths.component.css']
})
export class ReturnauthsComponent implements OnInit {
  @ViewChild("returnauths") returnauths: ReturnauthComponent;
  @ViewChild("addreturnauth") addreturnauth: ReturnauthComponent;
  @ViewChild("editreturnauth") editreturnauth: ReturnauthComponent;

  constructor(
    private returnauthservice: ReturnauthService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  addNew() {
    this.addreturnauth.add();
    $("#add").modal("show");
  }

  edit(row) {
    this.editreturnauth.returnauth = {
      returnauth_ID: row.data.returnauth_ID,
      customer_ID:row.data.customer_ID,
      customerrefund_ID:row.data.customerrefund_ID,
      currency_ID:row.data.currency_ID,
      returnauth_DATE:row.data.returnauth_DATE,
      product_ID:row.data.product_ID,
      returnstatus_ID:row.data.returnstatus_ID,
      saleordertype_ID: row.data.saleordertype_ID,
      returnauth_CODE:row.data.returnauth_CODE,
      delivery_DATE:row.data.delivery_DATE,
      exchange_RATE:row.data.exchange_RATE,
      rate:row.data.rate,
      discount:row.data.discount,
      isactive: row.data.isactive
    };
    if (row.data.isactive=="Y") {
      this.editreturnauth.returnauth.isactive = true;
    } else {
      this.editreturnauth.returnauth.isactive = false;
    }
    $("#edit").modal("show");
  }

  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }

}
