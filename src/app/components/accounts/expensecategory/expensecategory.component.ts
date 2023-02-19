import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { ExpensecategoryService } from '../expensecategory/expensecategory.service';

@Component({
  selector: 'app-expensecategory',
  templateUrl: './expensecategory.component.html',
  styleUrls: ['./expensecategory.component.css']
})
export class ExpensecategoryComponent implements OnInit {

  @Input()
  view: number = 1;
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  expensecategoryID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();

  expensecategories = [];
  expensecategoriesAll = [];
  expensecategory = {
      expensecategory_ID: 0,
      expensecategory_CODE: "",
      expensecategory_NAME: "",
      expensecategory_DESCRIPTION: "",
      isactive:true,
  }

  constructor(
    private expensecategoryservice: ExpensecategoryService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router : Router,
  ) { }

  ngOnInit(): void {
    this.expensecategories = JSON.parse(window.sessionStorage.getItem('expensecategories'));
    this.expensecategoriesAll = JSON.parse(window.sessionStorage.getItem('expensecategoriesAll'));
    if (this.view == 1 && this.disabled == false && this.expensecategories == null) {
      this.expensecategoryGet();
    } else if (this.view == 1 && this.disabled == true && this.expensecategoriesAll == null) {
      this.expensecategoryGetAll();
    } else if (this. view == 2 && this.expensecategoriesAll == null) {
      this.expensecategoryGetAll();
    }

    if (this.expensecategoryID != 0 && !this.expensecategoryID && Number(window.sessionStorage.getItem('expensecategory'))>0) {
      this.expensecategoryID = Number(window.sessionStorage.getItem('expensecategory'));
    }

    if (this.view == 5 && this.expensecategoryID) {
      window.sessionStorage.setItem("expensecategory", this.expensecategoryID);
      this.expensecategoryGetOne(this.expensecategoryID);
    }
    // if (this.expensecategoryID == 0) {
    //   this.universityDisabled = false;
    //   this.expensecategoryID = null;
    // }

  }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          width: 136,
          text: 'Refresh',
          onClick: this.expensecategoryGetAll.bind(this),
        },
      }
    );
  }

  add() {
    this.expensecategory = {
      expensecategory_ID: 0,
      expensecategory_CODE: "",
      expensecategory_NAME: "",
      expensecategory_DESCRIPTION: "",
      isactive: true,
    };
  }

  update(row) {
    this.edit.next(row);
  }

  editView() {
    this.disabled = false;
  }

  showView(row) {
    this.show.next(row);
  }

  cancelView() {
    this.cancel.next();
  }

  expensecategoryEdit(){
    this.disabled = false;
  }

  expensecategoryCancel() {
    this.disabled = true;
    if (this.expensecategory.expensecategory_ID==0) {
      this.router.navigate(["/home/expensecategory"], {});
    }
  }

  setExpensecategory(response) {
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.expensecategory = response;
  }

  setExpensecategorys(response) {
    if ((this.view == 1 || this.view == 11)  && this.disabled == false) {
      this.expensecategories = response;
      window.sessionStorage.setItem("expensecategories", JSON.stringify(this.expensecategories));
    } else {
      this.expensecategoriesAll = response;
      window.sessionStorage.setItem("expensecategoriesAll", JSON.stringify(this.expensecategoriesAll));
    }
    this.cancel.next();
  }

  expensecategoryGet() {
    this.expensecategoryservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setExpensecategorys(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  expensecategoryGetAll() {
    this.expensecategoryservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setExpensecategorys(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  expensecategoryGetOne(id) {
    this.disabled = true;
    this.expensecategoryservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setExpensecategory(response);

        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  expensecategoryAdd(expensecategory) {
    expensecategory.isactive="Y";

    this.expensecategoryservice.add(expensecategory).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.expensecategory_ID) {
          this.toastrservice.success("Success", "New Expensecategory Added");
          this.expensecategoryGetAll();
          this.setExpensecategory(response);
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  expensecategoryUpdate(expensecategory) {
    if (expensecategory.isactive == true) {
      expensecategory.isactive = "Y";
    } else {
      expensecategory.isactive = "N";
    }
    this.expensecategoryservice.update(expensecategory, expensecategory.expensecategory_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.expensecategory_ID) {
          this.toastrservice.success("Success", " Expensecategory Updated");
          this.expensecategoryGetAll();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }
}
