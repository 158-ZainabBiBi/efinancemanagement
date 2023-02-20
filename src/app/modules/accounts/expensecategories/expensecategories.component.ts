import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { RouterLinkWithHref } from '@angular/router';

import { ExpensecategoryComponent } from 'src/app/components/accounts/expensecategory/expensecategory.component';
import { ExpensecategoryService } from 'src/app/components/accounts/expensecategory/expensecategory.service';

declare var $: any;

@Component({
  selector: 'app-expensecategories',
  templateUrl: './expensecategories.component.html',
  styleUrls: ['./expensecategories.component.css']
})
export class ExpensecategoriesComponent implements OnInit {
  @ViewChild("expensecategories") expensecategories: ExpensecategoryComponent;
  @ViewChild("addexpensecategory") addexpensecategory: ExpensecategoryComponent;
  @ViewChild("editexpensecategory") editexpensecategory: ExpensecategoryComponent;

  constructor(
    private expensecategorieservice: ExpensecategoryService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  addNew() {
    this.addexpensecategory.add();
    $("#add").modal("show");
  }

  edit(row) {
    this.editexpensecategory.expensecategory = {
      expensecategory_ID: row.data.expensecategory_ID,
      expensecategory_CODE: row.data.expensecategory_CODE,
      expensecategory_NAME: row.data.expensecategory_NAME,
      expensecategory_DESCRIPTION: row.data.expensecategory_DESCRIPTION,
      isactive: row.data.isactive
    };
    if (row.data.isactive=="Y") {
      this.editexpensecategory.expensecategory.isactive = true;
    } else {
      this.editexpensecategory.expensecategory.isactive = false;
    }
    $("#edit").modal("show");
  }

  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }

}
