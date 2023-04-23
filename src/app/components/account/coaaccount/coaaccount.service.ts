import { Injectable } from '@angular/core';
import { HttpCallServieService } from '../../../services/http-call-servie.service';
import { setting } from '../../../setting';
import { AccountService } from '../account/account.service';
import { LedgeraccounttypeService } from '../ledgeraccounttype/ledgeraccounttype.service';

@Injectable({
  providedIn: 'root'
})
export class CoaaccountService {

  constructor(
    private _HttpCallServieService_: HttpCallServieService,
    private ledgeraccounttypeservice: LedgeraccounttypeService,
    private accountservice: AccountService,
  ) { }


  get() {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "GET",
      request_URI: "coaaccount",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  getAll() {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "GET",
      request_URI: "coaaccount/all",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }


  getOne(id) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "GET",
      request_URI: "coaaccount/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  add(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "coaaccount",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  update(data, id) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "PUT",
      request_URI: "coaaccount/" + id,
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  updateAll(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "PUT",
      request_URI: "coaaccount",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  delete(id) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "DELETE",
      request_URI: "coaaccount/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  search(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "coaaccount/search",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  searchAll(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "coaaccount/search/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearch(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "coaaccount/advancedsearch",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearchAll(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "coaaccount/advancedsearch/all",
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
    if (response.ledgeraccounttype_DETAIL != null) {
      response.ledgeraccounttype = this.ledgeraccounttypeservice.getDetail(JSON.parse(response.ledgeraccounttype_DETAIL));
      response.ledgeraccounttype_DETAIL = null
    }

    if (response.ledgeraccountgroup_DETAIL != null) {
      response.ledgeraccountgroup = JSON.parse(response.ledgeraccountgroup_DETAIL);
      response.ledgeraccountgroup_DETAIL = response.ledgeraccountgroup.code + ' - ' + response.ledgeraccountgroup.description;
    }

    if (response.ledgeraccountclassification_DETAIL != null) {
      response.ledgeraccountclassification = JSON.parse(response.ledgeraccountclassification_DETAIL);
      response.ledgeraccountclassification_DETAIL = response.ledgeraccountclassification.code + ' - ' + response.ledgeraccountclassification.description;
    }

    return (response);
  }

}
