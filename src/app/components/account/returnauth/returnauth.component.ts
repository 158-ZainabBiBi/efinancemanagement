import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';


import { ProductComponent } from '../../product/product/product.component';
import { ReturnstatusComponent } from '../../lookup/returnstatus/returnstatus.component';
import { SaleordertypeComponent } from '../../lookup/saleordertype/saleordertype.component';
import { CustomerrefundComponent } from '../customerrefund/customerrefund.component';
import { CustomerComponent } from '../../customer/customer/customer.component';
import { CurrencyComponent } from '../currency/currency.component';
import { ReturnauthService } from './returnauth.service';

@Component({
  selector: 'app-returnauth',
  templateUrl: './returnauth.component.html',
  styleUrls: ['./returnauth.component.css']
})
export class ReturnauthComponent implements OnInit {
  @ViewChild("currency") currency: CurrencyComponent;
  @ViewChild("addcurrency") addcurrency: CurrencyComponent;
  @ViewChild("editcurrency") editcurrency: CurrencyComponent;

  @ViewChild("customerrefund") customerrefund: CustomerrefundComponent;
  @ViewChild("addcustomerrefund") addcustomerrefund: CustomerrefundComponent;
  @ViewChild("editcustomerrefund") editcustomerrefund: CustomerrefundComponent;

  @ViewChild("customer") customer: CustomerComponent;
  @ViewChild("addcustomer") addcustomer: CustomerComponent;
  @ViewChild("editcustomer") editcustomer: CustomerComponent;

  @ViewChild("product") product: ProductComponent;
  @ViewChild("addproduct") addproduct: ProductComponent;
  @ViewChild("editproduct") editproduct: ProductComponent;

  @ViewChild("returnstatus") returnstatus: ReturnstatusComponent;
  @ViewChild("addreturnstatus") addreturnstatus: ReturnstatusComponent;
  @ViewChild("editreturnstatus") editreturnstatus: ReturnstatusComponent;

  @ViewChild("saleordertype") saleordertype: SaleordertypeComponent;
  @ViewChild("addsaleordertype") addsaleordertype: SaleordertypeComponent;
  @ViewChild("editsaleordertype") editsaleordertype: SaleordertypeComponent;

  @Input()
  view: number = 1;
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  currencyID = null;
  @Input()
  returnauthID = null;
  @Input()
  customerrefundID = null;
  @Input()
  customerID = null;
  @Input()
  productID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();


  returnauths = [];
  returnauthsAll = [];
  returnauth = {
    returnauth_ID: 0,
    currency_ID: 0,
    customerrefund_ID: 0,
    customer_ID: 0,
    product_ID: 0,
    returnstatus_ID: 0,
    saleordertype_ID: 0,
    returnauth_CODE: "",
    returnauth_DATE: "",
    delivery_DATE: "",
    exchange_RATE: null,
    rate: null,
    discount: null,
    isactive: true
  }

  constructor(
    private returnauthservice: ReturnauthService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router : Router,
  ) { }

  ngOnInit(): void {
    this.returnauths = JSON.parse(window.sessionStorage.getItem('returnauths'));
    this.returnauthsAll = JSON.parse(window.sessionStorage.getItem('returnauthsAll'));
    if (this.view == 1 && this.disabled == false && this.returnauths == null) {
      this.returnauthGet();
    } else if (this.view == 1 && this.disabled == true && this.returnauthsAll == null) {
      this.returnauthGetAll();
    } else if (this. view == 2 && this.returnauthsAll == null) {
      this.returnauthGetAll();
    }

    if (this.returnauthID != 0 && !this.returnauthID && Number(window.sessionStorage.getItem('returnauth'))>0) {
      this.returnauthID = Number(window.sessionStorage.getItem('returnauth'));
    }  else if (this. view == 22 && (this.currencyID != null )) {
      this.returnauthAdvancedSearchAll(this.currencyID,0,0,0);
    }

    if (this.view == 5 && this.returnauthID) {
      window.sessionStorage.setItem("returnauth", this.returnauthID);
      this.returnauthGetOne(this.returnauthID);
    }

    if (this.view == 11 && this.currencyID && this.disabled == false) {
      this.returnauthAdvancedSearch(this.currencyID,0,0,0);
    } else if (this.view == 11 && this.currencyID && this.disabled == true) {
      this.returnauthAdvancedSearchAll(this.currencyID,0,0,0);

    } else if (this.view == 11|| this.view == 1) {
      this.returnauthID = null;
      this.returnauthsAll = null;
      this.returnauths = null;
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
          onClick: this.returnauthGetAll.bind(this),
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
          onClick: this.returnauthAdvancedSearchAll.bind(this, this.currencyID),
        },
      }
    );
  }

  add() {
    this.returnauth = {
      returnauth_ID: 0,
      currency_ID: 0,
      customerrefund_ID: 0,
      customer_ID: 0,
      product_ID: 0,
      returnstatus_ID: 0,
      saleordertype_ID: 0,
      returnauth_CODE: "",
      returnauth_DATE: "",
      delivery_DATE: "",
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

  returnauthEdit(){
    this.disabled = false;
  }

  returnauthCancel() {
    this.disabled = true;
    if (this.returnauth.returnauth_ID==0) {
      this.router.navigate(["/home/returnauths"], {});
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
    if ((this.view == 1 || this.view == 11)  && this.disabled == false) {
      this.returnauths = response;
      window.sessionStorage.setItem("returnauths", JSON.stringify(this.returnauths));
    } else {
      this.returnauthsAll = response;
      window.sessionStorage.setItem("returnauthsAll", JSON.stringify(this.returnauthsAll));
    }
    this.cancel.next();
  }

  returnauthGet() {
    this.returnauthservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setReturnauths(this.returnauthservice.getAllDetail(response));
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
        } else{
          this.setReturnauths(this.returnauthservice.getAllDetail(response));
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
        } else{
          this.setReturnauth(this.returnauthservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  returnauthAdd(returnauth) {
    returnauth.isactive="Y";

    if(this.view == 5){
      returnauth.currency_ID = this.currency.currencyID;
      returnauth.customer_ID = this.customer.customerID;
      returnauth.customerrefund_ID = this.customerrefund.customerrefundID;
      returnauth.product_ID = this.product.productID;
      returnauth.returnstatus_ID = this.returnstatus.returnstatusID;
      returnauth.saleordertype_ID = this.saleordertype.saleordertypeID;
    }else{
      returnauth.currency_ID = this.addcurrency.currencyID;
      returnauth.customer_ID = this.addcustomer.customerID;
      returnauth.customerrefund_ID = this.addcustomerrefund.customerrefundID;
      returnauth.product_ID = this.addproduct.productID;
      returnauth.returnstatus_ID = this.addreturnstatus.returnstatusID;
      returnauth.saleordertype_ID = this.addsaleordertype.saleordertypeID;
    }

    this.returnauthservice.add(returnauth).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.returnauth_ID) {
          this.toastrservice.success("Success", "New returnauth Added");
          this.returnauthGetAll();
          this.setReturnauth(response);
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
     if(this.view == 5){
     returnauth.currency_ID = this.currency.currencyID;
     returnauth.customer_ID = this.customer.customerID;
     returnauth.customerrefund_ID = this.customerrefund.customerrefundID;
     returnauth.product_ID = this.product.productID;
     returnauth.returnstatus_ID = this.returnstatus.returnstatusID;
     returnauth.saleordertype_ID = this.saleordertype.saleordertypeID;
    }else{
     returnauth.currency_ID = this.editcurrency.currencyID;
     returnauth.customer_ID = this.editcustomer.customerID;
     returnauth.customerrefund_ID = this.editcustomerrefund.customerrefundID;
     returnauth.product_ID = this.editproduct.productID;
     returnauth.returnstatus_ID = this.editreturnstatus.returnstatusID;
     returnauth.saleordertype_ID = this.editsaleordertype.saleordertypeID;
    }
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
          this.toastrservice.success("Success", " returnauth Updated");
          if (this.disabled==true) {
            this.setReturnauth(response);
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

  returnauthSearch(str) {
    var search = {
      search: str
    }
    this.returnauthservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setReturnauths(this.returnauthservice.getAllDetail(response));
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
        } else{
          this.setReturnauths(this.returnauthservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  returnauthAdvancedSearch(currencyID, customerrefundID, customerID, productID) {
    this.currencyID = currencyID;
    this.customerrefundID = customerrefundID;
    this.customerID = customerID;
    this.productID = productID;
    var search = {
      currency_ID: currencyID,
      customerrefund_ID: customerrefundID,
      customer_ID: customerID,
      product_ID: productID
    }
    this.returnauthservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setReturnauths(this.returnauthservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  returnauthAdvancedSearchAll(currencyID, customerrefundID, customerID, productID) {
    this.currencyID = currencyID;
    this.customerrefundID = customerrefundID;
    this.customerID = customerID;
    this.productID = productID;
    var search = {
      currency_ID: currencyID,
      customerrefund_ID: customerrefundID,
      customer_ID: customerID,
      product_ID: productID
    }
    this.returnauthservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setReturnauths(this.returnauthservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
