import { Injectable } from '@angular/core';
import { HttpCallServieService } from '../../../services/http-call-servie.service';
import { setting } from '../../../setting';

@Injectable({
  providedIn: 'root'
})
export class AccountService {


  constructor(
    private _HttpCallServieService_: HttpCallServieService
  ) { }


  get() {
    var postData = {
      service_NAME: setting.financeservice_NAME,
      request_TYPE: "GET",
      request_URI: "account",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  getAll() {
    var postData = {
      service_NAME: setting.financeservice_NAME,
      request_TYPE: "GET",
      request_URI: "account/all",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }


  getOne(id) {
    var postData = {
      service_NAME: setting.financeservice_NAME,
      request_TYPE: "GET",
      request_URI: "account/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  add(data) {
    var postData = {
      service_NAME: setting.financeservice_NAME,
      request_TYPE: "POST",
      request_URI: "account",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  update(data, id) {
    var postData = {
      service_NAME: setting.financeservice_NAME,
      request_TYPE: "PUT",
      request_URI: "account/" + id,
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  delete(id) {
    var postData = {
      service_NAME: setting.financeservice_NAME,
      request_TYPE: "DELETE",
      request_URI: "account/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  search(data) {
    var postData = {
      service_NAME: setting.financeservice_NAME,
      request_TYPE: "POST",
      request_URI: "account/search",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  searchAll(data) {
    var postData = {
      service_NAME: setting.financeservice_NAME,
      request_TYPE: "POST",
      request_URI: "account/search/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearch(data) {
    var postData = {
      service_NAME: setting.financeservice_NAME,
      request_TYPE: "POST",
      request_URI: "account/advancedsearch",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearchAll(data) {
    var postData = {
      service_NAME: setting.financeservice_NAME,
      request_TYPE: "POST",
      request_URI: "account/advancedsearch/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  getAllDetail(response) {
    for (var a = 0; a < response.length; a++) {
      response[a].accounttype = JSON.parse(response[a].accounttype_DETAIL);
       response[a].accounttype_DETAIL = null;

      response[a].cashflowratetype = JSON.parse(response[a].cashflowratetype_DETAIL);
      if (response[a].cashflowratetype != null)
        response[a].cashflowratetype_DETAIL = response[a].cashflowratetype.description;

      response[a].generalratetype = JSON.parse(response[a].generalratetype_DETAIL);
      if (response[a].generalratetype != null)
        response[a].generalratetype_DETAIL = response[a].generalratetype.code + ' - ' + response[a].generalratetype.description;

    }
    return (response);
  }

  getDetail(response) {

    response.accounttype = JSON.parse(response.accounttype_DETAIL);
      response.accounttype_DETAIL = null;

    response.cashflowratetype = JSON.parse(response.cashflowratetype_DETAIL);
    if (response.cashflowratetype != null)
      response.cashflowratetype_DETAIL = response.cashflowratetype.description;

    response.generalratetype = JSON.parse(response.generalratetype_DETAIL);
    if (response.generalratetype != null)
      response.generalratetype_DETAIL = response.generalratetype.code + ' - ' + response.generalratetype.description;

    return (response);
  }


}
