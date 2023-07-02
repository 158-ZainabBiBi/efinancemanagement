import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { AccountComponent } from 'src/app/components/account/account/account.component';
import { AccountService } from 'src/app/components/account/account/account.service';
import { Router } from '@angular/router';

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

  constructor(
    private accountservice: AccountService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  show(row) {
    this.router.navigate(["/home/account"], { queryParams: { account: row.data.account_ID } });
  }

  refresh() {
    this.accounts.load(true);
    this.cancel();
  }

  addNew() {
    this.addaccount.add();
    $("#add").modal("show");
  }

  edit(row) {
    this.editaccount.account = {
      account_ID: row.data.account_ID,
      account_CODE: row.data.account_CODE,
      account_TITLE: row.data.account_TITLE,
      isactive: row.data.isactive
    };
    if (row.data.isactive == "Y") {
      this.editaccount.account.isactive = true;
    } else {
      this.editaccount.account.isactive = false;
    }
    $("#edit").modal("show");
  }
  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }

}
