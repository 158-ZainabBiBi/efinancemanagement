import { Injectable } from '@angular/core';
import { HttpCallServieService } from '../../../services/http-call-servie.service';
import { setting } from '../../../setting';
import { BankaccountService } from '../bankaccount/bankaccount.service';
@Injectable({
  providedIn: 'root'
})
export class BankreconciliationService {


  constructor(
    private _HttpCallServieService_: HttpCallServieService,
    private bankaccountservice: BankaccountService,
  ) { }


  get() {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "GET",
      request_URI: "bankreconciliation",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  getAll() {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "GET",
      request_URI: "bankreconciliation/all",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }


  getOne(id) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "GET",
      request_URI: "bankreconciliation/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  add(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "bankreconciliation",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  update(data, id) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "PUT",
      request_URI: "bankreconciliation/" + id,
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  updateAll(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "PUT",
      request_URI: "bankreconciliation",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  delete(id) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "DELETE",
      request_URI: "bankreconciliation/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  search(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "bankreconciliation/search",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  searchAll(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "bankreconciliation/search/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearch(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "bankreconciliation/advancedsearch",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearchAll(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "bankreconciliation/advancedsearch/all",
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
    if (response.bankaccount_DETAIL != null) {
      response.bankaccount = this.bankaccountservice.getDetail(JSON.parse(response.bankaccount_DETAIL));
      response.bankaccount_DETAIL = response.bankaccount.code + ' - ' + response.bankaccount.description;
    }

    if (response.status_DETAIL != null) {
      response.status = JSON.parse(response.status_DETAIL);
      response.status_DETAIL = response.status.code + ' - ' + response.status.description;
    }


    return (response);
  }

}
