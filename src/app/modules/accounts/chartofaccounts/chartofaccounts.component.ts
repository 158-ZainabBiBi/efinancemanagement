import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { ChartofaccountComponent } from 'src/app/components/account/chartofaccount/chartofaccount.component';
import { ChartofaccountService } from 'src/app/components/account/chartofaccount/chartofaccount.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-chartofaccounts',
  templateUrl: './chartofaccounts.component.html',
  styleUrls: ['./chartofaccounts.component.css']
})
export class ChartofaccountsComponent implements OnInit {
  @ViewChild("chartofaccounts") chartofaccounts: ChartofaccountComponent;
  @ViewChild("addchartofaccount") addchartofaccount: ChartofaccountComponent;
  @ViewChild("editchartofaccount") editchartofaccount: ChartofaccountComponent;

  constructor(
    private chartofaccountservice: ChartofaccountService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  refresh() {
    this.chartofaccounts.load(true);
    this.cancel();
  }

  show(row) {
    this.router.navigate(["/home/chartofaccount"], { queryParams: { chartofaccount: row.data.chartofaccount_ID } });
  }

  addNew() {
    this.router.navigate(["/home/chartofaccount"], {});
    // this.addchartofaccount.add();
    // $("#add").modal("show");
  }

  edit(row) {
    this.editchartofaccount.chartofaccount = {
      chartofaccount_ID: row.data.chartofaccount_ID,
      chartofaccount_CODE: row.data.chartofaccount_CODE,
      chartofaccount_NAME: row.data.chartofaccount_NAME,
      ledger_ID: row.data.ledger_ID,
      isactive: row.data.isactive
    };

    if (row.data.isactive == "Y") {
      this.editchartofaccount.chartofaccount.isactive = true;
    } else {
      this.editchartofaccount.chartofaccount.isactive = false;
    }
    $("#edit").modal("show");
  }

  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }

}
