import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { LedgeraccountclassificationComponent } from 'src/app/components/account/ledgeraccountclassification/ledgeraccountclassification.component';
import { LedgeraccountclassificationService } from 'src/app/components/account/ledgeraccountclassification/ledgeraccountclassification.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-ledgeraccountclassifications',
  templateUrl: './ledgeraccountclassifications.component.html',
  styleUrls: ['./ledgeraccountclassifications.component.css']
})
export class LedgeraccountclassificationsComponent implements OnInit {
  @ViewChild("ledgeraccountclassifications") ledgeraccountclassifications: LedgeraccountclassificationComponent;
  @ViewChild("addledgeraccountclassification") addledgeraccountclassification: LedgeraccountclassificationComponent;
  @ViewChild("editledgeraccountclassification") editledgeraccountclassification: LedgeraccountclassificationComponent;

  constructor(
    private ledgeraccountclassificationservice: LedgeraccountclassificationService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  refresh() {
    this.ledgeraccountclassifications.ngOnInit();
    this.cancel();
  }

  show(row) {
    this.router.navigate(["/home/ledgeraccountclassification"], { queryParams: { ledgeraccountclassification: row.data.ledgeraccountclassification_ID } });
  }

  addNew() {
    this.addledgeraccountclassification.add();
    $("#add").modal("show");
  }

  edit(row) {
    this.editledgeraccountclassification.ledgeraccountclassification = {
      ledgeraccountclassification_ID: row.data.ledgeraccountclassification_ID,
      ledgeraccounttype_ID: row.data.ledgeraccounttype_ID,
      ledgeraccountclassification_CODE: row.data.ledgeraccountclassification_CODE,
      ledgeraccountclassification_NAME: row.data.ledgeraccountclassification_NAME,
      ledgeraccountclassification_DESC: row.data.ledgeraccountclassification_DESC,
      isactive: row.data.isactive
    };

    if (row.data.isactive == "Y") {
      this.editledgeraccountclassification.ledgeraccountclassification.isactive = true;
    } else {
      this.editledgeraccountclassification.ledgeraccountclassification.isactive = false;
    }
    $("#edit").modal("show");
  }

  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }

}
