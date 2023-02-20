import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { Router } from '@angular/router';

import { CurrencyComponent } from '../currency/currency.component';
import { CustomerrefundService } from './customerrefund.service';
import { CustomerComponent } from '../../customers/customer/customer.component';
import { AccountComponent } from '../account/account.component';
import { RefundmethodComponent } from '../../lookups/refundmethod/refundmethod.component';
import { PostingperiodComponent } from '../../lookups/postingperiod/postingperiod.component';

@Component({
  selector: 'app-customerrefund',
  templateUrl: './customerrefund.component.html',
  styleUrls: ['./customerrefund.component.css']
})
export class CustomerrefundComponent implements OnInit {
  @ViewChild("customer") customer: CustomerComponent;
  @ViewChild("addcustomer") addcustomer: CustomerComponent;
  @ViewChild("editcustomer") editcustomer: CustomerComponent;

  @ViewChild("currency") currency: CurrencyComponent;
  @ViewChild("addcurrency") addcurrency: CurrencyComponent;
  @ViewChild("editcurrency") editcurrency: CurrencyComponent;

  @ViewChild("account") account: AccountComponent;
  @ViewChild("addaccount") addaccount: AccountComponent;
  @ViewChild("editaccount") editaccount: AccountComponent;

  @ViewChild("postingperiod") postingperiod: PostingperiodComponent;
  @ViewChild("addpostingperiod") addpostingperiod: PostingperiodComponent;
  @ViewChild("editpostingperiod") editpostingperiod: PostingperiodComponent;

  @ViewChild("refundmethod") refundmethod: RefundmethodComponent;
  @ViewChild("addrefundmethod") addrefundmethod: RefundmethodComponent;
  @ViewChild("editrefundmethod") editrefundmethod: RefundmethodComponent;

  @Input()
  view: number = 1;
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  customerrefundID = null;
  @Input()
  customerID = null;
  @Input()
  accountID = null;
  @Input()
  currencyID = null;

  @Output() show = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();

  customerrefunds = [];
  customerrefundsAll = [];
  customerrefund = {
    customerrefund_ID: 0,
    customer_ID: 0,
    account_ID: 0,
    currency_ID: 0,
    postingperiod_ID: 0,
    refundmethod_ID: 0,
    customerrefund_CODE: "",
    customerrefund_DATE: "",
    customer_BALANCE: null,
    customerrefund_AMOUNT: null,
    exchange_RATE:null,
    check_NUMBER: "",
    creditcard_NUMBER: "",
    expire_DATE: "",
    name_ONCARD: "",
    card_STREET: "",
    card_ZIPCODE: "",
    isapproved: true,
    isactive: true,
  }

  constructor(
    private customerrefundservice: CustomerrefundService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.customerrefunds = JSON.parse(window.sessionStorage.getItem('customerrefunds'));
    this.customerrefundsAll = JSON.parse(window.sessionStorage.getItem('customerrefundsAll'));
    if (this.view == 1 && this.customerrefunds == null) {
      this.customerrefundGet();
    }else if (this.view == 1 && this.disabled == true && this.customerrefundsAll == null) {
        this.customerrefundGetAll();
    } else if (this. view == 2 && this.customerrefundsAll == null) {
      this.customerrefundGetAll();
    } else if (this. view == 22 && (this.accountID != null )) {
      this.customerrefundAdvancedSearchAll(this.accountID,0,0);
    }

    if (this.customerrefundID != 0 && !this.customerrefundID && Number(window.sessionStorage.getItem('customerrefund'))>0) {
      this.customerrefundID = Number(window.sessionStorage.getItem('customerrefund'));
    }
    if (this.view == 5 && this.customerrefundID) {
      window.sessionStorage.setItem("customerrefund", this.customerrefundID);
      this.customerrefundGetOne(this.customerrefundID);
    } if (this.view == 11 && this.accountID && this.disabled == false) {
      this.customerrefundAdvancedSearch(this.accountID,0,0);
    } else if (this.view == 11 && this.accountID && this.disabled == true) {
      this.customerrefundAdvancedSearchAll(this.accountID,0,0);

    } else if (this.view == 11 || this.view == 1 ) {
      this.customerrefundID = null;
      this.customerrefundsAll = null;
      this.customerrefunds = null;
    }

    if (this.customerrefundID == 0) {
      this.customerrefundID = null;
    }
  }

  showView(row) {
    this.show.next(row);
  }

  editView() {
    this.disabled = false;
  }

  cancelView() {
    this.cancel.next();
  }

  customerrefundCancel() {
    console.log(this.customerrefund);
    this.disabled = true;
    if (this.customerrefund.customerrefund_ID == 0) {
      this.router.navigate(["/home/customerrefunds"], {});
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
          onClick: this.customerrefundGetAll.bind(this),
        },
      }
    );
  }

  onToolbarPreparingAdvanced(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          width: 136,
          text: 'Refresh',
          onClick: this.customerrefundAdvancedSearchAll.bind(this, this.accountID),
        },
      }
    );
  }

  add() {
    this.customerrefund = {
      customerrefund_ID: 0,
      customer_ID: 0,
      account_ID: 0,
      currency_ID: 0,
      postingperiod_ID: 0,
      refundmethod_ID: 0,
      customerrefund_CODE: "",
      customerrefund_DATE: "",
      customer_BALANCE: null,
      customerrefund_AMOUNT: null,
      exchange_RATE:null,
      check_NUMBER: "",
      creditcard_NUMBER: "",
      expire_DATE: "",
      name_ONCARD: "",
      card_STREET: "",
      card_ZIPCODE: "",
      isapproved: true,
      isactive: true,
    };
  }
  setcustomerrefund(response) {
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.customerrefund = response;
    this.disabled = true;
  }

  update(row) {
    this.edit.next(row);
  }

  setcustomerrefunds(response) {
    if ((this.view == 1 || this.view == 11) && this.disabled == false) {
      this.customerrefunds = response;
      window.sessionStorage.setItem("customerrefunds", JSON.stringify(this.customerrefunds));
    } else {
      this.customerrefundsAll = response;
      window.sessionStorage.setItem("customerrefundsAll", JSON.stringify(this.customerrefundsAll));
    }
    this.cancel.next();
  }

  customerrefundGet() {
    this.customerrefundservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setcustomerrefunds(this.customerrefundservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }


  customerrefundGetAll() {
    this.customerrefundservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setcustomerrefunds(this.customerrefundservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }
  customerrefundGetOne(id) {
    this.customerrefundservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setcustomerrefund(this.customerrefundservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }
  customerrefundAdd(customerrefund) {
    customerrefund.isactive = "Y";
    if (this.view == 5) {
      customerrefund.account_ID = this.account.accountID;
      customerrefund.customer_ID = this.customer.customerID;
      customerrefund.postingperiod_ID = this.postingperiod.postingperiodID;
      customerrefund.currency_ID = this.currency.currencyID;
      customerrefund.refundmethod_ID = this.refundmethod.refundmethodID;
    } else {
      customerrefund.refundmethod_ID = this.addrefundmethod.refundmethodID;
      customerrefund.currency_ID = this.addcurrency.currencyID;
      customerrefund.account_ID = this.addaccount.accountID;
      customerrefund.customer_ID = this.addcustomer.customerID;
      customerrefund.postingperiod_ID = this.addpostingperiod.postingperiodID;
    }
    this.customerrefundservice.add(customerrefund).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.customerrefund_ID) {
          this.toastrservice.success("Success", "New customerrefund Added");
          this.customerrefundGetAll();
          this.setcustomerrefund(this.customerrefundservice.getDetail(response));
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  customerrefundUpdate(customerrefund) {
    if (this.view == 5) {
      customerrefund.refundmethod_ID = this.refundmethod.refundmethodID;
      customerrefund.currency_ID = this.currency.currencyID;
      customerrefund.account_ID = this.account.accountID;
      customerrefund.customer_ID = this.customer.customerID;
      customerrefund.postingperiod_ID = this.postingperiod.postingperiodID;

    } else {
      customerrefund.refundmethod_ID = this.editrefundmethod.refundmethodID;
      customerrefund.currency_ID = this.editcurrency.currencyID;
      customerrefund.account_ID = this.editaccount.accountID;
      customerrefund.customer_ID = this.editcustomer.customerID;
      customerrefund.postingperiod_ID = this.editpostingperiod.postingperiodID;

    }

    if (customerrefund.isactive == true) {
      customerrefund.isactive = "Y";
    } else {
      customerrefund.isactive = "N";
    }
    this.customerrefundservice.update(customerrefund, customerrefund.customerrefund_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.customerrefund_ID) {
          this.toastrservice.success("Success", "customerrefund Updated");
          if (this.disabled == true) {
            this.setcustomerrefund(this.customerrefundservice.getDetail(response));
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

  customerrefundSearch(str) {
    var search = {
      search: str
    }
    this.customerrefundservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setcustomerrefunds(this.customerrefundservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  customerrefundSearchAll(str) {
    var search = {
      search: str
    }
    this.customerrefundservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setcustomerrefunds(this.customerrefundservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  customerrefundAdvancedSearch(currencyID, accountID, customerID) {
    this.currencyID = currencyID;
    this.accountID = accountID;
    this.customerID = customerID;
    var search = {
      currency_ID: currencyID,
      account_ID: accountID,
      customer_ID: customerID
    }
    this.customerrefundservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setcustomerrefunds(this.customerrefundservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  customerrefundAdvancedSearchAll(currencyID, accountID, customerID) {
    this.currencyID = currencyID;
    this.accountID = accountID;
    this.customerID = customerID;
    var search = {
      currency_ID: currencyID,
      account_ID: accountID,
      customer_ID: customerID
    }
    this.customerrefundservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setcustomerrefunds(this.customerrefundservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
