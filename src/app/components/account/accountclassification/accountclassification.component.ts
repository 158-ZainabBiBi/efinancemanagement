import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { AccountclassificationService } from './accountclassification.service';
import { AccounttypeComponent } from '../../lookup/account/accounttype/accounttype.component';

@Component({
  selector: 'app-accountclassification',
  templateUrl: './accountclassification.component.html',
  styleUrls: ['./accountclassification.component.css']
})
export class AccountclassificationComponent implements OnInit {
  @ViewChild("accounttype") accounttype: AccounttypeComponent;

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
  accountclassificationID = null;
  @Input()
  accounttypeID = null;
  @Input()
  accounttypeCode = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onAccountclassificationChange = new EventEmitter();

  accountclassifications = [];
  accountclassificationsAll = [];
  accountclassification = {
    accountclassification_ID: 0,
    accountclassification_CODE: null,
    accountclassification_NAME: null,
    accountclassification_DESC: null,
    accounttype_ID: null,
    isactive: true
  }

  constructor(
    private accountclassificationservice: AccountclassificationService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload) {
    if (window.sessionStorage.getItem('accountclassifications') != null) {
      this.accountclassifications = JSON.parse(window.sessionStorage.getItem('accountclassifications'));
    }
    if (window.sessionStorage.getItem('accountclassificationsAll') != null) {
      this.accountclassificationsAll = JSON.parse(window.sessionStorage.getItem('accountclassificationsAll'));
    }
    if (this.accountclassificationID != 0 && !this.accountclassificationID && Number(window.sessionStorage.getItem('accountclassification')) > 0) {
      this.accountclassificationID = Number(window.sessionStorage.getItem('accountclassification'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.accountclassifications == null || this.accountclassifications.length == 0 || reload == true)) {
      this.accountclassifications == null;
      this.accountclassificationGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.accountclassificationsAll == null || this.accountclassificationsAll.length == 0 || reload == true)) {
      this.accountclassificationsAll == null;
      this.accountclassificationGetAll();
    }

    var search = {
      accounttype_ID: this.accounttypeID,
      accounttype_CODE: this.accounttypeCode
    }

    if (this.view >= 5 && this.view <= 6 && this.accountclassificationID) {
      window.sessionStorage.setItem("accountclassification", this.accountclassificationID);
      this.accountclassificationGetOne(this.accountclassificationID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.accountclassifications == null || this.accountclassifications.length == 0 || reload == true)) {
      this.accountclassifications == null;
      this.accountclassificationAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.accountclassificationsAll == null || this.accountclassificationsAll.length == 0 || reload == true)) {
      this.accountclassificationsAll == null;
      this.accountclassificationAdvancedSearchAll(search);
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
    this.accountclassification = {
      accountclassification_ID: 0,
      accountclassification_CODE: null,
      accountclassification_NAME: null,
      accountclassification_DESC: null,
      accounttype_ID: null,
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

  accountclassificationEdit() {
    this.disabled = false;
  }

  accountclassificationCancel() {
    this.disabled = true;
    if (this.accountclassification.accountclassification_ID == 0) {
      this.router.navigate(["/home/accountclassifications"], {});
    }
  }

  onChange(accountclassificationID) {
    for (var i = 0; i < this.accountclassificationsAll.length; i++) {
      if (this.accountclassificationsAll[i].accountclassification_ID == accountclassificationID) {
        this.onAccountclassificationChange.next(this.accountclassificationsAll[i]);
        break;
      }
    }
  }

  setAccountclassification(response) {
    this.accountclassificationID = response.accountclassification_ID;
    this.accounttypeID = response.accounttype_ID;

    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.accountclassification = response;
  }

  setAccountclassifications(response) {
    this.cancel.next();
    return response;
  }

  accountclassificationGet() {
    this.accountclassificationservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.accountclassifications = this.setAccountclassifications(this.accountclassificationservice.getAllDetail(response));
          window.sessionStorage.setItem("accountclassifications", JSON.stringify(this.accountclassifications));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  accountclassificationGetAll() {
    this.accountclassificationservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.accountclassificationsAll = this.setAccountclassifications(this.accountclassificationservice.getAllDetail(response));
          window.sessionStorage.setItem("accountclassificationsAll", JSON.stringify(this.accountclassificationsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  accountclassificationGetOne(id) {
    this.disabled = true;
    this.accountclassificationservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setAccountclassification(this.accountclassificationservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  accountclassificationAdd(accountclassification) {
    accountclassification.accounttype_ID = this.accounttype.accounttypeID;

    accountclassification.isactive = "Y";
    this.accountclassificationservice.add(accountclassification).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.accountclassification_ID) {
          this.toastrservice.success("Success", "New Account Classification Added");
          this.setAccountclassification(this.accountclassificationservice.getDetail(response));
          this.refresh.next();
          this.accountclassificationGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  accountclassificationUpdate(accountclassification) {
    accountclassification.accounttype_ID = this.accounttype.accounttypeID;

    if (accountclassification.isactive == true) {
      accountclassification.isactive = "Y";
    } else {
      accountclassification.isactive = "N";
    }
    this.accountclassificationservice.update(accountclassification, accountclassification.accountclassification_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.accountclassification_ID) {
          this.toastrservice.success("Success", "Account Classification Updated");
          this.setAccountclassification(this.accountclassificationservice.getDetail(response));
          this.refresh.next();
          this.accountclassificationGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  accountclassificationUpdateAll(accountclassifications) {
    this.accountclassificationservice.updateAll(accountclassifications).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Account Classifications Updated");
          this.setAccountclassification(this.accountclassificationservice.getDetail(response));
          this.refresh.next();
          this.accountclassificationGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  accountclassificationSearch(str) {
    var search = {
      search: str
    }
    this.accountclassificationservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.accountclassifications = this.setAccountclassifications(this.accountclassificationservice.getAllDetail(response));
          window.sessionStorage.setItem("accountclassifications", JSON.stringify(this.accountclassifications));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  accountclassificationSearchAll(str) {
    var search = {
      search: str
    }
    this.accountclassificationservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.accountclassificationsAll = this.setAccountclassifications(this.accountclassificationservice.getAllDetail(response));
          window.sessionStorage.setItem("accountclassificationsAll", JSON.stringify(this.accountclassificationsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  accountclassificationAdvancedSearch(search) {
    this.accounttypeID = search.accounttype_ID;
    this.accounttypeCode = search.accounttype_CODE;

    this.accountclassificationservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.accountclassifications = this.setAccountclassifications(this.accountclassificationservice.getAllDetail(response));
          window.sessionStorage.setItem("accountclassifications", JSON.stringify(this.accountclassifications));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  accountclassificationAdvancedSearchAll(search) {
    this.accounttypeID = search.accounttype_ID;
    this.accounttypeCode = search.accounttype_CODE;

    this.accountclassificationservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.accountclassificationsAll = this.setAccountclassifications(this.accountclassificationservice.getAllDetail(response));
          window.sessionStorage.setItem("accountclassificationsAll", JSON.stringify(this.accountclassificationsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
