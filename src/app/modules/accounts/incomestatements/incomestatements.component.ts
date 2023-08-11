import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { IncomestatementComponent } from 'src/app/components/account/incomestatement/incomestatement.component';
import { IncomestatementService } from 'src/app/components/account/incomestatement/incomestatement.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-incomestatements',
  templateUrl: './incomestatements.component.html',
  styleUrls: ['./incomestatements.component.css']
})
export class IncomestatementsComponent implements OnInit {
  @ViewChild("incomestatements") incomestatements: IncomestatementComponent;
  @ViewChild("addincomestatement") addincomestatement: IncomestatementComponent;
  @ViewChild("editincomestatement") editincomestatement: IncomestatementComponent;

  constructor(
    private incomestatementservice: IncomestatementService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  refresh() {
    this.incomestatements.load(true);
    this.cancel();
  }

  show(row) {
    this.router.navigate(["/home/incomestatement"], { queryParams: { incomestatement: row.data.incomestatement_ID } });
  }

  addNew() {
    // this.router.navigate(["/home/incomestatement"], {});
    this.addincomestatement.add();
    $("#add").modal("show");
  }

  edit(row) {
    this.editincomestatement.incomestatement = {
      incomestatement_ID: row.data.incomestatement_ID,
      incomestatement_CODE: row.data.incomestatement_CODE,
      incomestatement_NAME: row.data.incomestatement_NAME,
      ledger_ID: row.data.ledger_ID,
      isactive: row.data.isactive
    };

    if (row.data.isactive == "Y") {
      this.editincomestatement.incomestatement.isactive = true;
    } else {
      this.editincomestatement.incomestatement.isactive = false;
    }
    $("#edit").modal("show");
  }

  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }

  advancedSearch(search) {
    this.incomestatements.incomestatementAdvancedSearch(search);
  }

}
