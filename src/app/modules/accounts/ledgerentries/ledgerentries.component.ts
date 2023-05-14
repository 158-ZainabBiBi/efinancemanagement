import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { LedgerentryComponent } from 'src/app/components/account/ledgerentry/ledgerentry.component';
import { LedgerentryService } from 'src/app/components/account/ledgerentry/ledgerentry.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-ledgerentries',
  templateUrl: './ledgerentries.component.html',
  styleUrls: ['./ledgerentries.component.css']
})
export class LedgerentriesComponent implements OnInit {
  @ViewChild("ledgerentries") ledgerentries: LedgerentryComponent;
  @ViewChild("addledgerentry") addledgerentry: LedgerentryComponent;
  @ViewChild("editledgerentry") editledgerentry: LedgerentryComponent;

  constructor(
    private ledgerentrieservice: LedgerentryService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  refresh() {
    this.ledgerentries.ngOnInit();
    this.cancel();
  }

  show(row) {
    this.router.navigate(["/home/ledgerentry"], { queryParams: { ledgerentry: row.data.ledgerentry_ID } });
  }

  addNew() {
    this.addledgerentry.add();
    $("#add").modal("show");
  }

  edit(row) {
    this.editledgerentry.ledgerentry = {
      ledgerentry_ID: row.data.ledgerentry_ID,
      journal_ID: row.data.journal_ID,
      ledgerentry_CODE: row.data.ledgerentry_CODE,
      ledgerentry_NAME: row.data.ledgerentry_NAME,
      credit_AMOUNT: row.data.credit_AMOUNT,
      debit_AMOUNT: row.data.debit_AMOUNT,
      isactive: row.data.isactive
    };

    if (row.data.isactive == "Y") {
      this.editledgerentry.ledgerentry.isactive = true;
    } else {
      this.editledgerentry.ledgerentry.isactive = false;
    }
    $("#edit").modal("show");
  }

  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }

}
