import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { BanktransferComponent } from 'src/app/components/account/banktransfer/banktransfer.component';
import { BanktransferService } from 'src/app/components/account/banktransfer/banktransfer.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-banktransfers',
  templateUrl: './banktransfers.component.html',
  styleUrls: ['./banktransfers.component.css']
})
export class BanktransfersComponent implements OnInit {
  @ViewChild("banktransfers") banktransfers: BanktransferComponent;
  @ViewChild("addbanktransfer") addbanktransfer: BanktransferComponent;
  @ViewChild("editbanktransfer") editbanktransfer: BanktransferComponent;

  constructor(
    private banktransferservice: BanktransferService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  refresh() {
    this.banktransfers.ngOnInit();
    this.cancel();
  }

  show(row) {
    this.router.navigate(["/home/banktransfer"], { queryParams: { banktransfer: row.data.banktransfer_ID } });
  }

  addNew() {
    this.addbanktransfer.add();
    $("#add").modal("show");
  }

  edit(row) {
    this.editbanktransfer.banktransfer = {
      banktransfer_ID: row.data.banktransfer_ID,
      frombankaccount_ID: row.data.frombankaccount_ID,
      tobankaccount_ID: row.data.tobankaccount_ID,
      banktransfer_CODE: row.data.banktransfer_CODE,
      banktransfer_DATE: row.data.banktransfer_DATE,
      banktransfer_NAME: row.data.banktransfer_NAME,
      banktransfer_AMOUNT: row.data.banktransfer_AMOUNT,
      banktransfer_DESC: row.data.banktransfer_DESC,
      isactive: row.data.isactive
    };

    if (row.data.isactive == "Y") {
      this.editbanktransfer.banktransfer.isactive = true;
    } else {
      this.editbanktransfer.banktransfer.isactive = false;
    }
    $("#edit").modal("show");
  }

  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }

}
