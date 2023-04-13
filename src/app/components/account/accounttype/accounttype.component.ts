import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { AccounttypeService } from './accounttype.service';

@Component({
  selector: 'app-accounttype',
  templateUrl: './accounttype.component.html',
  styleUrls: ['./accounttype.component.css']
})
export class AccounttypeComponent implements OnInit {

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
  accounttypeID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onAccountTypeChange = new EventEmitter();

  accounttypes = [];
  accounttypesAll = [];
  accounttype = {
    accounttype_ID: 0,
    accounttype_CODE: null,
    accounttype_NAME: null,
    accounttype_DESCRIPTION: null,
    isactive: true
  }

  constructor(
    private accounttypeservice: AccounttypeService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload) {
    if (window.sessionStorage.getItem('accounttypes') != null) {
      this.accounttypes = JSON.parse(window.sessionStorage.getItem('accounttypes'));
    }
    if (window.sessionStorage.getItem('accounttypesAll') != null) {
      this.accounttypesAll = JSON.parse(window.sessionStorage.getItem('accounttypesAll'));
    }
    if (this.accounttypeID != 0 && !this.accounttypeID && Number(window.sessionStorage.getItem('accounttype')) > 0) {
      this.accounttypeID = Number(window.sessionStorage.getItem('accounttype'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.accounttypes == null || this.accounttypes.length == 0 || reload == true)) {
      this.accounttypes == null;
      this.accounttypeGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.accounttypesAll == null || this.accounttypesAll.length == 0 || reload == true)) {
      this.accounttypesAll == null;
      this.accounttypeGetAll();
    }

    var search = {}

    if (this.view >= 5 && this.view <= 6 && this.accounttypeID) {
      window.sessionStorage.setItem("accounttype", this.accounttypeID);
      this.accounttypeGetOne(this.accounttypeID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.accounttypes == null || this.accounttypes.length == 0 || reload == true)) {
      this.accounttypes == null;
      this.accounttypeAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.accounttypesAll == null || this.accounttypesAll.length == 0 || reload == true)) {
      this.accounttypesAll == null;
      this.accounttypeAdvancedSearchAll(search);
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
    this.accounttype = {
      accounttype_ID: 0,
      accounttype_CODE: null,
      accounttype_NAME: null,
      accounttype_DESCRIPTION: null,
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

  accounttypeEdit() {
    this.disabled = false;
  }

  accounttypeCancel() {
    this.disabled = true;
    if (this.accounttype.accounttype_ID == 0) {
      this.router.navigate(["/home/accounttypes "], {});
    }
  }

  onChange(accounttypeID) {
    for (var i = 0; i < this.accounttypesAll.length; i++) {
      if (this.accounttypesAll[i].accounttype_ID == accounttypeID) {
        this.onAccountTypeChange.next(this.accounttypesAll[i]);
        break;
      }
    }
  }

  setAccounttype(response) {
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.accounttype = response;
  }

  setAccounttypes(response) {
    this.cancel.next();
    return response;
  }

  accounttypeGet() {
    this.accounttypeservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.accounttypes = this.setAccounttypes(this.accounttypeservice.getAllDetail(response));
          window.sessionStorage.setItem("accounttypes", JSON.stringify(this.accounttypes));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  accounttypeGetAll() {
    this.accounttypeservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.accounttypesAll = this.setAccounttypes(this.accounttypeservice.getAllDetail(response));
          window.sessionStorage.setItem("accounttypesAll", JSON.stringify(this.accounttypesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  accounttypeGetOne(id) {
    this.disabled = true;
    this.accounttypeservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setAccounttype(this.accounttypeservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  accounttypeAdd(accounttype) {
    accounttype.isactive = "Y";

    this.accounttypeservice.add(accounttype).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.accounttype_ID) {
          this.toastrservice.success("Success", "New Account Type Added");
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

  accounttypeUpdate(accounttype) {

    if (accounttype.isactive == true) {
      accounttype.isactive = "Y";
    } else {
      accounttype.isactive = "N";
    }
    this.accounttypeservice.update(accounttype, accounttype.accounttype_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.accounttype_ID) {
          this.toastrservice.success("Success", "Account Type Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  accounttypeUpdateAll(accounttypes) {
    this.accounttypeservice.updateAll(accounttypes).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Account Types Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  accounttypeSearch(str) {
    var search = {
      search: str
    }
    this.accounttypeservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.accounttypes = this.setAccounttypes(this.accounttypeservice.getAllDetail(response));
          window.sessionStorage.setItem("accounttypes", JSON.stringify(this.accounttypes));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  accounttypeSearchAll(str) {
    var search = {
      search: str
    }
    this.accounttypeservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.accounttypesAll = this.setAccounttypes(this.accounttypeservice.getAllDetail(response));
          window.sessionStorage.setItem("accounttypesAll", JSON.stringify(this.accounttypesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  accounttypeAdvancedSearch(search) {
    this.accounttypeservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.accounttypes = this.setAccounttypes(this.accounttypeservice.getAllDetail(response));
          window.sessionStorage.setItem("accounttypes", JSON.stringify(this.accounttypes));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  accounttypeAdvancedSearchAll(search) {
    this.accounttypeservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.accounttypesAll = this.setAccounttypes(this.accounttypeservice.getAllDetail(response));
          window.sessionStorage.setItem("accounttypesAll", JSON.stringify(this.accounttypesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
