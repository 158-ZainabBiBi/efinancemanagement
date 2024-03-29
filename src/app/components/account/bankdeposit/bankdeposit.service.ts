import { Injectable } from '@angular/core';
import { HttpCallServieService } from 'src/app/services/http-call-servie.service';
import { setting } from 'src/app/setting';
import { BankaccountService } from '../bankaccount/bankaccount.service';
import { TransactionService } from '../transaction/transaction.service';

@Injectable({
  providedIn: 'root'
})
export class BankdepositService {

  constructor(
    private _HttpCallServieService_: HttpCallServieService,
    private bankaccountservice: BankaccountService,
    private transactionservice: TransactionService
  ) { }


  get() {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "GET",
      request_URI: "bankdeposit",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  getAll() {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "GET",
      request_URI: "bankdeposit/all",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }


  getOne(id) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "GET",
      request_URI: "bankdeposit/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  add(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "bankdeposit",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  update(data, id) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "PUT",
      request_URI: "bankdeposit/" + id,
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  updateAll(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "PUT",
      request_URI: "bankdeposit",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  delete(id) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "DELETE",
      request_URI: "bankdeposit/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  search(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "bankdeposit/search",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  searchAll(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "bankdeposit/search/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearch(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "bankdeposit/advancedsearch",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearchAll(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "bankdeposit/advancedsearch/all",
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
    if (response.frombankaccount_DETAIL != null) {
      response.frombankaccount = this.bankaccountservice.getDetail(JSON.parse(response.frombankaccount_DETAIL));
      response.frombankaccount_DETAIL = response.frombankaccount.bankaccount_NUMBER;
    }

    if (response.tobankaccount_DETAIL != null) {
      response.tobankaccount = this.bankaccountservice.getDetail(JSON.parse(response.tobankaccount_DETAIL));
      response.tobankaccount_DETAIL = response.tobankaccount.bankaccount_NUMBER;
    }

    if (response.transaction_DETAIL != null) {
      response.transaction = this.transactionservice.getDetail(JSON.parse(response.transaction_DETAIL));
      response.transaction_DETAIL = response.transaction.transaction_DATE;
    }

    return (response);
  }

}
