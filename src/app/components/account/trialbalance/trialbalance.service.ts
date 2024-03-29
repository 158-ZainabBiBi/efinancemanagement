import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpCallServieService } from 'src/app/services/http-call-servie.service';
import { setting } from 'src/app/setting';

import { LedgerService } from '../ledger/ledger.service';

@Injectable({
  providedIn: 'root'
})
export class TrialbalanceService {
  private sendEmailUrl = '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';

  constructor(
    private _HttpCallServieService_: HttpCallServieService,
    private ledgerservice: LedgerService,
    private http: HttpClient,
  ) { }

  get() {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "GET",
      request_URI: "trialbalance",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  getAll() {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "GET",
      request_URI: "trialbalance/all",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }


  getOne(id) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "GET",
      request_URI: "trialbalance/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  add(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "trialbalance",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  update(data, id) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "PUT",
      request_URI: "trialbalance/" + id,
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  updateAll(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "PUT",
      request_URI: "trialbalance",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  delete(id) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "DELETE",
      request_URI: "trialbalance/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  search(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "trialbalance/search",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  searchAll(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "trialbalance/search/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearch(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "trialbalance/advancedsearch",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearchAll(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "trialbalance/advancedsearch/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  sendEmail(pdfBlob: Blob) {
    const formData = new FormData();
    formData.append('file', pdfBlob, 'sample.pdf');
    formData.append('to', 'recipient@example.com');
    formData.append('subject', 'Email Subject');
    formData.append('text', 'Email Text');

    return this.http.post(this.sendEmailUrl, formData);
  }

  getAllDetail(response) {
    for (var a = 0; a < response.length; a++) {
      response[a] = this.getDetail(response[a]);
    }
    return (response);
  }

  getDetail(response) {
    if (response.ledger_DETAIL != null) {
      response.ledger = this.ledgerservice.getDetail(JSON.parse(response.ledger_DETAIL));
      response.ledger_DETAIL = response.ledger.journal_DETAIL;
    }

    return (response);
  }

}
