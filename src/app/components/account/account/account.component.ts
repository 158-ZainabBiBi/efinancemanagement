import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { AccountService } from './account.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

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
  accountID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onAccountChange = new EventEmitter();

  accounts = [];
  accountsAll = [];
  account = {
    account_ID: 0,
    account_CODE: null,
    account_NAME: null,
    account_NUMBER: null,
    account_BIC: null,
    account_IBAN: null,
    isactive: true
  }

  constructor(
    private accountservice: AccountService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload) {
    if (window.sessionStorage.getItem('accounts') != null) {
      this.accounts = JSON.parse(window.sessionStorage.getItem('accounts'));
    }
    if (window.sessionStorage.getItem('accountsAll') != null) {
      this.accountsAll = JSON.parse(window.sessionStorage.getItem('accountsAll'));
    }
    if (this.accountID != 0 && !this.accountID && Number(window.sessionStorage.getItem('account')) > 0) {
      this.accountID = Number(window.sessionStorage.getItem('account'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.accounts == null || this.accounts.length == 0 || reload == true)) {
      this.accounts == null;
      this.accountGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.accountsAll == null || this.accountsAll.length == 0 || reload == true)) {
      this.accountsAll == null;
      this.accountGetAll();
    }

    var search = {}

    if (this.view >= 5 && this.view <= 6 && this.accountID) {
      window.sessionStorage.setItem("account", this.accountID);
      this.accountGetOne(this.accountID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.accounts == null || this.accounts.length == 0 || reload == true)) {
      this.accounts == null;
      this.accountAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.accountsAll == null || this.accountsAll.length == 0 || reload == true)) {
      this.accountsAll == null;
      this.accountAdvancedSearchAll(search);
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
    this.account = {
      account_ID: 0,
      account_CODE: null,
      account_NAME: null,
      account_NUMBER: null,
      account_BIC: null,
      account_IBAN: null,
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

  accountEdit() {
    this.disabled = false;
  }

  accountCancel() {
    this.disabled = true;
    if (this.account.account_ID == 0) {
      this.router.navigate(["/home/accounts "], {});
    }
  }

  onChange(accountID) {
    for (var i = 0; i < this.accountsAll.length; i++) {
      if (this.accountsAll[i].account_ID == accountID) {
        this.onAccountChange.next(this.accountsAll[i]);
        break;
      }
    }
  }

  setAccount(response) {
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.account = response;
  }

  setAccounts(response) {
    this.cancel.next();
    return response;
  }

  accountGet() {
    this.accountservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.accounts = this.setAccounts(this.accountservice.getAllDetail(response));
          window.sessionStorage.setItem("accounts", JSON.stringify(this.accounts));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  accountGetAll() {
    this.accountservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.accountsAll = this.setAccounts(this.accountservice.getAllDetail(response));
          window.sessionStorage.setItem("accountsAll", JSON.stringify(this.accountsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  accountGetOne(id) {
    this.disabled = true;
    this.accountservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setAccount(this.accountservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  accountAdd(account) {
    account.isactive = "Y";

    this.accountservice.add(account).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.account_ID) {
          this.toastrservice.success("Success", "New Account Added");
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

  accountUpdate(account) {

    if (account.isactive == true) {
      account.isactive = "Y";
    } else {
      account.isactive = "N";
    }
    this.accountservice.update(account, account.account_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.account_ID) {
          this.toastrservice.success("Success", "Account Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  accountUpdateAll(accounts) {
    this.accountservice.updateAll(accounts).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Accounts Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  accountSearch(str) {
    var search = {
      search: str
    }
    this.accountservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.accounts = this.setAccounts(this.accountservice.getAllDetail(response));
          window.sessionStorage.setItem("accounts", JSON.stringify(this.accounts));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  accountSearchAll(str) {
    var search = {
      search: str
    }
    this.accountservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.accountsAll = this.setAccounts(this.accountservice.getAllDetail(response));
          window.sessionStorage.setItem("accountsAll", JSON.stringify(this.accountsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  accountAdvancedSearch(search) {

    this.accountservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.accounts = this.setAccounts(this.accountservice.getAllDetail(response));
          window.sessionStorage.setItem("accounts", JSON.stringify(this.accounts));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  accountAdvancedSearchAll(search) {

    this.accountservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.accountsAll = this.setAccounts(this.accountservice.getAllDetail(response));
          window.sessionStorage.setItem("accountsAll", JSON.stringify(this.accountsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
