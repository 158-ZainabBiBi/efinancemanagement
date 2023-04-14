import { Injectable } from '@angular/core';
import { HttpCallServieService } from '../../../services/http-call-servie.service';
import { setting } from '../../../setting';
import { CustomerService } from '../../customer/customer/customer.service';
import { ProductService } from '../../product/product/product.service';
import { CustomerrefundService } from '../customerrefund/customerrefund.service';

@Injectable({
  providedIn: 'root'
})
export class ReturnauthService {


  constructor(
    private _HttpCallServieService_: HttpCallServieService,
    private customerservice: CustomerService,
    private customerrefundservice: CustomerrefundService,
    private productservice: ProductService,
  ) { }


  get() {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "GET",
      request_URI: "returnauth",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  getAll() {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "GET",
      request_URI: "returnauth/all",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }


  getOne(id) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "GET",
      request_URI: "returnauth/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  add(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "returnauth",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  update(data, id) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "PUT",
      request_URI: "returnauth/" + id,
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  updateAll(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "PUT",
      request_URI: "returnauth",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  delete(id) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "DELETE",
      request_URI: "returnauth/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  search(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "returnauth/search",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  searchAll(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "returnauth/search/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearch(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "returnauth/advancedsearch",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearchAll(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "returnauth/advancedsearch/all",
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

    if (response.customerrefund_DETAIL != null) {
      response.customerrefund = this.customerrefundservice.getDetail(JSON.parse(response.customerrefund_DETAIL));
      response.customerrefund_DETAIL = null
    }

    if (response.product_DETAIL != null) {
      response.product = this.productservice.getDetail(JSON.parse(response.product_DETAIL));
      response.product_DETAIL = null
    }

    if (response.returnstatus_DETAIL != null) {
      response.returnstatus = JSON.parse(response.returnstatus_DETAIL);
      response.returnstatus_DETAIL = response.returnstatus.code + ' - ' + response.returnstatus.description;
    }

    if (response.saleordertype_DETAIL != null) {
      response.saleordertype = JSON.parse(response.saleordertype_DETAIL);
      response.saleordertype_DETAIL = response.saleordertype.code + ' - ' + response.saleordertype.description;
    }

    return (response);
  }

}
