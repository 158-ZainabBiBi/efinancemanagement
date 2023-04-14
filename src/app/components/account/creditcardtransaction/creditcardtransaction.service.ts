import { Injectable } from '@angular/core';
import { HttpCallServieService } from '../../../services/http-call-servie.service';
import { setting } from '../../../setting';
import { CustomerService } from '../../customer/customer/customer.service';

@Injectable({
  providedIn: 'root'
})
export class CreditcardtransactionService {

  constructor(
    private _HttpCallServieService_: HttpCallServieService,
    private customerservice: CustomerService,
  ) { }


  get() {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "GET",
      request_URI: "creditcardtransaction",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  getAll() {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "GET",
      request_URI: "creditcardtransaction/all",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }


  getOne(id) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "GET",
      request_URI: "creditcardtransaction/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  add(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "creditcardtransaction",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  update(data, id) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "PUT",
      request_URI: "creditcardtransaction/" + id,
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  updateAll(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "PUT",
      request_URI: "creditcardtransaction",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }


  delete(id) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "DELETE",
      request_URI: "creditcardtransaction/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  search(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "creditcardtransaction/search",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  searchAll(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "creditcardtransaction/search/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearch(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "creditcardtransaction/advancedsearch",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearchAll(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "creditcardtransaction/advancedsearch/all",
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
    if (response.customer_DETAIL != null) {
      response.customer = this.customerservice.getDetail(JSON.parse(response.customer_DETAIL));
      response.customer_DETAIL = null
    }

    if (response.cardtype_DETAIL != null) {
      response.cardtype = JSON.parse(response.cardtype_DETAIL);
      response.cardtype_DETAIL = response.cardtype.code + ' - ' + response.cardtype.description;
    }

    return (response);
  }

}
