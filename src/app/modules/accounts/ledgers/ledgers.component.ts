import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { LedgerComponent } from 'src/app/components/account/ledger/ledger.component';
import { LedgerService } from 'src/app/components/account/ledger/ledger.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-ledgers',
  templateUrl: './ledgers.component.html',
  styleUrls: ['./ledgers.component.css']
})
export class LedgersComponent implements OnInit {
  @ViewChild("ledgers") ledgers: LedgerComponent;
  @ViewChild("addledger") addledger: LedgerComponent;
  @ViewChild("editledger") editledger: LedgerComponent;

  constructor(
    private ledgerservice: LedgerService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  refresh() {
    this.ledgers.load(true);
    this.cancel();
  }

  show(row) {
    this.router.navigate(["/home/ledger"], { queryParams: { ledger: row.data.ledger_ID } });
  }

  addNew() {
    this.router.navigate(["/home/ledger"], {});
    // this.addledger.add();
    // $("#add").modal("show");
  }

  edit(row) {
    this.editledger.ledger = {
      ledger_ID: row.data.ledger_ID,
      journal_ID: row.data.journal_ID,
      ledger_CODE: row.data.ledger_CODE,
      ledger_NAME: row.data.ledger_NAME,
      accountclassification_ID: row.data.accountclassification_ID,
      ledger_DEBIT: row.data.ledger_DEBIT,
      ledger_CREDIT: row.data.ledger_CREDIT,
      isactive: row.data.isactive
    };

    if (row.data.isactive == "Y") {
      this.editledger.ledger.isactive = true;
    } else {
      this.editledger.ledger.isactive = false;
    }
    $("#edit").modal("show");
  }

  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }

}
