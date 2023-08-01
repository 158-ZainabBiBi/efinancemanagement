import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { CustomerComponent } from 'src/app/components/customer/customer/customer.component';
import { CustomerService } from 'src/app/components/customer/customer/customer.service';
import { Router } from '@angular/router';

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

  constructor(
    private customerservice: CustomerService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
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
    this.router.navigate(["/home/customer"], {});
    // this.addcustomer.add();
    // $("#add").modal("show");
  }

  edit(row) {
    this.editcustomer.customer = {
      customer_ID: row.data.customer_ID,
      sage_ID: row.data.sage_ID,
      person_ID: row.data.person_ID,
      taxcode_ID: row.data.taxcode_ID,
      currency_ID: row.data.currency_ID,
      hold_ID: row.data.hold_ID,
      location_ID: row.data.location_ID,
      invoicetype_ID: row.data.invoicetype_ID,
      customerstatus_ID: row.data.customerstatus_ID,
      pricelevel_ID: row.data.pricelevel_ID,
      terms_ID: row.data.terms_ID,
      customercategory_ID: row.data.customercategory_ID,
      businesstype_ID: row.data.businesstype_ID,
      businessmarketniche_ID: row.data.businessmarketniche_ID,
      creditterms_ID: row.data.creditterms_ID,
      salesrepemployee_ID: row.data.salesrepemployee_ID,
      netsuite_ID: row.data.netsuite_ID,
      quickbook_ID: row.data.quickbook_ID,
      defaultreceivablesaccout_ID: row.data.defaultreceivablesaccout_ID,
      customer_NAME: row.data.customer_NAME,
      customer_CODE: row.data.customer_CODE,
      customer_NEWCODE: row.data.customer_NEWCODE,
      web_ADDRESS: row.data.web_ADDRESS,
      defaultorder_PRIORITY: row.data.defaultorder_PRIORITY,
      comments: row.data.comments,
      origin_CODE: row.data.origin_CODE,
      delivery_INSTRUCTIONS: row.data.delivery_INSTRUCTIONS,
      opening_HOURS: row.data.opening_HOURS,
      closing_HOURS: row.data.closing_HOURS,
      account: row.data.account,
      start_DATE: row.data.start_DATE,
      end_DATE: row.data.end_DATE,
      taxreg_NUMBER: row.data.taxreg_NUMBER,
      resale_NUMBER: row.data.resale_NUMBER,
      overdue_BALANCE: row.data.overdue_BALANCE,
      unbilled_ORDERS: row.data.unbilled_ORDERS,
      days_OVERDUE: row.data.days_OVERDUE,
      hold_REASON: row.data.hold_REASON,
      telephone_NUMBER: row.data.telephone_NUMBER,
      telephone_ALTNUMBER: row.data.telephone_ALTNUMBER,
      mobile_NUMBER: row.data.mobile_NUMBER,
      email: row.data.email,
      credit_LIMIT: row.data.credit_LIMIT,
      balance: row.data.balance,
      deposit_BALANCE: row.data.deposit_BALANCE,
      address_LINE1: row.data.address_LINE1,
      address_LINE2: row.data.address_LINE2,
      address_LINE3: row.data.address_LINE3,
      address_LINE4: row.data.address_LINE4,
      address_LINE5: row.data.address_LINE5,
      address_POSTCODE: row.data.address_POSTCODE,
      address_LATITUDE: row.data.address_LATITUDE,
      address_LONGITUDE: row.data.address_LONGITUDE,
      locations: [],
      iscashonlineonly: row.data.iscashonlineonly,
      iscreditfacility: row.data.iscreditfacility,
      istemporaryaccount: row.data.istemporaryaccount,
      issellonlycustompriceitems: row.data.issellonlycustompriceitems,
      isapplycustompricefirst: row.data.isapplycustompricefirst,
      isfranchisee: row.data.isfranchisee,
      iscashonly: row.data.iscashonly,
      isonlinepaymentonly: row.data.isonlinepaymentonly,
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

  advancedSearch(search) {
    this.customers.customerAdvancedSearch(search);
  }
}
