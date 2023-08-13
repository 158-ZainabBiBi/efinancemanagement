import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { BankaccountService } from './bankaccount.service';
import { CustomerComponent } from '../../customer/customer/customer.component';
import { PaymentmethodComponent } from '../../lookup/finance/paymentmethod/paymentmethod.component';
import { BankaccounttypeComponent } from '../../lookup/account/bankaccounttype/bankaccounttype.component';

@Component({
  selector: 'app-bankaccount',
  templateUrl: './bankaccount.component.html',
  styleUrls: ['./bankaccount.component.css']
})
export class BankaccountComponent implements OnInit {
  @ViewChild("bankaccounttype") bankaccounttype: BankaccounttypeComponent;
  @ViewChild("paymentmethod") paymentmethod: PaymentmethodComponent;
  @ViewChild("customer") customer: CustomerComponent;

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
  bankaccountID = null;
  @Input()
  customerID = null;
  @Input()
  paymentmethodID = null;
  @Input()
  paymentmethodCode = null;
  @Input()
  bankaccounttypeID = null;
  @Input()
  bankaccounttypeCode = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onBankAccountChange = new EventEmitter();

  bankaccounts = [];
  bankaccountsAll = [];
  bankaccount = {
    bankaccount_ID: 0,
    bankaccounttype_ID: null,
    paymentmethod_ID: null,
    customer_ID: null,

    bankaccount_CODE: null,
    bankaccount_DATE: null,
    bankaccount_BALANCE: null,
    bankaccount_NAME: null,
    bankaccount_DESC: null,
    bankaccount_NUMBER: null,
    bankaccount_BIC: null,
    bankaccount_IBAN: null,

    isactive: true,
  }

  constructor(
    private bankaccountservice: BankaccountService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload) {
    if (window.sessionStorage.getItem('bankaccounts') != null) {
      this.bankaccounts = JSON.parse(window.sessionStorage.getItem('bankaccounts'));
    }
    if (window.sessionStorage.getItem('bankaccountsAll') != null) {
      this.bankaccountsAll = JSON.parse(window.sessionStorage.getItem('bankaccountsAll'));
    }
    if (this.bankaccountID != 0 && !this.bankaccountID && Number(window.sessionStorage.getItem('bankaccount')) > 0) {
      this.bankaccountID = Number(window.sessionStorage.getItem('bankaccount'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.bankaccounts == null || this.bankaccounts.length == 0 || reload == true)) {
      this.bankaccounts == null;
      this.bankaccountGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.bankaccountsAll == null || this.bankaccountsAll.length == 0 || reload == true)) {
      this.bankaccountsAll == null;
      this.bankaccountGetAll();
    }

    var search = {
      customer_ID: this.customerID,

      paymentmethod_ID: this.paymentmethodID,
      paymentmethod_CODE: this.paymentmethodCode,
      bankaccounttype_ID: this.bankaccounttypeID,
      bankaccounttype_CODE: this.bankaccounttypeCode,
    }

    if (this.view >= 5 && this.view <= 6 && this.bankaccountID) {
      window.sessionStorage.setItem("bankaccount", this.bankaccountID);
      this.bankaccountGetOne(this.bankaccountID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.bankaccounts == null || this.bankaccounts.length == 0 || reload == true)) {
      this.bankaccounts == null;
      this.bankaccountAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.bankaccountsAll == null || this.bankaccountsAll.length == 0 || reload == true)) {
      this.bankaccountsAll == null;
      this.bankaccountAdvancedSearchAll(search);
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
      },
    );
  }

  add() {
    this.bankaccount = {
      bankaccount_ID: 0,
      bankaccounttype_ID: null,
      paymentmethod_ID: null,
      customer_ID: null,

      bankaccount_CODE: null,
      bankaccount_DATE: null,
      bankaccount_BALANCE: null,
      bankaccount_NAME: null,
      bankaccount_DESC: null,
      bankaccount_NUMBER: null,
      bankaccount_BIC: null,
      bankaccount_IBAN: null,

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

  bankaccountEdit() {
    this.disabled = false;
  }

  bankaccountCancel() {
    this.disabled = true;
    if (this.bankaccount.bankaccount_ID == 0) {
      this.router.navigate(["/home/bankaccounts"], {});
    }
  }

  onChange(bankaccountID) {
    for (var i = 0; i < this.bankaccountsAll.length; i++) {
      if (this.bankaccountsAll[i].bankaccount_ID == bankaccountID) {
        this.onBankAccountChange.next(this.bankaccountsAll[i]);
        break;
      }
    }
  }

  setBankaccount(response) {
    this.bankaccounttypeID = response.bankaccounttype_ID;
    this.paymentmethodID = response.paymentmethod_ID;
    this.customerID = response.customer_ID;
    this.bankaccountID = response.bankaccount_ID;

    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.bankaccount = response;
  }

  setBankaccounts(response) {
    this.cancel.next();
    return response;
  }

  bankaccountGet() {
    this.bankaccountservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.bankaccounts = this.setBankaccounts(this.bankaccountservice.getAllDetail(response));
          window.sessionStorage.setItem("bankaccounts", JSON.stringify(this.bankaccounts));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  bankaccountGetAll() {
    this.bankaccountservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.bankaccountsAll = this.setBankaccounts(this.bankaccountservice.getAllDetail(response));
          window.sessionStorage.setItem("bankaccountsAll", JSON.stringify(this.bankaccountsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  bankaccountGetOne(id) {
    this.disabled = true;
    this.bankaccountservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setBankaccount(this.bankaccountservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  bankaccountAdd(bankaccount) {
    bankaccount.bankaccounttype_ID = this.bankaccounttype.bankaccounttypeID;
    bankaccount.customer_ID = this.customer.customerID;
    bankaccount.paymentmethod_ID = this.paymentmethod.paymentmethodID;

    bankaccount.isactive = "Y";
    this.bankaccountservice.add(bankaccount).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.bankaccount_ID) {
          this.toastrservice.success("Success", "New Bank Account Added");
          this.setBankaccount(this.bankaccountservice.getDetail(response));
          this.refresh.next();
          this.disabled = true;
          this.bankaccountGetAll();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  bankaccountUpdate(bankaccount) {

    bankaccount.bankaccounttype_ID = this.bankaccounttype.bankaccounttypeID;
    bankaccount.customer_ID = this.customer.customerID;
    bankaccount.paymentmethod_ID = this.paymentmethod.paymentmethodID;

    if (bankaccount.isactive == true) {
      bankaccount.isactive = "Y";
    } else {
      bankaccount.isactive = "N";
    }
    this.bankaccountservice.update(bankaccount, bankaccount.bankaccount_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.bankaccount_ID) {
          this.toastrservice.success("Success", "Bank Account Updated");
          this.setBankaccount(this.bankaccountservice.getDetail(response));
          this.refresh.next();
          this.disabled = true;
          this.bankaccountGetAll();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  bankaccountUpdateAll(bankaccounts) {
    this.bankaccountservice.updateAll(bankaccounts).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Bank Accounts Updated");
          this.setBankaccount(this.bankaccountservice.getDetail(response));
          this.refresh.next();
          this.disabled = true;
          this.bankaccountGetAll();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  bankaccountSearch(str) {
    var search = {
      search: str
    }
    this.bankaccountservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.bankaccounts = this.setBankaccounts(this.bankaccountservice.getAllDetail(response));
          window.sessionStorage.setItem("bankaccounts", JSON.stringify(this.bankaccounts));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  bankaccountSearchAll(str) {
    var search = {
      search: str
    }
    this.bankaccountservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.bankaccountsAll = this.setBankaccounts(this.bankaccountservice.getAllDetail(response));
          window.sessionStorage.setItem("bankaccountsAll", JSON.stringify(this.bankaccountsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  bankaccountAdvancedSearch(search) {
    this.customerID = search.customer_ID;
    this.paymentmethodID = search.paymentmethod_ID;
    this.paymentmethodCode = search.paymentmethod_CODE;
    this.bankaccounttypeID = search.bankaccounttype_ID;
    this.bankaccounttypeCode = search.bankaccounttype_CODE;

    this.bankaccountservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.bankaccounts = this.setBankaccounts(this.bankaccountservice.getAllDetail(response));
          window.sessionStorage.setItem("bankaccounts", JSON.stringify(this.bankaccounts));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  bankaccountAdvancedSearchAll(search) {
    this.customerID = search.customer_ID;
    this.paymentmethodID = search.paymentmethod_ID;
    this.paymentmethodCode = search.paymentmethod_CODE;
    this.bankaccounttypeID = search.bankaccounttype_ID;
    this.bankaccounttypeCode = search.bankaccounttype_CODE;

    this.bankaccountservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.bankaccountsAll = this.setBankaccounts(this.bankaccountservice.getAllDetail(response));
          window.sessionStorage.setItem("bankaccountsAll", JSON.stringify(this.bankaccountsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
