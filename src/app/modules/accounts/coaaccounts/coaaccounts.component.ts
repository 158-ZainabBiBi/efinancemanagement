import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { CoaaccountComponent } from '../../../components/account/coaaccount/coaaccount.component'
import { CoaaccountService } from '../../../components/account/coaaccount/coaaccount.service';
import { Router, RouterLinkWithHref } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-coaaccounts',
  templateUrl: './coaaccounts.component.html',
  styleUrls: ['./coaaccounts.component.css']
})
export class CoaaccountsComponent implements OnInit {
  @ViewChild("coaaccounts") coaaccounts: CoaaccountComponent;
  @ViewChild("addcoaaccount") addcoaaccount: CoaaccountComponent;
  @ViewChild("editcoaaccount") editcoaaccount: CoaaccountComponent;

  constructor(
    private coaaccountservice: CoaaccountService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  refresh() {
    this.coaaccounts.ngOnInit();
    this.cancel();
  }

  show(row) {
    this.router.navigate(["/home/chartofaccount"], { queryParams: { coaaccount: row.data.coaaccount_ID } });
  }

  view() {
  }

  addNew() {
    this.router.navigate(["/home/chartofaccount"], {});
    // this.addcoaaccount.add();
    // $("#add").modal("show");
  }

  edit(row) {
    this.editcoaaccount.coaaccount = {
      coaaccount_ID: row.data.coaaccount_ID,
      ledgeraccount_ID: row.data.ledgeraccount_ID,

      coaaccount_CODE: row.data.coaaccount_CODE,
      coaaccount_NAME: row.data.coaaccount_NAME,
      coaaccount_DESC: row.data.coaaccount_DESC,

      isactive: row.data.isactive
    };
    if (row.data.isactive == "Y") {
      this.editcoaaccount.coaaccount.isactive = true;
    } else {
      this.editcoaaccount.coaaccount.isactive = false;
    }
    $("#edit").modal("show");
  }
  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }

}
