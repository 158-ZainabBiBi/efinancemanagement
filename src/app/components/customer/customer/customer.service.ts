import { Injectable } from '@angular/core';
import { HttpCallServieService } from '../../../services/http-call-servie.service';
import { setting } from '../../../setting';
import { CompanyService } from '../../company/company/company.service';
import { TaxcodeService } from '../../finance/taxcode/taxcode.service';
import { PersonService } from '../../person/person/person.service';
import { LocationService } from '../../location/location/location.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  constructor(
    private _HttpCallServieService_: HttpCallServieService,
    private taxcodeservice: TaxcodeService,
    private companyservice: CompanyService,
    private personservice: PersonService,
    private locationservice: LocationService
  ) { }

  get() {
    var postData = {
      service_NAME: setting.customerservice_NAME,
      request_TYPE: "GET",
      request_URI: "customer",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  getAll() {
    var postData = {
      service_NAME: setting.customerservice_NAME,
      request_TYPE: "GET",
      request_URI: "customer/all",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }


  getOne(id) {
    var postData = {
      service_NAME: setting.customerservice_NAME,
      request_TYPE: "GET",
      request_URI: "customer/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  add(data) {
    var postData = {
      service_NAME: setting.customerservice_NAME,
      request_TYPE: "POST",
      request_URI: "customer",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  update(data, id) {
    var postData = {
      service_NAME: setting.customerservice_NAME,
      request_TYPE: "PUT",
      request_URI: "customer/" + id,
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  updateAll(data) {
    var postData = {
      service_NAME: setting.customerservice_NAME,
      request_TYPE: "PUT",
      request_URI: "customer",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  delete(id) {
    var postData = {
      service_NAME: setting.customerservice_NAME,
      request_TYPE: "DELETE",
      request_URI: "customer/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  search(data) {
    var postData = {
      service_NAME: setting.customerservice_NAME,
      request_TYPE: "POST",
      request_URI: "customer/search",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  searchAll(data) {
    var postData = {
      service_NAME: setting.customerservice_NAME,
      request_TYPE: "POST",
      request_URI: "customer/search/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearch(data) {
    var postData = {
      service_NAME: setting.customerservice_NAME,
      request_TYPE: "POST",
      request_URI: "customer/advancedsearch",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearchAll(data) {
    var postData = {
      service_NAME: setting.customerservice_NAME,
      request_TYPE: "POST",
      request_URI: "customer/advancedsearch/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  creditcheck(id) {
    var postData = {
      service_NAME: setting.customerservice_NAME,
      request_TYPE: 'GET',
      request_URI: 'customer/creditcheck/' + id,
      request_BODY: '',
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

    if (response.taxcode_DETAIL != null) {
      response.taxcode = this.taxcodeservice.getDetail(JSON.parse(response.taxcode_DETAIL));
      response.taxcode_DETAIL = null
    }

    if (response.company_DETAIL != null) {
      response.company = this.companyservice.getDetail(JSON.parse(response.company_DETAIL));
      response.company_DETAIL = null
    }

    if (response.person_DETAIL != null) {
      response.person = this.personservice.getDetail(JSON.parse(response.person_DETAIL));
      response.person_DETAIL = response.person.title + " " + response.person.forenames + " " + response.person.surname;
    }

    if (response.salesrepemployee_DETAIL != null) {
      response.salesrepemployee = JSON.parse(response.salesrepemployee_DETAIL);
      response.salesrepemployee_DETAIL = null;
    }

    if (response.customercategory_DETAIL != null) {
      response.customercategory = JSON.parse(response.customercategory_DETAIL);
      response.customercategory_DETAIL = null;
    }

    if (response.customerstatus_DETAIL != null) {
      response.customerstatus = JSON.parse(response.customerstatus_DETAIL);
      response.customerstatus_DETAIL = null;
    }

    if (response.currency_DETAIL != null) {
      response.currency = JSON.parse(response.currency_DETAIL);
      response.currency_DETAIL = null;
    }

    if (response.businesstype_DETAIL != null) {
      response.businesstype = JSON.parse(response.businesstype_DETAIL);
      response.businesstype_DETAIL = null;
    }

    if (response.businessmarketniche_DETAIL != null) {
      response.businessmarketniche = JSON.parse(response.businessmarketniche_DETAIL);
      response.businessmarketniche_DETAIL = null;
    }

    if (response.invoicetype_DETAIL != null) {
      response.invoicetype = JSON.parse(response.invoicetype_DETAIL);
      response.invoicetype_DETAIL = null;
    }

    if (response.pricelevel_DETAIL != null) {
      response.pricelevel = JSON.parse(response.pricelevel_DETAIL);
      response.pricelevel_DETAIL = null;
    }

    if (response.terms_DETAIL != null) {
      response.terms = JSON.parse(response.terms_DETAIL);
      response.terms_DETAIL = null;
    }

    if (response.creditterms_DETAIL != null) {
      response.creditterms = JSON.parse(response.creditterms_DETAIL);
      response.creditterms_DETAIL = null;
    }

    if (response.hold_DETAIL != null) {
      response.hold = JSON.parse(response.hold_DETAIL);
      response.hold_DETAIL = null;
    }

    if (response.location_DETAIL != null) {
      response.location = this.locationservice.getDetail(JSON.parse(response.location_DETAIL));
      response.address = response.address_LINE1;
      if (response.address_LINE2 != null && response.address_LINE2 != '')
        response.address = response.address + ", " + response.address_LINE2;
      if (response.address_LINE3 != null && response.address_LINE3 != '')
        response.address = response.address + ", " + response.address_LINE3;
      if (response.address_LINE4 != null && response.address_LINE4 != '')
        response.address = response.address + ", " + response.address_LINE4;
      if (response.address_LINE5 != null && response.address_LINE5 != '')
        response.address = response.address + ", " + response.address_LINE5;

      response.locations = [];
      response.location = JSON.parse(response.location_DETAIL);
      response.location_DETAIL = null;
      while (response.location.locationparent_ID != null) {
        response.address = response.address + ", " + response.location.location_NAME;
        response.locations.push(response.location);
        response.location = response.location.locationparent_ID;
      }
      response.locations.push(response.location);
    }

    return (response);
  }
}
