import { Injectable } from "@angular/core";
import { HttpCallServieService } from "src/app/services/http-call-servie.service";
import { PersonService } from '../../person/person/person.service';

import { setting } from "src/app/setting";
import { CompanyService } from "../../company/company/company.service";

@Injectable({
  providedIn: "root"
})
export class EmployeeService {
  constructor(
    private _HttpCallServieService_: HttpCallServieService,
    private personservice: PersonService,
    private companyservice: CompanyService,
  ) { }

  get() {
    var postData = {
      service_NAME: setting.employeeservice_NAME,
      request_TYPE: "GET",
      request_URI: "employee",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  getAll() {
    var postData = {
      service_NAME: setting.employeeservice_NAME,
      request_TYPE: "GET",
      request_URI: "employee/all",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  getOne(id) {
    var postData = {
      service_NAME: setting.employeeservice_NAME,
      request_TYPE: "GET",
      request_URI: "employee/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  add(data) {
    var postData = {
      service_NAME: setting.employeeservice_NAME,
      request_TYPE: "POST",
      request_URI: "employee",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  update(data, id) {
    var postData = {
      service_NAME: setting.employeeservice_NAME,
      request_TYPE: "PUT",
      request_URI: "employee/" + id,
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  updateAll(data) {
    var postData = {
      service_NAME: setting.employeeservice_NAME,
      request_TYPE: "PUT",
      request_URI: "employee",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  delete(id) {
    var postData = {
      service_NAME: setting.employeeservice_NAME,
      request_TYPE: "DELETE",
      request_URI: "employee/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  search(data) {
    var postData = {
      service_NAME: setting.employeeservice_NAME,
      request_TYPE: "POST",
      request_URI: "employee/search",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  searchAll(data) {
    var postData = {
      service_NAME: setting.employeeservice_NAME,
      request_TYPE: "POST",
      request_URI: "employee/search/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearch(data) {
    var postData = {
      service_NAME: setting.employeeservice_NAME,
      request_TYPE: "POST",
      request_URI: "employee/advancedsearch",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearchAll(data) {
    var postData = {
      service_NAME: setting.employeeservice_NAME,
      request_TYPE: "POST",
      request_URI: "employee/advancedsearch/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  getTitle() {
    return this._HttpCallServieService_.getTitle();
  }

  getAllDetail(response) {
    for (var a = 0; a < response.length; a++) {
      response[a] = this.getDetail(response[a]);
    }
    return (response);
  }

  getDetail(response) {
    if (response.person_DETAIL != null) {
      response.person = this.personservice.getDetail(JSON.parse(response.person_DETAIL));
      response.person_DETAIL = response.person.title + " " + response.person.forenames + " " + response.person.surname;
    }

    if (response.company_DETAIL != null) {
      response.company = this.companyservice.getDetail(JSON.parse(response.company_DETAIL));
      response.company_DETAIL = response.company.company_NAME;
    }
    return (response);
  }
}
