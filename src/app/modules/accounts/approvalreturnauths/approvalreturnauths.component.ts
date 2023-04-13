import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { RouterLinkWithHref } from '@angular/router';

import { ApprovalreturnauthComponent } from 'src/app/components/account/approvalreturnauth/approvalreturnauth.component';
import { ApprovalreturnauthService } from 'src/app/components/account/approvalreturnauth/approvalreturnauth.service';

declare var $: any;

@Component({
  selector: 'app-approvalreturnauths',
  templateUrl: './approvalreturnauths.component.html',
  styleUrls: ['./approvalreturnauths.component.css']
})
export class ApprovalreturnauthsComponent implements OnInit {
  @ViewChild("approvalreturnauths") approvalreturnauths: ApprovalreturnauthComponent;
  @ViewChild("addapprovalreturnauth") addapprovalreturnauth: ApprovalreturnauthComponent;
  @ViewChild("editapprovalreturnauth") editapprovalreturnauth: ApprovalreturnauthComponent;

  constructor(
    private approvalreturnauthservice: ApprovalreturnauthService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  addNew() {
    this.addapprovalreturnauth.add();
    $("#add").modal("show");
  }

  edit(row) {
    this.editapprovalreturnauth.approvalreturnauth = {
      approvalreturnauth_ID: row.data.approvalreturnauth_ID,
      returnauth_ID: row.data.returnauth_ID,
      currency_ID: row.data.currency_ID,
      approvalreturnauth_AMOUNT: row.data.approvalreturnauth_AMOUNT,
      approvalreturnauth_DATE: row.data.approvalreturnauth_DATE,
      isapproved: row.data.isapproved,
      isactive: row.data.isactive
    };
    if (row.data.isactive == "Y") {
      this.editapprovalreturnauth.approvalreturnauth.isactive = true;
    } else {
      this.editapprovalreturnauth.approvalreturnauth.isactive = false;
    }
    $("#edit").modal("show");
  }

  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }

  advancedSearch(returnauthID, currencyID) {
    this.approvalreturnauths.approvalreturnauthAdvancedSearch(returnauthID, currencyID);
  }

  advancedSearchAll(returnauthID, currencyID) {
    this.approvalreturnauths.approvalreturnauthAdvancedSearchAll(returnauthID, currencyID);
  }
}
