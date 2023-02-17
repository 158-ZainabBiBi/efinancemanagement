import { Injectable } from '@angular/core';
import { HttpCallServieService } from '../../../services/http-call-servie.service';
import { setting } from '../../../setting';

@Injectable({
  providedIn: 'root'
})
export class ReturnauthService {


  constructor(
    private _HttpCallServieService_: HttpCallServieService
  ) { }


  get() {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "GET",
      request_URI: "returnauth",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  getAll() {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "GET",
      request_URI: "returnauth/all",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }


  getOne(id) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "GET",
      request_URI: "returnauth/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  add(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "returnauth",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  update(data, id) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "PUT",
      request_URI: "returnauth/" + id,
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  delete(id) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "DELETE",
      request_URI: "returnauth/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  search(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "returnauth/search",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  searchAll(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "returnauth/search/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearch(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "returnauth/advancedsearch",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearchAll(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "returnauth/advancedsearch/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  getAllDetail(response) {
    for (var a = 0; a < response.length; a++) {
      response[a].customer = JSON.parse(response[a].customer_DETAIL);
       response[a].customer_DETAIL = null;

      response[a].customerrefund = JSON.parse(response[a].customerrefund_DETAIL);
       response[a].customerrefund_DETAIL = null;

      response[a].currency = JSON.parse(response[a].currency_DETAIL);
       response[a].currency_DETAIL = null;

       response[a].product = JSON.parse(response[a].product_DETAIL);
       response[a].product_DETAIL = null;

      response[a].returnstatus = JSON.parse(response[a].returnstatus_DETAIL);
      if (response[a].returnstatus != null)
        response[a].returnstatus_DETAIL = response[a].returnstatus.description;

      response[a].saleordertype = JSON.parse(response[a].saleordertype_DETAIL);
      if (response[a].saleordertype != null)
        response[a].saleordertype_DETAIL = response[a].saleordertype.description;
    }
    return (response);
  }

  getDetail(response) {

    response.customer = JSON.parse(response.customer_DETAIL);
      response.customer_DETAIL = null;

    response.customerrefund = JSON.parse(response.customerrefund_DETAIL);
      response.customerrefund_DETAIL = null;

    response.product = JSON.parse(response.product_DETAIL);
      response.product_DETAIL = null;

    response.currency = JSON.parse(response.currency_DETAIL);
      response.currency_DETAIL = null;

    response.returnstatus = JSON.parse(response.returnstatus_DETAIL);
    if (response.returnstatus != null)
      response.returnstatus_DETAIL = response.returnstatus.description;

    response.saleordertype = JSON.parse(response.saleordertype_DETAIL);
    if (response.saleordertype != null)
      response.saleordertype_DETAIL = response.saleordertype.description;

    return (response);
  }

}
