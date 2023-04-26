import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { RouterLinkWithHref } from '@angular/router';

import { CoaaccountComponent } from 'src/app/components/account/coaaccount/coaaccount.component';
import { CoaaccountService } from 'src/app/components/account/coaaccount/coaaccount.service';

declare var $: any;

@Component({
  selector: 'app-chartofaccounts',
  templateUrl: './chartofaccounts.component.html',
  styleUrls: ['./chartofaccounts.component.css']
})
export class ChartofaccountsComponent implements OnInit {
  @ViewChild("chartofaccounts") chartofaccounts: CoaaccountComponent;
  @ViewChild("addchartofaccount") addchartofaccount: CoaaccountComponent;
  @ViewChild("editchartofaccount") editchartofaccount: CoaaccountComponent;

  constructor(
    private chartofaccountservice: CoaaccountService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  refresh() {
    this.chartofaccounts.ngOnInit();
    this.cancel();
  }

  addNew() {
    this.addchartofaccount.add();
    $("#add").modal("show");
  }

  edit(row) {
    this.editchartofaccount.coaaccount = {
      coaaccount_ID: row.data.coaaccount_ID,
      ledgeraccount_ID: row.data.ledgeraccount_ID,

      coaaccount_CODE: row.data.coaaccount_CODE,
      coaaccount_NAME: row.data.coaaccount_NAME,
      coaaccount_DESC: row.data.coaaccount_DESC,

      isactive: row.data.isactive
    };
    if (row.data.isactive == "Y") {
      this.editchartofaccount.coaaccount.isactive = true;
    } else {
      this.editchartofaccount.coaaccount.isactive = false;
    }
    $("#edit").modal("show");
  }
  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }

}
