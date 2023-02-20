import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { GeneralratetypeComponent } from '../../lookups/generalratetype/generalratetype.component';
import { CashflowratetypeComponent } from '../../lookups/cashflowratetype/cashflowratetype.component';
import { AccounttypeComponent } from '../accounttype/accounttype.component';
import { AccountService } from './account.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  @ViewChild("accounttype") accounttype: AccounttypeComponent;
  @ViewChild("addaccounttype") addaccounttype: AccounttypeComponent;
  @ViewChild("editaccounttype") editaccounttype: AccounttypeComponent;

  @ViewChild("cashflowratetype") cashflowratetype: CashflowratetypeComponent;
  @ViewChild("addcashflowratetype") addcashflowratetype: CashflowratetypeComponent;
  @ViewChild("editcashflowratetype") editcashflowratetype: CashflowratetypeComponent;

  @ViewChild("generalratetype") generalratetype: GeneralratetypeComponent;
  @ViewChild("addgeneralratetype") addgeneralratetype: GeneralratetypeComponent;
  @ViewChild("editgeneralratetype") editgeneralratetype: GeneralratetypeComponent;

  @Input()
  view: number = 1;
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  accounttypeID = null;
  @Input()
  accountID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();


  accounts = [];
  accountsAll = [];
  account = {
    account_ID: 0,
    accounttype_ID: 0,
    generalratetype_ID: 0,
    cashflowratetype_ID: 0,
    account_CODE: "",
    account_NAME: "",
    account_DATE: "",
    account_DESCRIPTION: "",
    bankaccount_NUMBER: "",
    accountparent_ID: null,
    isactive: true
  }

  constructor(
    private accountservice: AccountService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router : Router,
  ) { }

  ngOnInit(): void {
    this.accounts = JSON.parse(window.sessionStorage.getItem('accounts'));
    this.accountsAll = JSON.parse(window.sessionStorage.getItem('accountsAll'));
    if (this.view == 1 && this.disabled == false && this.accounts == null) {
      this.accountGet();
    } else if (this.view == 1 && this.disabled == true && this.accountsAll == null) {
      this.accountGetAll();
    } else if (this. view == 2 && this.accountsAll == null) {
      this.accountGetAll();
    }

    if (this.accountID != 0 && !this.accountID && Number(window.sessionStorage.getItem('account'))>0) {
      this.accountID = Number(window.sessionStorage.getItem('account'));
    }  else if (this. view == 22 && (this.accounttypeID != null )) {
      this.accountAdvancedSearchAll(this.accounttypeID);
    }

    if (this.view == 5 && this.accountID) {
      window.sessionStorage.setItem("account", this.accountID);
      this.accountGetOne(this.accountID);
    }

    if (this.view == 11 && this.accounttypeID && this.disabled == false) {
      this.accountAdvancedSearch(this.accounttypeID);
    } else if (this.view == 11 && this.accounttypeID && this.disabled == true) {
      this.accountAdvancedSearchAll(this.accounttypeID);

    } else if (this.view == 11|| this.view == 1) {
      this.accountID = null;
      this.accountsAll = null;
      this.accounts = null;
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
          onClick: this.accountGetAll.bind(this),
        },
      }
    );
  }

  onToolbarPreparingAdvanced(e) {
    console.log("onToolbarPreparingAdvanced");
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          width: 136,
          text: 'Refresh',
          onClick: this.accountAdvancedSearchAll.bind(this, this.accounttypeID),
        },
      }
    );
  }

  add() {
    this.account = {
      account_ID: 0,
      accounttype_ID: 0,
      generalratetype_ID: 0,
      cashflowratetype_ID: 0,
      account_CODE: "",
      account_NAME: "",
      account_DATE: "",
      account_DESCRIPTION: "",
      bankaccount_NUMBER: "",
      accountparent_ID: null,
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

  accountEdit(){
    this.disabled = false;
  }

  accountCancel() {
    this.disabled = true;
    if (this.account.account_ID==0) {
      this.router.navigate(["/home/accounts"], {});
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
    if ((this.view == 1 || this.view == 11)  && this.disabled == false) {
      this.accounts = response;
      window.sessionStorage.setItem("accounts", JSON.stringify(this.accounts));
    } else {
      this.accountsAll = response;
      window.sessionStorage.setItem("accountsAll", JSON.stringify(this.accountsAll));
    }
    this.cancel.next();
  }

  accountGet() {
    this.accountservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setAccounts(this.accountservice.getAllDetail(response));
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
        } else{
          this.setAccounts(this.accountservice.getAllDetail(response));
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
        } else{
          this.setAccount(this.accountservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  accountAdd(account) {
    account.isactive="Y";

    if(this.view == 5){
      account.accounttype_ID = this.accounttype.accounttypeID;
      account.cashflowratetype_ID = this.cashflowratetype.cashflowratetypeID;
      account.generalratetype_ID = this.generalratetype.generalratetypeID;
    }else{
      account.accounttype_ID = this.addaccounttype.accounttypeID;
      account.cashflowratetype_ID = this.addcashflowratetype.cashflowratetypeID;
      account.generalratetype_ID = this.addgeneralratetype.generalratetypeID;
    }

    this.accountservice.add(account).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.account_ID) {
          this.toastrservice.success("Success", "New account Added");
          this.accountGetAll();
          this.setAccount(response);
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
     if(this.view == 5){
     account.accounttype_ID = this.accounttype.accounttypeID;
     account.cashflowratetype_ID = this.cashflowratetype.cashflowratetypeID;
     account.generalratetype_ID = this.generalratetype.generalratetypeID;
    }else{
     account.accounttype_ID = this.editaccounttype.accounttypeID;
     account.cashflowratetype_ID = this.editcashflowratetype.cashflowratetypeID;
     account.generalratetype_ID = this.editgeneralratetype.generalratetypeID;
    }
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
          this.toastrservice.success("Success", " account Updated");
          if (this.disabled==true) {
            this.setAccount(response);
          } else {
            this.disabled = true;
          }
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
        } else{
          this.setAccounts(this.accountservice.getAllDetail(response));
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
        } else{
          this.setAccounts(this.accountservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  accountAdvancedSearch(accounttypeID) {
    this.accounttypeID = accounttypeID;
    var search = {
      accounttype_ID: accounttypeID
    }
    this.accountservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setAccounts(this.accountservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  accountAdvancedSearchAll(accounttypeID) {
    this.accounttypeID = accounttypeID;
    var search = {
      accounttype_ID: accounttypeID
    }
    this.accountservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setAccounts(this.accountservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
