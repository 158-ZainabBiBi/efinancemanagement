import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { ExpensecategoryComponent } from '../../../components/accounts/expensecategory/expensecategory.component'
import { ExpensecategoryService } from '../../../components/accounts/expensecategory/expensecategory.service';
import { Router, RouterLinkWithHref } from '@angular/router';

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
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  show(row) {
    this.router.navigate(["/home/expensecategory"], { queryParams: { expensecategory: row.data.expensecategory_ID } });
  }

  view() {
  }

  addNew() {
    this.router.navigate(["/home/expensecategory"], {});
  }

  edit(row) {
    this.editexpensecategory.expensecategory = {
      expensecategory_ID: row.data.expensecategory_ID,
      expensecategory_CODE: "",
      expensecategory_NAME: "",
      expensecategory_DESCRIPTION: "",
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
