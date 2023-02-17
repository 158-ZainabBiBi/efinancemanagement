
import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { OnFailService } from '../../../services/on-fail.service';
import { CashflowratetypeComponent } from '../../lookups/cashflowratetype/cashflowratetype.component';
import { GeneralratetypeComponent } from '../../lookups/generalratetype/generalratetype.component';
import { AccounttypeComponent } from '../accounttype/accounttype.component';


import { AccountService } from './account.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
 
  @ViewChild("cashflowratetype") cashflowratetype: CashflowratetypeComponent;
  @ViewChild("addcashflowratetype") addcashflowratetype: CashflowratetypeComponent;
  @ViewChild("editcashflowratetype") editcashflowratetype: CashflowratetypeComponent;

  @ViewChild("generalratetype") generalratetype: GeneralratetypeComponent;
  @ViewChild("addgeneralratetype") addgeneralratetype: GeneralratetypeComponent;
  @ViewChild("editgeneralratetype") editgeneralratetype: GeneralratetypeComponent;

  @ViewChild("accounttype") accounttype: AccounttypeComponent;
  @ViewChild("addaccounttype") addaccounttype: AccounttypeComponent;
  @ViewChild("editaccounttype") editaccounttype: AccounttypeComponent;

  @Input()
  view: number = 1;
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  accountID = null;
  
  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();

  accounts = [];
  accountsAll = [];
  account = {
    account_ID: 0,
    accounttype_ID: null,
    accountparent_ID: null,
    generalratetype_ID: null,
    cashflowratetype_ID: null,
    account_DATE: "",
    account_CODE: "",
    account_NAME: "",
    account_DESCRIPTION: "",
    bankaccount_NUMBER: "",
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
    }  
    
    if (this.view == 5 && this.accountID) {
      window.sessionStorage.setItem("account", this.accountID);
      this.accountGetOne(this.accountID);
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

  add() {
    this.account = {
      account_ID: 0,
      accounttype_ID: null,
      accountparent_ID: null,
      generalratetype_ID: null,
      cashflowratetype_ID: null,
      account_DATE: "",
      account_CODE: "",
      account_NAME: "",
      account_DESCRIPTION: "",
      bankaccount_NUMBER: "",
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
      this.router.navigate(["/home/account"], {});
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
          this.setAccounts(response);
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
          this.setAccounts(response);
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
          this.setAccount(response);
         
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  accountAdd(account) {
    account.isactive="Y";
    if(this.view == 5){
      account.generalratetype_ID = this.generalratetype.generalratetypeID;
      account.accounttype_ID = this.accounttype.accounttypeID;
      account.cashflowratetype_ID = this.cashflowratetype.cashflowratetypeID;
     }else{ 
      account.generalratetype_ID = this.addgeneralratetype.generalratetypeID;
      account.accounttype_ID = this.addaccounttype.accounttypeID;
      account.cashflowratetype_ID = this.addcashflowratetype.cashflowratetypeID;
     }
    this.accountservice.add(account).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.account_ID) {
          this.toastrservice.success("Success", "New Account Added");
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
      account.generalratetype_ID = this.generalratetype.generalratetypeID;
      account.accounttype_ID = this.accounttype.accounttypeID;
      account.cashflowratetype_ID = this.cashflowratetype.cashflowratetypeID;
     }else{ 
      account.generalratetype_ID = this.editgeneralratetype.generalratetypeID;
      account.accounttype_ID = this.editaccounttype.accounttypeID;
      account.cashflowratetype_ID = this.editcashflowratetype.cashflowratetypeID;
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
          this.toastrservice.success("Success", " Account Updated");
          if (this.disabled==true) {
            this.setAccount(response);
            this.accountGetAll();
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

  // accountSearch(str) {
  //   var search = {
  //     search: str
  //   }
  //   this.accountservice.search(search).subscribe(response => {
  //     if (response) {
  //       if (response.error && response.status) {
  //         this.toastrservice.warning("Message", " " + response.message);
  //       } else{
  //         this.setAccounts(this.accountservice.getAllDetail(response));
  //       }
  //     }
  //   }, error => {
  //     this.onfailservice.onFail(error);
  //   })
  // }

  // accountSearchAll(str) {
  //   var search = {
  //     search: str
  //   }
  //   this.accountservice.searchAll(search).subscribe(response => {
  //     if (response) {
  //       if (response.error && response.status) {
  //         this.toastrservice.warning("Message", " " + response.message);
  //       } else{
  //         this.setAccounts(this.accountservice.getAllDetail(response));
  //       }
  //     }
  //   }, error => {
  //     this.onfailservice.onFail(error);
  //   })
  // }

  // accountAdvancedSearch(accounttypeID) {
  //   this.accounttypeID = accounttypeID;
  //   var search = {
  //     accounttype_ID: accounttypeID
  //   }
  //   this.accountservice.advancedSearch(search).subscribe(response => {
  //     if (response) {
  //       if (response.error && response.status) {
  //         this.toastrservice.warning("Message", " " + response.message);
  //       } else{
  //         this.setAccounts(this.accountservice.getAllDetail(response));
  //       }
  //     }
  //   }, error => {
  //     this.onfailservice.onFail(error);
  //   })
  // }

  // accountAdvancedSearchAll(accounttypeID) {
  //   this.accounttypeID = accounttypeID;
  //   var search = {
  //     accounttype_ID: accounttypeID
  //   }
  //   this.accountservice.advancedSearchAll(search).subscribe(response => {
  //     if (response) {
  //       if (response.error && response.status) {
  //         this.toastrservice.warning("Message", " " + response.message);
  //       } else{
  //         this.setAccounts(this.accountservice.getAllDetail(response));
  //       }
  //     }
  //   }, error => {
  //     this.onfailservice.onFail(error);
  //   })
  // }
}

