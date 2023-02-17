import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { RouterLinkWithHref } from '@angular/router';
import { AccountComponent } from '../../../components/accounts/account/account.component';
import { AccountService } from '../../../components/accounts/account/account.service';
import { AccounttypeComponent } from '../../../components/accounts/accounttype/accounttype.component';

declare var $: any;

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  @ViewChild("accounts") accounts: AccountComponent;
  @ViewChild("addaccount") addaccount: AccountComponent;
  @ViewChild("editaccount") editaccount: AccountComponent;

  @ViewChild("accounttypes") accounttypes: AccounttypeComponent;
  @ViewChild("addaccounttype") addaccounttype: AccounttypeComponent;
  @ViewChild("editaccounttype") editaccounttype: AccounttypeComponent;

  constructor(
    private accountservice: AccountService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  addNewAccount() {
    this.addaccount.add();
    $("#addaccount").modal("show");
  }

  editAccount(row) {
    this.editaccount.account = {
      account_ID: row.data.account_ID,
      account_NAME:row.data.account_NAME,
      account_CODE:row.data.account_CODE,
      account_DESCRIPTION:row.data.account_DESCRIPTION,
      accounttype_ID:row.data.accounttype,
      accountparent_ID:row.data.accountparent_ID,
      account_DATE:row.data.account_DATE,
      bankaccount_NUMBER:row.data.bankaccount_NUMBER,
      cashflowratetype_ID:row.data.cashflowratetype,
      generalratetype_ID:row.data.generalratetype,

      isactive: row.data.isactive
    };
    if (row.data.isactive=="Y") {
      this.editaccount.account.isactive = true;
    } else {
      this.editaccount.account.isactive = false;
    }
    $("#editaccount").modal("show");
  }

  cancelAccount() {
    $("#addaccount").modal("hide");
    $("#editaccount").modal("hide");
  }

  addNewAccounttype() {
    this.addaccounttype.add();
    $("#addaccounttype").modal("show");
  }
}
