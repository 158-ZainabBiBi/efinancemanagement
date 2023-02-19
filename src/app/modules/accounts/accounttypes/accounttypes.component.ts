import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { AccounttypeComponent } from '../../../components/accounts/accounttype/accounttype.component'
import { AccounttypeService } from '../../../components/accounts/accounttype/accounttype.service';
import { Router, RouterLinkWithHref } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-accounttypes',
  templateUrl: './accounttypes.component.html',
  styleUrls: ['./accounttypes.component.css']
})
export class AccounttypesComponent implements OnInit {
  @ViewChild("accounttypes") accounttypes: AccounttypeComponent;
  @ViewChild("addaccounttype") addaccounttype: AccounttypeComponent;
  @ViewChild("editaccounttype") editaccounttype: AccounttypeComponent;

  constructor(
    private accounttypeservice: AccounttypeService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  show(row) {
    this.router.navigate(["/home/accounttype"], { queryParams: { accounttype: row.data.accounttype_ID } });
  }

  view() {
  }

  addNew() {
    this.router.navigate(["/home/accounttype"], {});
  }

  edit(row) {
    this.editaccounttype.accounttype = {
      accounttype_ID: row.data.accounttype_ID,
      accounttype_NAME:row.data.accounttype_NAME,
      accounttype_CODE:row.data.accounttype_CODE,
      accounttype_DESCRIPTION:row.data.accounttype_DESCRIPTION,
      isactive: row.data.isactive
    };
    if (row.data.isactive=="Y") {
      this.editaccounttype.accounttype.isactive = true;
    } else {
      this.editaccounttype.accounttype.isactive = false;
    }
    $("#edit").modal("show");
  }

  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }
}
