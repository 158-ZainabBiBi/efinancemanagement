import { Injectable } from '@angular/core';
import { HttpCallServieService } from '../../../services/http-call-servie.service';
import { setting } from '../../../setting';
import { LocationService } from '../../location/location/location.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  constructor(
    private _HttpCallServieService_: HttpCallServieService,
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
