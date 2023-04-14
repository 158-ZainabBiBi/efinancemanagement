import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { ReturnauthService } from './returnauth.service';
import { CurrencyComponent } from '../../lookup/currency/currency.component';
import { CustomerComponent } from '../../customer/customer/customer.component';
import { ReturnstatusComponent } from '../../lookup/returnstatus/returnstatus.component';
import { RefundmethodComponent } from '../../lookup/refundmethod/refundmethod.component';
import { CustomerrefundComponent } from '../customerrefund/customerrefund.component';
import { ProductComponent } from '../../product/product/product.component';

@Component({
  selector: 'app-returnauth',
  templateUrl: './returnauth.component.html',
  styleUrls: ['./returnauth.component.css']
})
export class ReturnauthComponent implements OnInit {
  @ViewChild("product") product: ProductComponent;
  @ViewChild("customer") customer: CustomerComponent;
  @ViewChild("customerrefund") customerrefund: CustomerrefundComponent;
  @ViewChild("returnstatus") returnstatus: ReturnstatusComponent;
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
  returnauthID = null;
  @Input()
  productID = null;
  @Input()
  customerID = null;
  @Input()
  customerrefundID = null;
  @Input()
  returnstatusID = null;
  @Input()
  returnstatusCode = null;
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
  @Output() onReturnAuthChange = new EventEmitter();

  returnauths = [];
  returnauthsAll = [];
  returnauth = {
    returnauth_ID: 0,
    currency_ID: null,
    customerrefund_ID: null,
    customer_ID: null,
    product_ID: null,
    returnstatus_ID: null,
    saleordertype_ID: null,
    returnauth_CODE: null,
    returnauth_DATE: null,
    delivery_DATE: null,
    exchange_RATE: null,
    rate: null,
    discount: null,
    isactive: true
  }

  constructor(
    private returnauthservice: ReturnauthService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload) {
    if (window.sessionStorage.getItem('returnauths') != null) {
      this.returnauths = JSON.parse(window.sessionStorage.getItem('returnauths'));
    }
    if (window.sessionStorage.getItem('returnauthsAll') != null) {
      this.returnauthsAll = JSON.parse(window.sessionStorage.getItem('returnauthsAll'));
    }
    if (this.returnauthID != 0 && !this.returnauthID && Number(window.sessionStorage.getItem('returnauth')) > 0) {
      this.returnauthID = Number(window.sessionStorage.getItem('returnauth'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.returnauths == null || this.returnauths.length == 0 || reload == true)) {
      this.returnauths == null;
      this.returnauthGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.returnauthsAll == null || this.returnauthsAll.length == 0 || reload == true)) {
      this.returnauthsAll == null;
      this.returnauthGetAll();
    }

    var search = {
      product_ID: this.productID,
      customer_ID: this.customerID,
      customerrefund_ID: this.customerrefundID,
      returnstatus_ID: this.returnstatusID,
      returnstatus_CODE: this.returnstatusCode,
      refundmethod_ID: this.refundmethodID,
      refundmethod_CODE: this.refundmethodCode,
      currency_ID: this.currencyID,
      currency_CODE: this.currencyCode,
    }

    if (this.view >= 5 && this.view <= 6 && this.returnauthID) {
      window.sessionStorage.setItem("returnauth", this.returnauthID);
      this.returnauthGetOne(this.returnauthID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.returnauths == null || this.returnauths.length == 0 || reload == true)) {
      this.returnauths == null;
      this.returnauthAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.returnauthsAll == null || this.returnauthsAll.length == 0 || reload == true)) {
      this.returnauthsAll == null;
      this.returnauthAdvancedSearchAll(search);
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
    this.returnauth = {
      returnauth_ID: 0,
      currency_ID: null,
      customerrefund_ID: null,
      customer_ID: null,
      product_ID: null,
      returnstatus_ID: null,
      saleordertype_ID: null,
      returnauth_CODE: null,
      returnauth_DATE: null,
      delivery_DATE: null,
      exchange_RATE: null,
      rate: null,
      discount: null,
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

  returnauthEdit() {
    this.disabled = false;
  }

  returnauthCancel() {
    this.disabled = true;
    if (this.returnauth.returnauth_ID == 0) {
      this.router.navigate(["/home/returnauths "], {});
    }
  }

  onChange(returnauthID) {
    for (var i = 0; i < this.returnauthsAll.length; i++) {
      if (this.returnauthsAll[i].returnauth_ID == returnauthID) {
        this.onReturnAuthChange.next(this.returnauthsAll[i]);
        break;
      }
    }
  }

  setReturnauth(response) {

    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.returnauth = response;
  }

  setReturnauths(response) {
    this.cancel.next();
    return response;
  }

  returnauthGet() {
    this.returnauthservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.returnauths = this.setReturnauths(this.returnauthservice.getAllDetail(response));
          window.sessionStorage.setItem("returnauths", JSON.stringify(this.returnauths));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  returnauthGetAll() {
    this.returnauthservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.returnauthsAll = this.setReturnauths(this.returnauthservice.getAllDetail(response));
          window.sessionStorage.setItem("returnauthsAll", JSON.stringify(this.returnauthsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  returnauthGetOne(id) {
    this.disabled = true;
    this.returnauthservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setReturnauth(this.returnauthservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  returnauthAdd(returnauth) {
    returnauth.isactive = "Y";
    returnauth.product_ID = this.product.productID;
    returnauth.customerrefund_ID = this.customerrefund.customerrefundID;
    returnauth.customer_ID = this.customer.customerID;
    returnauth.returnstatus_ID = this.returnstatus.returnstatusID;
    returnauth.currency_ID = this.currency.currencyID;
    returnauth.refundmethod_ID = this.refundmethod.refundmethodID;

    this.returnauthservice.add(returnauth).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.returnauth_ID) {
          this.toastrservice.success("Success", "New Return Auth Added");
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

  returnauthUpdate(returnauth) {

    returnauth.product_ID = this.product.productID;
    returnauth.customerrefund_ID = this.customerrefund.customerrefundID;
    returnauth.customer_ID = this.customer.customerID;
    returnauth.returnstatus_ID = this.returnstatus.returnstatusID;
    returnauth.currency_ID = this.currency.currencyID;
    returnauth.refundmethod_ID = this.refundmethod.refundmethodID;

    if (returnauth.isactive == true) {
      returnauth.isactive = "Y";
    } else {
      returnauth.isactive = "N";
    }
    this.returnauthservice.update(returnauth, returnauth.returnauth_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.returnauth_ID) {
          this.toastrservice.success("Success", "Return Auth Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  returnauthUpdateAll(returnauths) {
    this.returnauthservice.updateAll(returnauths).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Return Auths Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  returnauthSearch(str) {
    var search = {
      search: str
    }
    this.returnauthservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.returnauths = this.setReturnauths(this.returnauthservice.getAllDetail(response));
          window.sessionStorage.setItem("returnauths", JSON.stringify(this.returnauths));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  returnauthSearchAll(str) {
    var search = {
      search: str
    }
    this.returnauthservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.returnauthsAll = this.setReturnauths(this.returnauthservice.getAllDetail(response));
          window.sessionStorage.setItem("returnauthsAll", JSON.stringify(this.returnauthsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  returnauthAdvancedSearch(search) {
    this.customerID = search.customer_ID;
    this.productID = search.product_ID;
    this.customerrefundID = search.customerrefund_ID;
    this.returnstatusID = search.returnstatus_ID;
    this.returnstatusCode = search.returnstatus_CODE;
    this.refundmethodID = search.refundmethod_ID;
    this.refundmethodCode = search.refundmethod_CODE;
    this.currencyID = search.currency_ID;
    this.currencyCode = search.currency_CODE;

    this.returnauthservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.returnauths = this.setReturnauths(this.returnauthservice.getAllDetail(response));
          window.sessionStorage.setItem("returnauths", JSON.stringify(this.returnauths));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  returnauthAdvancedSearchAll(search) {
    this.customerID = search.customer_ID;
    this.productID = search.product_ID;
    this.customerrefundID = search.customerrefund_ID;
    this.returnstatusID = search.returnstatus_ID;
    this.returnstatusCode = search.returnstatus_CODE;
    this.refundmethodID = search.refundmethod_ID;
    this.refundmethodCode = search.refundmethod_CODE;
    this.currencyID = search.currency_ID;
    this.currencyCode = search.currency_CODE;

    this.returnauthservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.returnauthsAll = this.setReturnauths(this.returnauthservice.getAllDetail(response));
          window.sessionStorage.setItem("returnauthsAll", JSON.stringify(this.returnauthsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
