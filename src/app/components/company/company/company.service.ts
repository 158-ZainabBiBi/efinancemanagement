import { Injectable } from '@angular/core';
import { HttpCallServieService } from '../../../services/http-call-servie.service';
import { setting } from 'src/app/setting';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  constructor(private _HttpCallServieService_: HttpCallServieService) { }

  get() {
    var postData = {
      service_NAME: setting.companyservice_NAME,
      request_TYPE: 'GET',
      request_URI: 'company',
      request_BODY: '',
    };
    return this._HttpCallServieService_.api(postData);
  }

  getAll() {
    var postData = {
      service_NAME: setting.companyservice_NAME,
      request_TYPE: 'GET',
      request_URI: 'company/all',
      request_BODY: '',
    };
    return this._HttpCallServieService_.api(postData);
  }

  getOne(id: string) {
    var postData = {
      service_NAME: setting.companyservice_NAME,
      request_TYPE: 'GET',
      request_URI: 'company/' + id,
      request_BODY: '',
    };
    return this._HttpCallServieService_.api(postData);
  }

  add(data: any) {
    var postData = {
      service_NAME: setting.companyservice_NAME,
      request_TYPE: 'POST',
      request_URI: 'company',
      request_BODY: JSON.stringify(data),
    };
    return this._HttpCallServieService_.api(postData);
  }

  update(data: any, id: string) {
    var postData = {
      service_NAME: setting.companyservice_NAME,
      request_TYPE: 'PUT',
      request_URI: 'company/' + id,
      request_BODY: JSON.stringify(data),
    };
    return this._HttpCallServieService_.api(postData);
  }

  updateAll(data: any) {
    var postData = {
      service_NAME: setting.companyservice_NAME,
      request_TYPE: 'PUT',
      request_URI: 'company',
      request_BODY: JSON.stringify(data),
    };
    return this._HttpCallServieService_.api(postData);
  }

  delete(id: string) {
    var postData = {
      service_NAME: setting.companyservice_NAME,
      request_TYPE: 'DELETE',
      request_URI: 'company/' + id,
      request_BODY: '',
    };
    return this._HttpCallServieService_.api(postData);
  }

  search(data: any) {
    var postData = {
      service_NAME: setting.companyservice_NAME,
      request_TYPE: 'POST',
      request_URI: 'company/search',
      request_BODY: JSON.stringify(data),
    };
    return this._HttpCallServieService_.api(postData);
  }

  searchAll(data: any) {
    var postData = {
      service_NAME: setting.companyservice_NAME,
      request_TYPE: 'POST',
      request_URI: 'company/search/all',
      request_BODY: JSON.stringify(data),
    };
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearch(data: any) {
    var postData = {
      service_NAME: setting.companyservice_NAME,
      request_TYPE: 'POST',
      request_URI: 'company/advancedsearch',
      request_BODY: JSON.stringify(data),
    };
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearchAll(data: any) {
    var postData = {
      service_NAME: setting.companyservice_NAME,
      request_TYPE: 'POST',
      request_URI: 'company/advancedsearch/all',
      request_BODY: JSON.stringify(data),
    };
    return this._HttpCallServieService_.api(postData);
  }

  getAllDetail(response) {
    for (var a = 0; a < response.length; a++) {
      response[a] = this.getDetail(response[a]);
    }
    return (response);
  }


  getDetail(response) {

    return (response);
  }
}
