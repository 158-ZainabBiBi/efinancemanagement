import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { CustomerComponent } from '../../../components/customer/customer/customer.component'
import { CustomerService } from '../../../components/customer/customer/customer.service';
import { ActivatedRoute, Router, RouterLinkWithHref } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  @ViewChild("customers") customers: CustomerComponent;
  @ViewChild("addcustomer") addcustomer: CustomerComponent;
  @ViewChild("editcustomer") editcustomer: CustomerComponent;
  customerID = 0;
  constructor(
    private customerservice: CustomerService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
    private route: ActivatedRoute,

  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.customer) {
        this.customerID = params.customer;
      }
    });
  }

  view() {
  }

  refresh() {
    this.customers.ngOnInit();
    this.cancel();
  }

  show(row) {
    this.router.navigate(["/home/customer"], { queryParams: { customer: row.data.customer_ID } });
  }

  addNew() {
    // this.router.navigate(["/home/customer"], {});
    this.addcustomer.add();
    $("#add").modal("show");
  }

  edit(row) {
    this.editcustomer.customer = {
      customer_ID: row.data.customer_ID,
      person_ID: row.data.person_ID,
      taxcode_ID: row.data.taxcode_ID,
      location_ID: row.data.location_ID,
      customer_NAME: row.data.customer_NAME,
      customer_CODE: row.data.customer_CODE,
      web_ADDRESS: row.data.web_ADDRESS,
      telephone_NUMBER: row.data.telephone_NUMBER,
      telephone_ALTNUMBER: row.data.telephone_ALTNUMBER,
      mobile_NUMBER: row.data.mobile_NUMBER,
      email: row.data.email,
      address_LINE1: row.data.address_LINE1,
      address_LINE2: row.data.address_LINE2,
      address_LINE3: row.data.address_LINE3,
      address_LINE4: row.data.address_LINE4,
      address_LINE5: row.data.address_LINE5,
      address_POSTCODE: row.data.address_POSTCODE,
      address_LATITUDE: row.data.address_LATITUDE,
      address_LONGITUDE: row.data.address_LONGITUDE,
      locations: [],
      isactive: row.data.isactive
    };
    if (row.data.isactive == "Y") {
      this.editcustomer.customer.isactive = true;
    } else {
      this.editcustomer.customer.isactive = false;
    }
    $("#edit").modal("show");
  }

  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }
}
