import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { RecievereturnauthComponent } from '../../../components/accounts/recievereturnauth/recievereturnauth.component'
import { RecievereturnauthService } from '../../../components/accounts/recievereturnauth/recievereturnauth.service';
import { Router, RouterLinkWithHref } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-recievereturnauths',
  templateUrl: './recievereturnauths.component.html',
  styleUrls: ['./recievereturnauths.component.css']
})
export class RecievereturnauthsComponent implements OnInit {
  @ViewChild("recievereturnauths") recievereturnauths: RecievereturnauthComponent;
  @ViewChild("addrecievereturnauth") addrecievereturnauth: RecievereturnauthComponent;
  @ViewChild("editrecievereturnauth") editrecievereturnauth: RecievereturnauthComponent;

  constructor(
    private recievereturnauthservice: RecievereturnauthService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  show(row) {
    this.router.navigate(["/home/recievereturnauth"], { queryParams: { recievereturnauth: row.data.recievereturnauth_ID } });
  }

  view() {
  }

  addNew() {
    this.router.navigate(["/home/recievereturnauth"], {});
  }

  edit(row) {
    this.editrecievereturnauth.recievereturnauth = {
      recievereturnauth_ID: row.data.recievereturnauth_ID,
      returnauth_ID: row.data.returnauth_ID,
      currency_ID: row.data.currency_ID,
      recievereturnauth_AMOUNT: row.data.recievereturnauth_AMOUNT,
      recievereturnauth_DATE: row.data.recievereturnauth_DATE,
      isapproved: row.data.isapproved,
      isactive: row.data.isactive
    };
    if (row.data.isactive=="Y") {
      this.editrecievereturnauth.recievereturnauth.isactive = true;
    } else {
      this.editrecievereturnauth.recievereturnauth.isactive = false;
    }
    $("#edit").modal("show");
  }

  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }
}
