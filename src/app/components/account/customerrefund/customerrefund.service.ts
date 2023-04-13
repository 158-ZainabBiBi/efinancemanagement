import { Injectable } from '@angular/core';
import { HttpCallServieService } from '../../../services/http-call-servie.service';
import { setting } from '../../../setting';

@Injectable({
  providedIn: 'root'
})
export class CustomerrefundService {


  constructor(
    private _HttpCallServieService_: HttpCallServieService
  ) { }


  get() {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "GET",
      request_URI: "customerrefund",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  getAll() {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "GET",
      request_URI: "customerrefund/all",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }


  getOne(id) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "GET",
      request_URI: "customerrefund/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  add(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "customerrefund",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  update(data, id) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "PUT",
      request_URI: "customerrefund/" + id,
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  delete(id) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "DELETE",
      request_URI: "customerrefund/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  search(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "customerrefund/search",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  searchAll(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "customerrefund/search/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearch(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "customerrefund/advancedsearch",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearchAll(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "customerrefund/advancedsearch/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  getAllDetail(response) {
    for (var a = 0; a < response.length; a++) {
      response[a].customer = JSON.parse(response[a].customer_DETAIL);
       response[a].customer_DETAIL = null;

      response[a].currency = JSON.parse(response[a].currency_DETAIL);
       response[a].currency_DETAIL = null;

       response[a].account = JSON.parse(response[a].account_DETAIL);
       response[a].account_DETAIL = null;

      response[a].refundmethod = JSON.parse(response[a].refundmethod_DETAIL);
      if (response[a].refundmethod != null)
        response[a].refundmethod_DETAIL = response[a].refundmethod.description;

      response[a].postingperiod = JSON.parse(response[a].postingperiod_DETAIL);
      if (response[a].postingperiod != null)
        response[a].postingperiod_DETAIL = response[a].postingperiod.description;
    }
    return (response);
  }

  getDetail(response) {

    response.customer = JSON.parse(response.customer_DETAIL);
      response.customer_DETAIL = null;

    response.account = JSON.parse(response.account_DETAIL);
      response.account_DETAIL = null;

    response.currency = JSON.parse(response.currency_DETAIL);
      response.currency_DETAIL = null;

    response.refundmethod = JSON.parse(response.refundmethod_DETAIL);
    if (response.refundmethod != null)
      response.refundmethod_DETAIL = response.refundmethod.description;

    response.postingperiod = JSON.parse(response.postingperiod_DETAIL);
    if (response.postingperiod != null)
      response.postingperiod_DETAIL = response.postingperiod.description;

    return (response);
  }

}
