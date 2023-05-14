import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { JournalComponent } from '../../../components/account/journal/journal.component'
import { JournalService } from '../../../components/account/journal/journal.service';
import { Router, RouterLinkWithHref } from '@angular/router';

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

  refresh() {
    this.journals.ngOnInit();
    this.cancel();
  }

  show(row) {
    this.router.navigate(["/home/journal"], { queryParams: { journal: row.data.journal_ID } });
  }

  view() {
  }

  addNew() {
    // this.router.navigate(["/home/journal"], {});
    this.addjournal.add();
    $("#add").modal("show");
  }

  edit(row) {
    this.editjournal.journal = {
      journal_ID: row.data.journal_ID,
      journalline_ID: row.data.journalline_ID,
      transaction_ID: row.data.transaction_ID,

      journal_CODE: row.data.journal_CODE,

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

}
