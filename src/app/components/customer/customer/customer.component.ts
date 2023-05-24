import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { PersonComponent } from '../../person/person/person.component';
import { AddressComponent } from '../../common/address/address.component';
import { CustomerService } from './customer.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  @ViewChild("address") address: AddressComponent;
  @ViewChild("person") person: PersonComponent;


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
  personID = null;
  @Input()
  addressID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onCustomerChange = new EventEmitter();

  customers = [];
  customersAll = [];
  customer = {
    customer_ID: 0,

    customer_NAME: null,
    customer_CODE: null,
    person_ID: null,

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

    isactive: true
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

  load(reload): void {
    if (this.view == 0) {
      this.customer = JSON.parse(window.sessionStorage.getItem('customerdetail'));
      this.disabled = true;
    }

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
      person_ID: this.personID,
      address_ID: this.addressID,
    }
    if (this.view >= 5 && this.view <= 6 && this.customerID) {
      window.sessionStorage.setItem("customer", this.customerID);
      this.customerGetOne(this.customerID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.customers == null ||
      this.customers.length == 0 || reload == true)) {
      this.customers == null;
      this.customerAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.customersAll == null ||
      this.customers.length == 0 || reload == true)) {
      this.customersAll == null;
      this.customerAdvancedSearchAll(search);
    } else if (this.view == 7 || (this.view >= 11 && this.view <= 29)) {
      this.customerID = null;
      this.customersAll = null;
      this.customers = null;
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

      customer_NAME: null,
      customer_CODE: null,
      person_ID: null,

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

  customerEdit() {
    this.disabled = false;
  }

  customerCancel() {
    this.disabled = true;
    if (this.customer.customer_ID == 0) {
      this.router.navigate(["/home/customers"], {});
    }
  }

  reset() {
    this.add();
  }

  onChange(customer) {
    this.onCustomerChange.next(customer);
  }

  // onChange(customerID) {
  //   for (var i = 0; i < this.customersAll.length; i++) {
  //     if (this.customersAll[i].customer_ID == customerID) {
  //       this.onCustomerChange.next(this.customersAll[i]);
  //       break;
  //     }
  //   }
  // }

  addShop() {
    this.router.navigate(["/home/customershop"], {});
  }

  setCustomer(response) {
    this.disabled = true;
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }

    this.customer = response;
    window.sessionStorage.setItem("customer", this.customerID);
    window.sessionStorage.setItem("customerdetail", JSON.stringify(this.customer));
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

    if (customer.isactive == true) {
      customer.isactive = "Y";
    } else {
      customer.isactive = "N";
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
