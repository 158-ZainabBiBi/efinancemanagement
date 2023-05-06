import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { BankdepositComponent } from 'src/app/components/account/bankdeposit/bankdeposit.component';
import { BankdepositService } from 'src/app/components/account/bankdeposit/bankdeposit.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-bankdeposits',
  templateUrl: './bankdeposits.component.html',
  styleUrls: ['./bankdeposits.component.css']
})
export class BankdepositsComponent implements OnInit {
  @ViewChild("bankdeposits") bankdeposits: BankdepositComponent;
  @ViewChild("addbankdeposit") addbankdeposit: BankdepositComponent;
  @ViewChild("editbankdeposit") editbankdeposit: BankdepositComponent;

  constructor(
    private bankdepositservice: BankdepositService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  refresh() {
    this.bankdeposits.ngOnInit();
    this.cancel();
  }

  show(row) {
    this.router.navigate(["/home/bankdeposit"], { queryParams: { bankdeposit: row.data.bankdeposit_ID } });
  }

  addNew() {
    this.addbankdeposit.add();
    $("#add").modal("show");
  }

  edit(row) {
    this.editbankdeposit.bankdeposit = {
      bankdeposit_ID: row.data.bankdeposit_ID,
      frombankaccount_ID: row.data.frombankaccount_ID,
      tobankaccount_ID: row.data.tobankaccount_ID,
      bankdeposit_CODE: row.data.bankdeposit_CODE,
      bankdeposit_DATE: row.data.bankdeposit_DATE,
      cash_AMOUNT: row.data.cash_AMOUNT,
      cheque_AMOUNT: row.data.cheque_AMOUNT,
      total_AMOUNT: row.data.total_AMOUNT,
      isactive: row.data.isactive
    };

    if (row.data.isactive == "Y") {
      this.editbankdeposit.bankdeposit.isactive = true;
    } else {
      this.editbankdeposit.bankdeposit.isactive = false;
    }
    $("#edit").modal("show");
  }

  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }

}
