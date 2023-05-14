import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { LedgeraccountComponent } from 'src/app/components/account/ledgeraccount/ledgeraccount.component';
import { LedgeraccountService } from 'src/app/components/account/ledgeraccount/ledgeraccount.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-ledgeraccounts',
  templateUrl: './ledgeraccounts.component.html',
  styleUrls: ['./ledgeraccounts.component.css']
})
export class LedgeraccountsComponent implements OnInit {
  @ViewChild("ledgeraccounts") ledgeraccounts: LedgeraccountComponent;
  @ViewChild("addledgeraccount") addledgeraccount: LedgeraccountComponent;
  @ViewChild("editledgeraccount") editledgeraccount: LedgeraccountComponent;

  constructor(
    private ledgeraccountservice: LedgeraccountService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  refresh() {
    this.ledgeraccounts.ngOnInit();
    this.cancel();
  }

  show(row) {
    this.router.navigate(["/home/ledgeraccount"], { queryParams: { ledgeraccount: row.data.ledgeraccount_ID } });
  }

  addNew() {
    this.addledgeraccount.add();
    $("#add").modal("show");
  }

  edit(row) {
    this.editledgeraccount.ledgeraccount = {
      ledgeraccount_ID: row.data.ledgeraccount_ID,
      ledgeraccounttype_ID: row.data.ledgeraccounttype_ID,
      ledgeraccountclassification_ID: row.data.ledgeraccountclassification_ID,
      ledgeraccount_CODE: row.data.ledgeraccount_CODE,
      ledgeraccount_NAME: row.data.ledgeraccount_NAME,
      ledgeraccount_DESC: row.data.ledgeraccount_DESC,
      balance_CREDIT: row.data.balance_CREDIT,
      balance_DEBIT: row.data.balance_DEBIT,
      isactive: row.data.isactive
    };

    if (row.data.isactive == "Y") {
      this.editledgeraccount.ledgeraccount.isactive = true;
    } else {
      this.editledgeraccount.ledgeraccount.isactive = false;
    }
    $("#edit").modal("show");
  }

  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }

}
