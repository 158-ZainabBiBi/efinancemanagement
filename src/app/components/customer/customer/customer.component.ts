import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { CustomerService } from './customer.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  @Input()
  view: number = 1;
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  customerID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() onCustomerChange = new EventEmitter();

  customers = [];
  customersAll = [];
  customer = {
    customer_ID: 0,
    company_ID:0,
    person_ID:0,
    taxcode_ID:0,

    currency_ID: 0,
    hold_ID: 0,
    addresscountry_ID:0,
    invoicetype_ID:0,
    customerstatus_ID:0,
    pricelevel_ID:0,
    terms_ID:0,
    customercategory_ID:0,
    businesstype_ID:0,
    businessmarketniche_ID:0,
    creditterms_ID:0,

    salesrepemployee_ID:null,
    netsuite_ID:null,
    quickbook_ID:null,
    defaultreceivablesaccout_ID:null,

    customer_NAME:"",
    customer_CODE:"",
    customer_NEWCODE:"",
    web_ADDRESS:"",
    defaultorder_PRIORITY: "",
    comments:"",
    origin_CODE:"",
    delivery_INSTRUCTIONS:"",
    opening_HOURS:"",
    closing_HOURS:"",
    account:"",
    start_DATE:"",
    end_DATE:"",
    taxreg_NUMBER:null,
    resale_NUMBER:null,
    overdue_BALANCE:null,
    unbilled_ORDERS:null,
    days_OVERDUE:null,
    hold_REASON:"",
    telephone_NUMBER:"",
    telephone_ALTNUMBER:"",
    mobile_NUMBER:"",
    email:"",
    credit_LIMIT:null,
    balance:"",
    deposit_BALANCE:"",

    address_LONGITUDE:"",
    address_LINE1:"",
    address_LINE2:"",
    address_LINE3:"",
    address_LINE4:"",
    address_LINE5:"",
    address_POSTCODE:"",
    address_LATITUDE:"",
    locations: [],

    iscashonlineonly:true,
    iscreditfacility:true,
    istemporaryaccount:true,
    issellonlycustompriceitems:true,
    isapplycustompricefirst:true,
    isfranchisee:true,
    iscashonly:true,
    isonlinepaymentonly:true,
    isactive:true,
  }

  constructor(
    private customerservice: CustomerService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router : Router,
  ) { }

  ngOnInit(): void {
    this.customers = JSON.parse(window.sessionStorage.getItem('customers'));
    this.customersAll = JSON.parse(window.sessionStorage.getItem('customersAll'));
    if (this.view == 1 && this.disabled == false && this.customers == null) {
      this.customerGet();
    } else if (this.view == 1 && this.disabled == true && this.customersAll == null) {
      this.customerGetAll();
    } else if (this. view == 2 && this.customersAll == null) {
      this.customerGetAll();
    }

    if (this.customerID != 0 && !this.customerID && Number(window.sessionStorage.getItem('customer'))>0) {
      this.customerID = Number(window.sessionStorage.getItem('customer'));
    }
    if (this.view == 5 && this.customerID) {
      window.sessionStorage.setItem("customer", this.customerID);
      this.customerGetOne(this.customerID);
    }

    if (this.customerID == 0)
      this.customerID = null;
  }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          width: 136,
          text: 'Refresh',
          onClick: this.customerGetAll.bind(this),
        },
      }
    );
  }

  add() {
    this.customer = {
      customer_ID: 0,
      company_ID:0,
      person_ID:0,
      taxcode_ID:0,

      currency_ID: 0,
      hold_ID: 0,
      addresscountry_ID:0,
      invoicetype_ID:0,
      customerstatus_ID:0,
      pricelevel_ID:0,
      terms_ID:0,
      customercategory_ID:0,
      businesstype_ID:0,
      businessmarketniche_ID:0,
      creditterms_ID:0,

      salesrepemployee_ID:null,
      netsuite_ID:null,
      quickbook_ID:null,
      defaultreceivablesaccout_ID:null,

      customer_NAME:"",
      customer_CODE:"",
      customer_NEWCODE:"",
      web_ADDRESS:"",
      defaultorder_PRIORITY: "",
      comments:"",
      origin_CODE:"",
      delivery_INSTRUCTIONS:"",
      opening_HOURS:"",
      closing_HOURS:"",
      account:"",
      start_DATE:"",
      end_DATE:"",
      taxreg_NUMBER:null,
      resale_NUMBER:null,
      overdue_BALANCE:null,
      unbilled_ORDERS:null,
      days_OVERDUE:null,
      hold_REASON:"",
      telephone_NUMBER:"",
      telephone_ALTNUMBER:"",
      mobile_NUMBER:"",
      email:"",
      credit_LIMIT:null,
      balance:"",
      deposit_BALANCE:"",

      address_LINE1:"",
      address_LINE2:"",
      address_LINE3:"",
      address_LINE4:"",
      address_LINE5:"",
      address_POSTCODE:"",
      address_LATITUDE:"",
      address_LONGITUDE:"",
      locations: [],

      iscashonlineonly:true,
      iscreditfacility:true,
      istemporaryaccount:true,
      issellonlycustompriceitems:true,
      isapplycustompricefirst:true,
      isfranchisee:true,
      iscashonly:true,
      isonlinepaymentonly:true,
      isactive:true,
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

  customerEdit(){
    this.disabled = false;
  }

  customerCancel() {
    this.disabled = true;
    if (this.customer.customer_ID==0) {
      this.router.navigate(["/home/customers"], {});
    }
  }

  onChange(customer) {
    this.onCustomerChange.next(customer);
  }

  setCustomer(response) {
    if (response.issellonlycustompriceitems == "Y") {
      response.issellonlycustompriceitems = true;
    } else {
      response.issellonlycustompriceitems = false;
    }

    if (response.isapplycustompricefirst == "Y") {
      response.isapplycustompricefirst = true;
    } else {
      response.isapplycustompricefirst = false;
    }

    if (response.isfranchisee == "Y") {
      response.isfranchisee = true;
    } else {
      response.isfranchisee = false;
    }

    if (response.iscashonlineonly == "Y") {
      response.iscashonlineonly = true;
    } else {
      response.iscashonlineonly = false;
    }

    if (response.iscreditfacility == "Y") {
      response.iscreditfacility = true;
    } else {
      response.iscreditfacility = false;
    }

    if (response.istemporaryaccount == "Y") {
      response.istemporaryaccount = true;
    } else {
      response.istemporaryaccount = false;
    }

    if (response.iscashonly == "Y") {
      response.iscashonly = true;
    } else {
      response.iscashonly = false;
    }

    if (response.isonlinepaymentonly == "Y") {
      response.isonlinepaymentonly = true;
    } else {
      response.isonlinepaymentonly = false;
    }

    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.customer = response;
    this.disabled = true;
  }

  setCustomers(response) {
    if (this.view == 1 && this.disabled == false) {
      this.customers = response;
      window.sessionStorage.setItem("customers", JSON.stringify(this.customers));
    } else {
      this.customersAll = response;
      window.sessionStorage.setItem("customersAll", JSON.stringify(this.customersAll));
    }
    this.cancel.next();
  }

  customerGet() {
    this.customerservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setCustomers(this.customerservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  customerGetAll() {
    this.customerservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setCustomers(this.customerservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  customerGetOne(id) {
    this.customerservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setCustomer(this.customerservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }
  customerAdd(customer) {
    customer.isactive="Y";
    customer.isfranchisee == "Y"
    customer.isapplycustompricefirst == "Y"
    customer.issellonlycustompriceitems == "Y"
    customer.iscashonlineonly == "Y"
    customer.iscreditfacility == "Y"
    customer.istemporaryaccount == "Y"
    customer.iscashonly == "Y"
    if(this.view == 5){}else{}

    this.customerservice.add(customer).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.customer_ID) {
          this.toastrservice.success("Success", "New Customer Added");
          this.customerGetAll();
          this.setCustomer(response);
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  customerUpdate(customer) {
    if(this.view == 5){}else{}

    if (customer.isactive == true) {
      customer.isactive = "Y";
    } else {
      customer.isactive = "N";
    }
    if (customer.isfranchisee == true) {
      customer.isfranchisee = "Y";
    } else {
      customer.isfranchisee = "N";
    }
    if (customer.isapplycustompricefirst == true) {
      customer.isapplycustompricefirst = "Y";
    } else {
      customer.isapplycustompricefirst = "N";
    }
    if (customer.issellonlycustompriceitems == true) {
      customer.issellonlycustompriceitems = "Y";
    } else {
      customer.issellonlycustompriceitems = "N";
    }
    if (customer.iscashonlineonly == "Y") {
      customer.iscashonlineonly = true;
    } else {
      customer.iscashonlineonly = false;
    }
    if (customer.iscreditfacility == "Y") {
      customer.iscreditfacility = true;
    } else {
      customer.iscreditfacility = false;
    }
    if (customer.istemporaryaccount == "Y") {
      customer.istemporaryaccount = true;
    } else {
      customer.istemporaryaccount = false;
    }
    if (customer.iscashonly == "Y") {
      customer.iscashonly = true;
    } else {
      customer.iscashonly = false;
    }

    this.customerservice.update(customer, customer.customer_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.customer_ID) {
          this.toastrservice.success("Success", " Customer Updated");
          if (this.disabled==true) {
            this.setCustomer(response);
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
}
