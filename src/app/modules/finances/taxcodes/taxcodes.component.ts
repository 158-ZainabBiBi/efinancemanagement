import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { RouterLinkWithHref } from '@angular/router';
import { TaxcodeComponent } from 'src/app/components/finances/taxcode/taxcode.component';
import { TaxcodeService } from 'src/app/components/finances/taxcode/taxcode.service';

declare var $: any;

@Component({
  selector: 'app-taxcodes',
  templateUrl: './taxcodes.component.html',
  styleUrls: ['./taxcodes.component.css']
})
export class TaxcodesComponent implements OnInit {
  @ViewChild("taxcodes") taxcodes: TaxcodeComponent;
  @ViewChild("addtaxcode") addtaxcode: TaxcodeComponent;
  @ViewChild("edittaxcode") edittaxcode: TaxcodeComponent;

  constructor(
    private taxcodeservice: TaxcodeService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  addNew() {
    this.addtaxcode.add();
    $("#add").modal("show");
  }
  
  edit(row) {
    this.edittaxcode.taxcode = {
      taxcode_ID: row.data.taxcode_ID,
      quickbook_ID:row.data.quickbook_ID,
      taxcode_TITLE:row.data.taxcode_TITLE,
      taxcode_DESC:row.data.taxcode_DESC,
      taxcode_PERCENTAGE:row.data.taxcode_PERCENTAGE,
      taxcode_CODE:row.data.taxcode_CODE,
      isactive: row.data.isactive
    };
    if (row.data.isactive=="Y") {
      this.edittaxcode.taxcode.isactive = true;
    } else {
      this.edittaxcode.taxcode.isactive = false;
    }
    $("#edit").modal("show");
  }
  
  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }

}



