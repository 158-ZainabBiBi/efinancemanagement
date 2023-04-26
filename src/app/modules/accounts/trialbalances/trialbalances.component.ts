import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { TrialbalanceComponent } from '../../../components/account/trialbalance/trialbalance.component'
import { TrialbalanceService } from '../../../components/account/trialbalance/trialbalance.service';
import { RouterLinkWithHref } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-trialbalances',
  templateUrl: './trialbalances.component.html',
  styleUrls: ['./trialbalances.component.css']
})
export class TrialbalancesComponent implements OnInit {
  @ViewChild("trialbalances") trialbalances: TrialbalanceComponent;
  @ViewChild("addtrialbalance") addtrialbalance: TrialbalanceComponent;
  @ViewChild("edittrialbalance") edittrialbalance: TrialbalanceComponent;

  constructor(
    private trialbalanceservice: TrialbalanceService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  refresh() {
    this.trialbalances.ngOnInit();
    this.cancel();
  }

  addNew() {
    this.addtrialbalance.add();
    $("#add").modal("show");
  }

  edit(row) {
    this.edittrialbalance.trialbalance = {
      trialbalance_ID: row.data.trialbalance_ID,
      ledgerentry_ID: row.data.ledgerentry_ID,

      trialbalance_CODE: row.data.trialbalance_CODE,
      trialbalance_NAME: row.data.trialbalance_NAME,
      trialbalance_DESC: row.data.trialbalance_DESC,

      balance_FROMDATE: row.data.balance_FROMDATE,
      balance_TODATE: row.data.balance_TODATE,
      balance_CREDIT: row.data.balance_CREDIT,
      balance_DEBIT: row.data.balance_DEBIT,

      isactive: row.data.isactive
    };
    if (row.data.isactive == "Y") {
      this.edittrialbalance.trialbalance.isactive = true;
    } else {
      this.edittrialbalance.trialbalance.isactive = false;
    }
    $("#edit").modal("show");
  }
  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }

}
