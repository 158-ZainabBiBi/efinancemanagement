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
    this.bankdeposits.load(true);
    this.cancel();
  }

  show(row) {
    this.router.navigate(["/home/bankdeposit"], { queryParams: { bankdeposit: row.data.bankdeposit_ID } });
  }

  addNew() {
    this.router.navigate(["/home/bankdeposit"], {});
    // this.addbankdeposit.add();
    // $("#add").modal("show");
  }

  edit(row) {
    this.editbankdeposit.bankdeposit = {
      bankdeposit_ID: row.data.bankdeposit_ID,
      frombankaccount_ID: row.data.frombankaccount_ID,
      tobankaccount_ID: row.data.tobankaccount_ID,
      transaction_ID: row.data.transaction_ID,
      bankdeposit_CODE: row.data.bankdeposit_CODE,
      bankdeposit_NAME: row.data.bankdeposit_NAME,
      bankdeposit_AMOUNT: row.data.bankdeposit_AMOUNT,
      bankdeposit_DESC: row.data.bankdeposit_DESC,
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
