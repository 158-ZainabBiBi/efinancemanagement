import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { Router } from '@angular/router';
import { AccountclassificationComponent } from 'src/app/components/account/accountclassification/accountclassification.component';
import { AccountclassificationService } from 'src/app/components/account/accountclassification/accountclassification.service';

declare var $: any;

@Component({
  selector: 'app-accountclassifications',
  templateUrl: './accountclassifications.component.html',
  styleUrls: ['./accountclassifications.component.css']
})
export class AccountclassificationsComponent implements OnInit {
  @ViewChild("accountclassifications") accountclassifications: AccountclassificationComponent;
  @ViewChild("addaccountclassification") addaccountclassification: AccountclassificationComponent;
  @ViewChild("editaccountclassification") editaccountclassification: AccountclassificationComponent;

  constructor(
    private accountclassificationservice: AccountclassificationService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  refresh() {
    this.accountclassifications.load(true);
    this.cancel();
  }

  show(row) {
    this.router.navigate(["/home/accountclassification"], { queryParams: { accountclassification: row.data.accountclassification_ID } });
  }

  addNew() {
    this.addaccountclassification.add();
    $("#add").modal("show");
  }

  edit(row) {
    this.editaccountclassification.accountclassification = {
      accountclassification_ID: row.data.accountclassification_ID,
      accountclassification_CODE: row.data.accountclassification_CODE,
      accountclassification_NAME: row.data.accountclassification_NAME,
      accountclassification_DESC: row.data.accountclassification_DESC,
      accounttype_ID: row.data.accounttype_ID,
      isactive: row.data.isactive
    };

    if (row.data.isactive == "Y") {
      this.editaccountclassification.accountclassification.isactive = true;
    } else {
      this.editaccountclassification.accountclassification.isactive = false;
    }
    $("#edit").modal("show");
  }

  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }

}
