import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BalancesheetComponent } from 'src/app/components/account/balancesheet/balancesheet.component';
import { BalancesheetService } from 'src/app/components/account/balancesheet/balancesheet.service';
import { OnFailService } from '../../../services/on-fail.service';

declare var $: any;

@Component({
  selector: 'app-balancesheets',
  templateUrl: './balancesheets.component.html',
  styleUrls: ['./balancesheets.component.css']
})
export class BalancesheetsComponent implements OnInit {
  @ViewChild("balancesheets") balancesheets: BalancesheetComponent;
  @ViewChild("addbalancesheet") addbalancesheet: BalancesheetComponent;
  @ViewChild("editbalancesheet") editbalancesheet: BalancesheetComponent;

  constructor(
    private balancesheetservice: BalancesheetService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  refresh() {
    this.balancesheets.load(true);
    this.cancel();
  }

  show(row) {
    this.router.navigate(["/home/balancesheet"], { queryParams: { balancesheet: row.data.balancesheet_ID } });
  }

  addNew() {
    this.addbalancesheet.add();
    $("#add").modal("show");
  }

  edit(row) {
    this.editbalancesheet.balancesheet = {
      balancesheet_ID: row.data.balancesheet_ID,
      balancesheet_CODE: row.data.balancesheet_CODE,
      balancesheet_NAME: row.data.balancesheet_NAME,
      trialbalance_ID: row.data.trialbalance_ID,
      isactive: row.data.isactive
    };

    if (row.data.isactive == "Y") {
      this.editbalancesheet.balancesheet.isactive = true;
    } else {
      this.editbalancesheet.balancesheet.isactive = false;
    }
    $("#edit").modal("show");
  }

  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }

  advancedSearch(search) {
    this.balancesheets.balancesheetAdvancedSearch(search);
  }
}
