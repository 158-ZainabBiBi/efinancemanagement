import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { PersonComponent } from '../../person/person/person.component';
import { AddressComponent } from '../../common/address/address.component';
import { CustomerService } from './customer.service';
import { TaxcodeComponent } from '../../finance/taxcode/taxcode.component';
import { CurrencyComponent } from '../../lookup/finance/currency/currency.component';
import { BusinessmarketnicheComponent } from '../../lookup/customer/businessmarketniche/businessmarketniche.component';
import { BusinesstypeComponent } from '../../lookup/customer/businesstype/businesstype.component';
import { CredittermsComponent } from '../../lookup/customer/creditterms/creditterms.component';
import { CustomercategoryComponent } from '../../lookup/customer/customercategory/customercategory.component';
import { CustomerstatusComponent } from '../../lookup/customer/customerstatus/customerstatus.component';
import { HoldComponent } from '../../lookup/customer/hold/hold.component';
import { TermsComponent } from '../../lookup/customer/terms/terms.component';
import { EmployeeComponent } from '../../employee/employee/employee.component';
import { InvoicetypeComponent } from '../../lookup/customer/invoicetype/invoicetype.component';
import { PricelevelComponent } from '../../lookup/customer/pricelevel/pricelevel.component';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  @ViewChild("address") address: AddressComponent;
  @ViewChild("person") person: PersonComponent;
  @ViewChild("employee") employee: EmployeeComponent;
  @ViewChild("taxcode") taxcode: TaxcodeComponent;

  @ViewChild("currency") currency: CurrencyComponent;
  @ViewChild("hold") hold: HoldComponent;
  @ViewChild("invoicetype") invoicetype: InvoicetypeComponent;
  @ViewChild("customerstatus") customerstatus: CustomerstatusComponent;
  @ViewChild("pricelevel") pricelevel: PricelevelComponent;
  @ViewChild("terms") terms: TermsComponent;
  @ViewChild("customercategory") customercategory: CustomercategoryComponent;
  @ViewChild("businesstype") businesstype: BusinesstypeComponent;
  @ViewChild("businessmarketniche") businessmarketniche: BusinessmarketnicheComponent;
  @ViewChild("creditterms") creditterms: CredittermsComponent;

  @Input()
  view: number = 1;
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  isreload: boolean = false;
  @Input()
  customerID = null;
  @Input()
  addressID = null;
  @Input()
  personID = null;
  @Input()
  employeeID = null;
  @Input()
  taxcodeID = null;
  @Input()
  currencyID = null;
  @Input()
  currencyCode = null;
  @Input()
  holdID = null;
  @Input()
  holdCode = null;
  @Input()
  invoicetypeID = null;
  @Input()
  invoicetypeCode = null;
  @Input()
  customerstatusID = null;
  @Input()
  customerstatusCode = null;
  @Input()
  pricelevelID = null;
  @Input()
  pricelevelCode = null;
  @Input()
  termsID = null;
  @Input()
  termsCode = null;
  @Input()
  customercategoryID = null;
  @Input()
  customercategoryCode = null;
  @Input()
  businesstypeID = null;
  @Input()
  businesstypeCode = null;
  @Input()
  businessmarketnicheID = null;
  @Input()
  businessmarketnicheCode = null;
  @Input()
  credittermsID = null;
  @Input()
  credittermsCode = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onCustomerChange = new EventEmitter();

  customers = [];
  customersAll = [];
  customer = {
    customer_ID: 0,
    netsuite_ID: null,
    quickbook_ID: null,
    sage_ID: null,

    customer_NAME: null,
    customer_CODE: null,
    customer_NEWCODE: null,
    origin_CODE: null,
    comments: null,

    person_ID: null,
    salesrepemployee_ID: null,
    invoicetype_ID: null,
    customerstatus_ID: null,

    taxreg_NUMBER: null,
    resale_NUMBER: null,

    taxcode_ID: null,
    currency_ID: null,
    pricelevel_ID: null,
    terms_ID: null,
    creditterms_ID: null,
    hold_ID: null,
    hold_REASON: null,

    customercategory_ID: null,
    businesstype_ID: null,
    businessmarketniche_ID: null,
    defaultreceivablesaccout_ID: null,

    start_DATE: null,
    end_DATE: null,
    opening_HOURS: null,
    closing_HOURS: null,

    defaultorder_PRIORITY: null,
    delivery_INSTRUCTIONS: null,
    account: null,

    overdue_BALANCE: null,
    unbilled_ORDERS: null,
    days_OVERDUE: null,
    credit_LIMIT: null,
    balance: null,
    deposit_BALANCE: null,

    address_LINE1: null,
    address_LINE2: null,
    address_LINE3: null,
    address_LINE4: null,
    address_LINE5: null,
    address_POSTCODE: null,
    address_LATITUDE: null,
    address_LONGITUDE: null,
    location_ID: null,
    locations: [],
    telephone_NUMBER: null,
    telephone_ALTNUMBER: null,
    mobile_NUMBER: null,
    email: null,
    web_ADDRESS: null,

    iscashonlineonly: true,
    iscreditfacility: true,
    istemporaryaccount: true,
    issellonlycustompriceitems: true,
    isapplycustompricefirst: true,
    isfranchisee: true,
    iscashonly: true,
    isonlinepaymentonly: true,
    isactive: true,
  }

  constructor(
    private customerservice: CustomerService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload) {
    if (window.sessionStorage.getItem('customers') != null) {
      this.customers = JSON.parse(window.sessionStorage.getItem('customers'));
    }
    if (window.sessionStorage.getItem('customersAll') != null) {
      this.customersAll = JSON.parse(window.sessionStorage.getItem('customersAll'));
    }
    if (this.customerID != 0 && !this.customerID && Number(window.sessionStorage.getItem('customer')) > 0) {
      this.customerID = Number(window.sessionStorage.getItem('customer'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.customers == null || this.customers.length == 0 || reload == true)) {
      this.customers == null;
      this.customerGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.customersAll == null || this.customersAll.length == 0 || reload == true)) {
      this.customersAll == null;
      this.customerGetAll();
    }

    var search = {
      address_ID: this.addressID,
      person_ID: this.personID,
      employee_ID: this.employeeID,
      taxcode_ID: this.taxcodeID,
      currency_ID: this.currencyID,
      currency_CODE: this.currencyCode,
      hold_ID: this.holdID,
      hold_CODE: this.holdCode,
      invoicetype_ID: this.invoicetypeID,
      invoicetype_CODE: this.invoicetypeCode,
      customerstatus_ID: this.customerstatusID,
      customerstatus_CODE: this.customerstatusCode,
      pricelevel_ID: this.pricelevelID,
      pricelevel_CODE: this.pricelevelCode,
      terms_ID: this.termsID,
      terms_CODE: this.termsCode,
      customercategory_ID: this.customercategoryID,
      customercategory_CODE: this.customercategoryCode,
      businesstype_ID: this.businesstypeID,
      businesstype_CODE: this.businesstypeCode,
      businessmarketniche_ID: this.businessmarketnicheID,
      businessmarketniche_CODE: this.businessmarketnicheCode,
      creditterms_ID: this.credittermsID,
      creditterms_CODE: this.credittermsCode,
    }

    if (this.view >= 5 && this.view <= 6 && this.customerID) {
      window.sessionStorage.setItem("customer", this.customerID);
      this.customerGetOne(this.customerID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.customers == null || this.customers.length == 0 || reload == true)) {
      this.customers == null;
      this.customerAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.customersAll == null || this.customersAll.length == 0 || reload == true)) {
      this.customersAll == null;
      this.customerAdvancedSearchAll(search);
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
    this.customer = {
      customer_ID: 0,
      netsuite_ID: null,
      quickbook_ID: null,
      sage_ID: null,

      customer_NAME: null,
      customer_CODE: null,
      customer_NEWCODE: null,
      origin_CODE: null,
      comments: null,

      person_ID: null,
      salesrepemployee_ID: null,
      invoicetype_ID: null,
      customerstatus_ID: null,

      taxreg_NUMBER: null,
      resale_NUMBER: null,

      taxcode_ID: null,
      currency_ID: null,
      pricelevel_ID: null,
      terms_ID: null,
      creditterms_ID: null,
      hold_ID: null,
      hold_REASON: null,

      customercategory_ID: null,
      businesstype_ID: null,
      businessmarketniche_ID: null,
      defaultreceivablesaccout_ID: null,

      start_DATE: null,
      end_DATE: null,
      opening_HOURS: null,
      closing_HOURS: null,

      defaultorder_PRIORITY: null,
      delivery_INSTRUCTIONS: null,
      account: null,

      overdue_BALANCE: null,
      unbilled_ORDERS: null,
      days_OVERDUE: null,
      credit_LIMIT: null,
      balance: null,
      deposit_BALANCE: null,

      address_LINE1: null,
      address_LINE2: null,
      address_LINE3: null,
      address_LINE4: null,
      address_LINE5: null,
      address_POSTCODE: null,
      address_LATITUDE: null,
      address_LONGITUDE: null,
      location_ID: null,
      locations: [],
      telephone_NUMBER: null,
      telephone_ALTNUMBER: null,
      mobile_NUMBER: null,
      email: null,
      web_ADDRESS: null,

      iscashonlineonly: true,
      iscreditfacility: true,
      istemporaryaccount: true,
      issellonlycustompriceitems: true,
      isapplycustompricefirst: true,
      isfranchisee: true,
      iscashonly: true,
      isonlinepaymentonly: true,
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

  customerEdit() {
    this.disabled = false;
  }

  customerCancel() {
    this.disabled = true;
    if (this.customer.customer_ID == 0) {
      this.router.navigate(["/home/customers"], {});
    }
  }

  onChange(customerID) {
    for (var i = 0; i < this.customersAll.length; i++) {
      if (this.customersAll[i].customer_ID == customerID) {
        this.onCustomerChange.next(this.customersAll[i]);
        break;
      }
    }
  }

  setCustomer(response) {
    this.customerID = response.customer_ID;

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
  }

  setCustomers(response) {
    this.cancel.next();
    return response;
  }

  customerGet() {
    this.customerservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.customers = this.setCustomers(this.customerservice.getAllDetail(response));
          window.sessionStorage.setItem("customers", JSON.stringify(this.customers));
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
        } else {
          this.customersAll = this.setCustomers(this.customerservice.getAllDetail(response));
          window.sessionStorage.setItem("customersAll", JSON.stringify(this.customersAll));
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
        } else {
          this.setCustomer(this.customerservice.getDetail(response));
          if (this.address != null)
            this.address.locationsearchfilter.setLocation(this.customer.locations);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  customerAdd(customer) {
    if (this.person != null) {
      customer.person_ID = this.person.personID;
    }
    if (this.employee != null) {
      customer.salesrepemployee_ID = this.employee.employeeID;
    }
    if (this.taxcode != null) {
      customer.taxcode_ID = this.taxcode.taxcodeID;
    }
    if (this.currency != null) {
      customer.currency_ID = this.currency.currencyID;
    }
    if (this.hold != null) {
      customer.hold_ID = this.hold.holdID;
    }
    if (this.invoicetype != null) {
      customer.invoicetype_ID = this.invoicetype.invoicetypeID;
    }
    if (this.customerstatus != null) {
      customer.customerstatus_ID = this.customerstatus.customerstatusID;
    }
    if (this.pricelevel != null) {
      customer.pricelevel_ID = this.pricelevel.pricelevelID;
    }
    if (this.terms != null) {
      customer.terms_ID = this.terms.termsID;
    }
    if (this.customercategory != null) {
      customer.customercategory_ID = this.customercategory.customercategoryID;
    }
    if (this.businesstype != null) {
      customer.businesstype_ID = this.businesstype.businesstypeID;
    }
    if (this.businessmarketniche != null) {
      customer.businessmarketniche_ID = this.businessmarketniche.businessmarketnicheID;
    }
    if (this.creditterms != null) {
      customer.creditterms_ID = this.creditterms.credittermsID;
    }

    customer.location_ID = this.address.locationsearchfilter.locationID;
    customer.address_POSTCODE = this.address.addressPostCode;
    customer.address_LINE1 = this.address.addressLine1;
    customer.address_LINE2 = this.address.addressLine2;
    customer.address_LINE3 = this.address.addressLine3;
    customer.address_LINE4 = this.address.addressLine4;
    customer.address_LINE5 = this.address.addressLine5;
    customer.address_LATITUDE = this.address.addressLatitude;
    customer.address_LONGITUDE = this.address.addressLongitude;
    customer.telephone_NUMBER = this.address.telephoneNumber;
    customer.telephone_ALTNUMBER = this.address.telephoneAltNumber;
    customer.mobile_NUMBER = this.address.mobileNumber;
    customer.email = this.address.email;
    customer.web_ADDRESS = this.address.webAddress;

    customer.isactive = "Y";
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
    if (customer.iscashonlineonly == true) {
      customer.iscashonlineonly = "Y";
    } else {
      customer.iscashonlineonly = "N";
    }
    if (customer.iscreditfacility == true) {
      customer.iscreditfacility = "Y";
    } else {
      customer.iscreditfacility = "N";
    }
    if (customer.istemporaryaccount == true) {
      customer.istemporaryaccount = "Y";
    } else {
      customer.istemporaryaccount = "N";
    }
    if (customer.iscashonly == true) {
      customer.iscashonly = "Y";
    } else {
      customer.iscashonly = "N";
    }
    if (customer.isonlinepaymentonly == true) {
      customer.isonlinepaymentonly = "Y";
    } else {
      customer.isonlinepaymentonly = "N";
    }

    this.customerservice.add(customer).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.customer_ID) {
          this.toastrservice.success("Success", "New Customer Added");
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

  customerUpdate(customer) {
    if (this.person != null) {
      customer.person_ID = this.person.personID;
    }
    if (this.employee != null) {
      customer.salesrepemployee_ID = this.employee.employeeID;
    }
    if (this.taxcode != null) {
      customer.taxcode_ID = this.taxcode.taxcodeID;
    }
    if (this.currency != null) {
      customer.currency_ID = this.currency.currencyID;
    }
    if (this.hold != null) {
      customer.hold_ID = this.hold.holdID;
    }
    if (this.invoicetype != null) {
      customer.invoicetype_ID = this.invoicetype.invoicetypeID;
    }
    if (this.customerstatus != null) {
      customer.customerstatus_ID = this.customerstatus.customerstatusID;
    }
    if (this.pricelevel != null) {
      customer.pricelevel_ID = this.pricelevel.pricelevelID;
    }
    if (this.terms != null) {
      customer.terms_ID = this.terms.termsID;
    }
    if (this.customercategory != null) {
      customer.customercategory_ID = this.customercategory.customercategoryID;
    }
    if (this.businesstype != null) {
      customer.businesstype_ID = this.businesstype.businesstypeID;
    }
    if (this.businessmarketniche != null) {
      customer.businessmarketniche_ID = this.businessmarketniche.businessmarketnicheID;
    }
    if (this.creditterms != null) {
      customer.creditterms_ID = this.creditterms.credittermsID;
    }

    customer.location_ID = this.address.locationsearchfilter.locationID;
    customer.address_POSTCODE = this.address.addressPostCode;
    customer.address_LINE1 = this.address.addressLine1;
    customer.address_LINE2 = this.address.addressLine2;
    customer.address_LINE3 = this.address.addressLine3;
    customer.address_LINE4 = this.address.addressLine4;
    customer.address_LINE5 = this.address.addressLine5;
    customer.address_LATITUDE = this.address.addressLatitude;
    customer.address_LONGITUDE = this.address.addressLongitude;
    customer.telephone_NUMBER = this.address.telephoneNumber;
    customer.telephone_ALTNUMBER = this.address.telephoneAltNumber;
    customer.mobile_NUMBER = this.address.mobileNumber;
    customer.email = this.address.email;
    customer.web_ADDRESS = this.address.webAddress;

    customer.isactive = "Y";
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
    if (customer.iscashonlineonly == true) {
      customer.iscashonlineonly = "Y";
    } else {
      customer.iscashonlineonly = "N";
    }
    if (customer.iscreditfacility == true) {
      customer.iscreditfacility = "Y";
    } else {
      customer.iscreditfacility = "N";
    }
    if (customer.istemporaryaccount == true) {
      customer.istemporaryaccount = "Y";
    } else {
      customer.istemporaryaccount = "N";
    }
    if (customer.iscashonly == true) {
      customer.iscashonly = "Y";
    } else {
      customer.iscashonly = "N";
    }
    if (customer.isonlinepaymentonly == true) {
      customer.isonlinepaymentonly = "Y";
    } else {
      customer.isonlinepaymentonly = "N";
    }

    this.customerservice.update(customer, customer.customer_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.customer_ID) {
          this.toastrservice.success("Success", " Customer Updated");
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

  customerUpdateAll(customers) {
    this.customerservice.updateAll(customers).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Transport Route Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  customerSearch(str) {
    var search = {
      search: str
    }
    this.customerservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.customers = this.setCustomers(this.customerservice.getAllDetail(response));
          window.sessionStorage.setItem("customers", JSON.stringify(this.customers));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  customerSearchAll(str) {
    var search = {
      search: str
    }
    this.customerservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.customersAll = this.setCustomers(this.customerservice.getAllDetail(response));
          window.sessionStorage.setItem("customersAll", JSON.stringify(this.customersAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  customerAdvancedSearch(search) {
    this.personID = search.person_ID;
    this.customerID = search.customer_ID;
    this.taxcodeID = search.taxcode_ID;
    this.employeeID = search.employee_ID;

    this.currencyID = search.currency_ID;
    this.currencyCode = search.currency_CODE;
    this.holdID = search.holder_ID;
    this.holdCode = search.holder_CODE;
    this.invoicetypeID = search.invoicetype_ID;
    this.invoicetypeCode = search.invoicetype_CODE;
    this.customerstatusID = search.customerstatus_ID;
    this.customerstatusCode = search.customerstatus_CODE;
    this.pricelevelID = search.pricelevel_ID;
    this.pricelevelCode = search.pricelevel_CODE;
    this.termsID = search.terms_ID;
    this.termsCode = search.terms_CODE;
    this.customercategoryID = search.customercategory_ID;
    this.customercategoryCode = search.customercategory_CODE;
    this.businesstypeID = search.businesstype_ID;
    this.businesstypeCode = search.businesstype_CODE;
    this.businessmarketnicheID = search.businessmarketniche_ID;
    this.businessmarketnicheCode = search.businessmarketniche_CODE;
    this.credittermsID = search.creditterms_ID;
    this.credittermsCode = search.creditterms_CODE;

    this.customerservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.customers = this.setCustomers(this.customerservice.getAllDetail(response));
          window.sessionStorage.setItem("customers", JSON.stringify(this.customers));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  customerAdvancedSearchAll(search) {
    this.personID = search.person_ID;
    this.customerID = search.customer_ID;
    this.taxcodeID = search.taxcode_ID;
    this.employeeID = search.employee_ID;
    this.currencyID = search.currency_ID;
    this.currencyCode = search.currency_CODE;
    this.holdID = search.holder_ID;
    this.holdCode = search.holder_CODE;
    this.invoicetypeID = search.invoicetype_ID;
    this.invoicetypeCode = search.invoicetype_CODE;
    this.customerstatusID = search.customerstatus_ID;
    this.customerstatusCode = search.customerstatus_CODE;
    this.pricelevelID = search.pricelevel_ID;
    this.pricelevelCode = search.pricelevel_CODE;
    this.termsID = search.terms_ID;
    this.termsCode = search.terms_CODE;
    this.customercategoryID = search.customercategory_ID;
    this.customercategoryCode = search.customercategory_CODE;
    this.businesstypeID = search.businesstype_ID;
    this.businesstypeCode = search.businesstype_CODE;
    this.businessmarketnicheID = search.businessmarketniche_ID;
    this.businessmarketnicheCode = search.businessmarketniche_CODE;
    this.credittermsID = search.creditterms_ID;
    this.credittermsCode = search.creditterms_CODE;

    this.customerservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.customersAll = this.setCustomers(this.customerservice.getAllDetail(response));
          window.sessionStorage.setItem("customersAll", JSON.stringify(this.customersAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }
}
