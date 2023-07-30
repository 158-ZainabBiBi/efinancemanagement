import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { TrialbalanceComponent } from '../../../components/account/trialbalance/trialbalance.component'
import { TrialbalanceService } from '../../../components/account/trialbalance/trialbalance.service';
import { Router, RouterLinkWithHref } from '@angular/router';

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
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  refresh() {
    this.trialbalances.load(true);
    this.cancel();
  }

  show(row) {
    this.router.navigate(["/home/trialbalance"], { queryParams: { trialbalance: row.data.trialbalance_ID } });
  }

  view() {
  }

  addNew() {
    // this.router.navigate(["/home/trialbalance"], {});
    this.addtrialbalance.add();
    $("#add").modal("show");
  }

  edit(row) {
    this.edittrialbalance.trialbalance = {
      trialbalance_ID: row.data.trialbalance_ID,
      ledger_ID: row.data.ledger_ID,

      trialbalance_CODE: row.data.trialbalance_CODE,
      trialbalance_NAME: row.data.trialbalance_NAME,

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
