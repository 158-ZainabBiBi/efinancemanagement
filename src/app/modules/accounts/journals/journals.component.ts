import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { JournalComponent } from 'src/app/components/account/journal/journal.component';
import { JournalService } from 'src/app/components/account/journal/journal.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-journals',
  templateUrl: './journals.component.html',
  styleUrls: ['./journals.component.css']
})
export class JournalsComponent implements OnInit {
  @ViewChild("journals") journals: JournalComponent;
  @ViewChild("addjournal") addjournal: JournalComponent;
  @ViewChild("editjournal") editjournal: JournalComponent;

  constructor(
    private journalservice: JournalService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  refresh() {
    this.journals.load(true);
    this.cancel();
  }

  show(row) {
    this.router.navigate(["/home/journal"], { queryParams: { journal: row.data.journal_ID } });
  }

  addNew() {
    this.router.navigate(["/home/journal"], {});
    // this.addjournal.add();
    // $("#add").modal("show");
  }

  edit(row) {
    this.editjournal.journal = {
      journal_ID: row.data.journal_ID,
      journal_CODE: row.data.journal_CODE,
      journal_NAME: row.data.journal_NAME,
      transaction_ID: row.data.transaction_ID,
      account_ID: row.data.account_ID,
      journal_DEBIT: row.data.journal_DEBIT,
      journal_CREDIT: row.data.journal_CREDIT,
      isactive: row.data.isactive
    };

    if (row.data.isactive == "Y") {
      this.editjournal.journal.isactive = true;
    } else {
      this.editjournal.journal.isactive = false;
    }
    $("#edit").modal("show");
  }

  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }

  advancedSearch(search) {
    this.journals.journalAdvancedSearch(search);
  }

}
