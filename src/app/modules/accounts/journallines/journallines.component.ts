import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { JournallineComponent } from 'src/app/components/account/journalline/journalline.component';
import { JournallineService } from 'src/app/components/account/journalline/journalline.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-journallines',
  templateUrl: './journallines.component.html',
  styleUrls: ['./journallines.component.css']
})
export class JournallinesComponent implements OnInit {
  @ViewChild("journallines") journallines: JournallineComponent;
  @ViewChild("addjournalline") addjournalline: JournallineComponent;
  @ViewChild("editjournalline") editjournalline: JournallineComponent;

  constructor(
    private journallineservice: JournallineService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  refresh() {
    this.journallines.ngOnInit();
    this.cancel();
  }

  show(row) {
    this.router.navigate(["/home/journalline"], { queryParams: { journalline: row.data.journalline_ID } });
  }

  addNew() {
    this.addjournalline.add();
    $("#add").modal("show");
  }

  edit(row) {
    this.editjournalline.journalline = {
      journalline_ID: row.data.journalline_ID,
      ledgeraccount_ID: row.data.ledgeraccount_ID,
      journalline_CODE: row.data.journalline_CODE,
      journalline_NAME: row.data.journalline_NAME,
      journalline_DESC: row.data.journalline_DESC,
      isactive: row.data.isactive
    };

    if (row.data.isactive == "Y") {
      this.editjournalline.journalline.isactive = true;
    } else {
      this.editjournalline.journalline.isactive = false;
    }
    $("#edit").modal("show");
  }

  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }

}
