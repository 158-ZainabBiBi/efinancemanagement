import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { CreditcardtransactionComponent } from '../../../components/accounts/creditcardtransaction/creditcardtransaction.component'
import { CreditcardtransactionService } from '../../../components/accounts/creditcardtransaction/creditcardtransaction.service';
import { Router, RouterLinkWithHref } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-creditcardtransactions',
  templateUrl: './creditcardtransactions.component.html',
  styleUrls: ['./creditcardtransactions.component.css']
})
export class CreditcardtransactionsComponent implements OnInit {
  @ViewChild("creditcardtransactions") creditcardtransactions: CreditcardtransactionComponent;
  @ViewChild("addcreditcardtransaction") addcreditcardtransaction: CreditcardtransactionComponent;
  @ViewChild("editcreditcardtransaction") editcreditcardtransaction: CreditcardtransactionComponent;

  constructor(
    private creditcardtransactionservice: CreditcardtransactionService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  show(row) {
    this.router.navigate(["/home/creditcardtransaction"], { queryParams: { creditcardtransaction: row.data.creditcardtransaction_ID } });
  }

  view() {
  }

  addNew() {
    this.router.navigate(["/home/creditcardtransaction"], {});
  }

  edit(row) {
    this.editcreditcardtransaction.creditcardtransaction = {
      creditcardtransaction_ID: row.data.creditcardtransaction_ID,
      cardtype_ID: row.data.cardtype_ID,
      customer_ID: row.data.customer_ID,
      transaction_DATE: row.data.transaction_DATE,
      transaction_AMOUNT: row.data.transaction_AMOUNT,
      transaction_STATUS: row.data.transaction_STATUS,
      name_ONCARD: row.data.name_ONCARD,
      card_NUMBER: row.data.card_NUMBER,
      authcode: row.data.authcode,
      isactive: row.data.isactive
    };
    if (row.data.isactive=="Y") {
      this.editcreditcardtransaction.creditcardtransaction.isactive = true;
    } else {
      this.editcreditcardtransaction.creditcardtransaction.isactive = false;
    }
    $("#edit").modal("show");
  }

  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }
}
