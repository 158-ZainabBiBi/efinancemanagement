import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { ProfitandlossComponent } from 'src/app/components/account/profitandloss/profitandloss.component';
import { ProfitandlossService } from 'src/app/components/account/profitandloss/profitandloss.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-profitandlosses',
  templateUrl: './profitandlosses.component.html',
  styleUrls: ['./profitandlosses.component.css']
})
export class ProfitandlossesComponent implements OnInit {
  @ViewChild("profitandlosses") profitandlosses: ProfitandlossComponent;
  @ViewChild("addprofitandloss") addprofitandloss: ProfitandlossComponent;
  @ViewChild("editprofitandloss") editprofitandloss: ProfitandlossComponent;

  constructor(
    private profitandlossservice: ProfitandlossService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  refresh() {
    this.profitandlosses.load(true);
    this.cancel();
  }

  show(row) {
    this.router.navigate(["/home/profitandloss"], { queryParams: { profitandloss: row.data.profitandloss_ID } });
  }

  addNew() {
    this.router.navigate(["/home/profitandloss"], {});
    // this.addprofitandloss.add();
    // $("#add").modal("show");
  }

  edit(row) {
    this.editprofitandloss.profitandloss = {
      profitandloss_ID: row.data.profitandloss_ID,
      profitandloss_CODE: row.data.profitandloss_CODE,
      profitandloss_NAME: row.data.profitandloss_NAME,
      ledger_ID: row.data.ledger_ID,
      isactive: row.data.isactive
    };

    if (row.data.isactive == "Y") {
      this.editprofitandloss.profitandloss.isactive = true;
    } else {
      this.editprofitandloss.profitandloss.isactive = false;
    }
    $("#edit").modal("show");
  }

  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }

}
