import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { ExpensecategoryService } from './expensecategory.service';

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
  isreload: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  expensecategoryID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onExpenseCategoryChange = new EventEmitter();

  expensecategories = [];
  expensecategoriesAll = [];
  expensecategory = {
    expensecategory_ID: 0,
    expensecategory_CODE: null,
    expensecategory_NAME: null,
    expensecategory_DESCRIPTION: null,
    isactive: true
  }

  constructor(
    private expensecategoryservice: ExpensecategoryService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload) {
    if (window.sessionStorage.getItem('expensecategories') != null) {
      this.expensecategories = JSON.parse(window.sessionStorage.getItem('expensecategories'));
    }
    if (window.sessionStorage.getItem('expensecategoriesAll') != null) {
      this.expensecategoriesAll = JSON.parse(window.sessionStorage.getItem('expensecategoriesAll'));
    }
    if (this.expensecategoryID != 0 && !this.expensecategoryID && Number(window.sessionStorage.getItem('expensecategory')) > 0) {
      this.expensecategoryID = Number(window.sessionStorage.getItem('expensecategory'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.expensecategories == null || this.expensecategories.length == 0 || reload == true)) {
      this.expensecategories == null;
      this.expensecategoryGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.expensecategoriesAll == null || this.expensecategoriesAll.length == 0 || reload == true)) {
      this.expensecategoriesAll == null;
      this.expensecategoryGetAll();
    }

    var search = {}

    if (this.view >= 5 && this.view <= 6 && this.expensecategoryID) {
      window.sessionStorage.setItem("expensecategory", this.expensecategoryID);
      this.expensecategoryGetOne(this.expensecategoryID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.expensecategories == null || this.expensecategories.length == 0 || reload == true)) {
      this.expensecategories == null;
      this.expensecategoryAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.expensecategoriesAll == null || this.expensecategoriesAll.length == 0 || reload == true)) {
      this.expensecategoriesAll == null;
      this.expensecategoryAdvancedSearchAll(search);
    }
  }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          width: 136,
          text: 'Refresh',
          onClick: this.load.bind(this, true),
        },
      }
    );
  }

  add() {
    this.expensecategory = {
      expensecategory_ID: 0,
      expensecategory_CODE: null,
      expensecategory_NAME: null,
      expensecategory_DESCRIPTION: null,
      isactive: true
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

  expensecategoryEdit() {
    this.disabled = false;
  }

  expensecategoryCancel() {
    this.disabled = true;
    if (this.expensecategory.expensecategory_ID == 0) {
      this.router.navigate(["/home/expensecategories "], {});
    }
  }

  onChange(expensecategoryID) {
    for (var i = 0; i < this.expensecategoriesAll.length; i++) {
      if (this.expensecategoriesAll[i].expensecategory_ID == expensecategoryID) {
        this.onExpenseCategoryChange.next(this.expensecategoriesAll[i]);
        break;
      }
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

  setExpensecategories(response) {
    this.cancel.next();
    return response;
  }

  expensecategoryGet() {
    this.expensecategoryservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.expensecategories = this.setExpensecategories(this.expensecategoryservice.getAllDetail(response));
          window.sessionStorage.setItem("expensecategories", JSON.stringify(this.expensecategories));
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
        } else {
          this.expensecategoriesAll = this.setExpensecategories(this.expensecategoryservice.getAllDetail(response));
          window.sessionStorage.setItem("expensecategoriesAll", JSON.stringify(this.expensecategoriesAll));
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
        } else {
          this.setExpensecategory(this.expensecategoryservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  expensecategoryAdd(expensecategory) {
    expensecategory.isactive = "Y";

    this.expensecategoryservice.add(expensecategory).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.expensecategory_ID) {
          this.toastrservice.success("Success", "New Expense Category Added");
          this.refresh.next();
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
          this.toastrservice.success("Success", "Expense Category Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  expensecategoryUpdateAll(expensecategories) {
    this.expensecategoryservice.updateAll(expensecategories).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Expense Categories Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  expensecategorySearch(str) {
    var search = {
      search: str
    }
    this.expensecategoryservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.expensecategories = this.setExpensecategories(this.expensecategoryservice.getAllDetail(response));
          window.sessionStorage.setItem("expensecategories", JSON.stringify(this.expensecategories));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  expensecategorySearchAll(str) {
    var search = {
      search: str
    }
    this.expensecategoryservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.expensecategoriesAll = this.setExpensecategories(this.expensecategoryservice.getAllDetail(response));
          window.sessionStorage.setItem("expensecategoriesAll", JSON.stringify(this.expensecategoriesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  expensecategoryAdvancedSearch(search) {
    this.expensecategoryservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.expensecategories = this.setExpensecategories(this.expensecategoryservice.getAllDetail(response));
          window.sessionStorage.setItem("expensecategories", JSON.stringify(this.expensecategories));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  expensecategoryAdvancedSearchAll(search) {
    this.expensecategoryservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.expensecategoriesAll = this.setExpensecategories(this.expensecategoryservice.getAllDetail(response));
          window.sessionStorage.setItem("expensecategoriesAll", JSON.stringify(this.expensecategoriesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
