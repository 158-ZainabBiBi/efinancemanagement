import { Injectable } from '@angular/core';
import { HttpCallServieService } from '../../../services/http-call-servie.service';
import { setting } from '../../../setting';
import { AccountService } from '../account/account.service';
import { LedgeraccountService } from '../ledgeraccount/ledgeraccount.service';
import { CustomerService } from '../../customer/customer/customer.service';
import { LocationService } from '../../location/location/location.service';

@Injectable({
  providedIn: 'root'
})
export class BankaccountService {

  constructor(
    private _HttpCallServieService_: HttpCallServieService,
    private accountservice: AccountService,
    private ledgeraccountservice: LedgeraccountService,
    private customerservice: CustomerService,
    private locationservice: LocationService
  ) { }


  get() {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "GET",
      request_URI: "bankaccount",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  getAll() {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "GET",
      request_URI: "bankaccount/all",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }


  getOne(id) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "GET",
      request_URI: "bankaccount/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  add(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "bankaccount",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  update(data, id) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "PUT",
      request_URI: "bankaccount/" + id,
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  updateAll(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "PUT",
      request_URI: "bankaccount",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  delete(id) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "DELETE",
      request_URI: "bankaccount/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  search(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "bankaccount/search",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  searchAll(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "bankaccount/search/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearch(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "bankaccount/advancedsearch",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearchAll(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "bankaccount/advancedsearch/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  getAllDetail(response) {
    for (var a = 0; a < response.length; a++) {
      response[a] = this.getDetail(response[a]);
    }
    return (response);
  }

  getDetail(response) {
    if (response.account_DETAIL != null) {
      response.account = this.accountservice.getDetail(JSON.parse(response.account_DETAIL));
      response.account_DETAIL = null
    }

    if (response.ledgeraccount_DETAIL != null) {
      response.ledgeraccount = this.ledgeraccountservice.getDetail(JSON.parse(response.ledgeraccount_DETAIL));
      response.ledgeraccount_DETAIL = null;
    }

    if (response.customer_DETAIL != null) {
      response.customer = this.customerservice.getDetail(JSON.parse(response.customer_DETAIL));
      response.customer_DETAIL = null;
    }

    if (response.location_DETAIL != null) {
      response.location = this.locationservice.getDetail(JSON.parse(response.location_DETAIL));
      response.locations = [];
      response.location_DETAIL = null;
      while (response.location.locationparent_ID != null) {
        response.address = response.address + ", " + response.location.location_NAME;
        response.locations.push(response.location);
        response.location = response.location.locationparent_ID;
      }
      response.locations.push(response.location);
    }

    if (response.bankaccounttype_DETAIL != null) {
      response.bankaccounttype = JSON.parse(response.bankaccounttype_DETAIL);
      response.bankaccounttype_DETAIL = response.bankaccounttype.description;
    }

    if (response.paymentmethod_DETAIL != null) {
      response.paymentmethod = JSON.parse(response.paymentmethod_DETAIL);
      response.paymentmethod_DETAIL = response.paymentmethod.description;
    }

    return (response);
  }

}
