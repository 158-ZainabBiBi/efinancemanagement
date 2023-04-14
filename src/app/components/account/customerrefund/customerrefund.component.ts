import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { CustomerrefundService } from './customerrefund.service';
import { CurrencyComponent } from '../../lookup/currency/currency.component';
import { CustomerComponent } from '../../customer/customer/customer.component';
import { PostingperiodComponent } from '../../lookup/postingperiod/postingperiod.component';
import { RefundmethodComponent } from '../../lookup/refundmethod/refundmethod.component';
import { AccountComponent } from '../account/account.component';

@Component({
  selector: 'app-customerrefund',
  templateUrl: './customerrefund.component.html',
  styleUrls: ['./customerrefund.component.css']
})
export class CustomerrefundComponent implements OnInit {
  @ViewChild("customer") customer: CustomerComponent;
  @ViewChild("account") account: AccountComponent;
  @ViewChild("postingperiod") postingperiod: PostingperiodComponent;
  @ViewChild("refundmethod") refundmethod: RefundmethodComponent;
  @ViewChild("currency") currency: CurrencyComponent;

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
  customerrefundID = null;
  @Input()
  customerID = null;
  @Input()
  accountID = null;
  @Input()
  postingperiodID = null;
  @Input()
  postingperiodCode = null;
  @Input()
  refundmethodID = null;
  @Input()
  refundmethodCode = null;
  @Input()
  currencyID = null;
  @Input()
  currencyCode = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onCustomerRefundChange = new EventEmitter();

  customerrefunds = [];
  customerrefundsAll = [];
  customerrefund = {
    customerrefund_ID: 0,
    customer_ID: null,
    account_ID: null,
    currency_ID: null,
    postingperiod_ID: null,
    refundmethod_ID: null,
    customerrefund_CODE: null,
    customerrefund_DATE: null,
    customer_BALANCE: null,
    customerrefund_AMOUNT: null,
    exchange_RATE: null,
    check_NUMBER: null,
    creditcard_NUMBER: null,
    expire_DATE: null,
    name_ONCARD: null,
    card_STREET: null,
    card_ZIPCODE: null,
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
    this.load(this.isreload);
  }

  load(reload) {
    if (window.sessionStorage.getItem('customerrefunds') != null) {
      this.customerrefunds = JSON.parse(window.sessionStorage.getItem('customerrefunds'));
    }
    if (window.sessionStorage.getItem('customerrefundsAll') != null) {
      this.customerrefundsAll = JSON.parse(window.sessionStorage.getItem('customerrefundsAll'));
    }
    if (this.customerrefundID != 0 && !this.customerrefundID && Number(window.sessionStorage.getItem('customerrefund')) > 0) {
      this.customerrefundID = Number(window.sessionStorage.getItem('customerrefund'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.customerrefunds == null || this.customerrefunds.length == 0 || reload == true)) {
      this.customerrefunds == null;
      this.customerrefundGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.customerrefundsAll == null || this.customerrefundsAll.length == 0 || reload == true)) {
      this.customerrefundsAll == null;
      this.customerrefundGetAll();
    }

    var search = {
      customer_ID: this.customerID,
      account_ID: this.accountID,
      postingperiod_ID: this.postingperiodID,
      postingperiod_CODE: this.postingperiodCode,
      refundmethod_ID: this.refundmethodID,
      refundmethod_CODE: this.refundmethodCode,
      currency_ID: this.currencyID,
      currency_CODE: this.currencyCode,
    }

    if (this.view >= 5 && this.view <= 6 && this.customerrefundID) {
      window.sessionStorage.setItem("customerrefund", this.customerrefundID);
      this.customerrefundGetOne(this.customerrefundID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.customerrefunds == null || this.customerrefunds.length == 0 || reload == true)) {
      this.customerrefunds == null;
      this.customerrefundAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.customerrefundsAll == null || this.customerrefundsAll.length == 0 || reload == true)) {
      this.customerrefundsAll == null;
      this.customerrefundAdvancedSearchAll(search);
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
    this.customerrefund = {
      customerrefund_ID: 0,
      customer_ID: null,
      account_ID: null,
      currency_ID: null,
      postingperiod_ID: null,
      refundmethod_ID: null,
      customerrefund_CODE: null,
      customerrefund_DATE: null,
      customer_BALANCE: null,
      customerrefund_AMOUNT: null,
      exchange_RATE: null,
      check_NUMBER: null,
      creditcard_NUMBER: null,
      expire_DATE: null,
      name_ONCARD: null,
      card_STREET: null,
      card_ZIPCODE: null,
      isapproved: true,
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

  customerrefundEdit() {
    this.disabled = false;
  }

  customerrefundCancel() {
    this.disabled = true;
    if (this.customerrefund.customerrefund_ID == 0) {
      this.router.navigate(["/home/customerrefunds "], {});
    }
  }

  onChange(customerrefundID) {
    for (var i = 0; i < this.customerrefundsAll.length; i++) {
      if (this.customerrefundsAll[i].customerrefund_ID == customerrefundID) {
        this.onCustomerRefundChange.next(this.customerrefundsAll[i]);
        break;
      }
    }
  }

  setCustomerrefund(response) {
    if (response.isapproved == "Y") {
      response.isapproved = true;
    } else {
      response.isapproved = false;
    }
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.customerrefund = response;
  }

  setCustomerrefunds(response) {
    this.cancel.next();
    return response;
  }

  customerrefundGet() {
    this.customerrefundservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.customerrefunds = this.setCustomerrefunds(this.customerrefundservice.getAllDetail(response));
          window.sessionStorage.setItem("customerrefunds", JSON.stringify(this.customerrefunds));
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
          this.customerrefundsAll = this.setCustomerrefunds(this.customerrefundservice.getAllDetail(response));
          window.sessionStorage.setItem("customerrefundsAll", JSON.stringify(this.customerrefundsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  customerrefundGetOne(id) {
    this.disabled = true;
    this.customerrefundservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setCustomerrefund(this.customerrefundservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  customerrefundAdd(customerrefund) {
    customerrefund.isactive = "Y";
    customerrefund.isapproved = "N";
    customerrefund.account_ID = this.account.accountID;
    customerrefund.customer_ID = this.customer.customerID;
    customerrefund.postingperiod_ID = this.postingperiod.postingperiodID;
    customerrefund.currency_ID = this.currency.currencyID;
    customerrefund.refundmethod_ID = this.refundmethod.refundmethodID;

    this.customerrefundservice.add(customerrefund).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.customerrefund_ID) {
          this.toastrservice.success("Success", "New Customer Refund Added");
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

  customerrefundUpdate(customerrefund) {

    customerrefund.account_ID = this.account.accountID;
    customerrefund.customer_ID = this.customer.customerID;
    customerrefund.postingperiod_ID = this.postingperiod.postingperiodID;
    customerrefund.currency_ID = this.currency.currencyID;
    customerrefund.refundmethod_ID = this.refundmethod.refundmethodID;

    if (customerrefund.isapproved == true) {
      customerrefund.isapproved = "Y";
    } else {
      customerrefund.isapproved = "N";
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
          this.toastrservice.success("Success", "Customer Refund Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  customerrefundUpdateAll(customerrefunds) {
    this.customerrefundservice.updateAll(customerrefunds).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Customer Refunds Updated");
          this.refresh.next();
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
          this.customerrefunds = this.setCustomerrefunds(this.customerrefundservice.getAllDetail(response));
          window.sessionStorage.setItem("customerrefunds", JSON.stringify(this.customerrefunds));
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
          this.customerrefundsAll = this.setCustomerrefunds(this.customerrefundservice.getAllDetail(response));
          window.sessionStorage.setItem("customerrefundsAll", JSON.stringify(this.customerrefundsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  customerrefundAdvancedSearch(search) {
    this.customerID = search.customer_ID;
    this.accountID = search.account_ID;
    this.postingperiodID = search.postingperiod_ID;
    this.postingperiodCode = search.postingperiod_CODE;
    this.refundmethodID = search.refundmethod_ID;
    this.refundmethodCode = search.refundmethod_CODE;
    this.currencyID = search.currency_ID;
    this.currencyCode = search.currency_CODE;

    this.customerrefundservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.customerrefunds = this.setCustomerrefunds(this.customerrefundservice.getAllDetail(response));
          window.sessionStorage.setItem("customerrefunds", JSON.stringify(this.customerrefunds));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  customerrefundAdvancedSearchAll(search) {
    this.customerID = search.customer_ID;
    this.accountID = search.account_ID;
    this.postingperiodID = search.postingperiod_ID;
    this.postingperiodCode = search.postingperiod_CODE;
    this.refundmethodID = search.refundmethod_ID;
    this.refundmethodCode = search.refundmethod_CODE;
    this.currencyID = search.currency_ID;
    this.currencyCode = search.currency_CODE;

    this.customerrefundservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.customerrefundsAll = this.setCustomerrefunds(this.customerrefundservice.getAllDetail(response));
          window.sessionStorage.setItem("customerrefundsAll", JSON.stringify(this.customerrefundsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
