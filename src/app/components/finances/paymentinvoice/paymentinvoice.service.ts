
import { Injectable } from '@angular/core';
import { HttpCallServieService } from '../../../services/http-call-servie.service';
import { setting } from '../../../setting';

@Injectable({
  providedIn: 'root'
})
export class PaymentinvoiceService {


  constructor(
    private _HttpCallServieService_: HttpCallServieService
  ) { }


  get() {
    var postData = {
      service_NAME: setting.financeservice_NAME,
      request_TYPE: "GET",
      request_URI: "paymentinvoice",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  getAll() {
    var postData = {
      service_NAME: setting.financeservice_NAME,
      request_TYPE: "GET",
      request_URI: "paymentinvoice/all",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }


  getOne(id) {
    var postData = {
      service_NAME: setting.financeservice_NAME,
      request_TYPE: "GET",
      request_URI: "paymentinvoice/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  add(data) {
    var postData = {
      service_NAME: setting.financeservice_NAME,
      request_TYPE: "POST",
      request_URI: "paymentinvoice",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  update(data, id) {
    var postData = {
      service_NAME: setting.financeservice_NAME,
      request_TYPE: "PUT",
      request_URI: "paymentinvoice/" + id,
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  delete(id) {
    var postData = {
      service_NAME: setting.financeservice_NAME,
      request_TYPE: "DELETE",
      request_URI: "paymentinvoice/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  search(data) {
    var postData = {
      service_NAME: setting.financeservice_NAME,
      request_TYPE: "POST",
      request_URI: "paymentinvoice/search",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  searchAll(data) {
    var postData = {
      service_NAME: setting.financeservice_NAME,
      request_TYPE: "POST",
      request_URI: "paymentinvoice/search/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearch(data) {
    var postData = {
      service_NAME: setting.financeservice_NAME,
      request_TYPE: "POST",
      request_URI: "paymentinvoice/advancedsearch",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearchAll(data) {
    var postData = {
      service_NAME: setting.financeservice_NAME,
      request_TYPE: "POST",
      request_URI: "paymentinvoice/advancedsearch/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  getAllDetail(response) {
    for (var a = 0; a < response.length; a++) {
      response[a].studentinstancefee = JSON.parse(response[a].studentinstancefee_DETAIL);
      response[a].studentinstancefee_DETAIL = null;

      response[a].studentinstance = JSON.parse(response[a].studentinstancefee.studentinstance_DETAIL);
      response[a].studentinstancefee.studentinstance_DETAIL = null;

      response[a].person = JSON.parse(response[a].studentinstance.person_DETAIL);
      response[a].person_DETAIL = response[a].person.title + " " + response[a].person.forenames + " " + response[a].person.surname;

      response[a].intakecourse = JSON.parse(response[a].studentinstance.intakecourse_DETAIL);
      response[a].intake = JSON.parse(response[a].intakecourse.intake_DETAIL);
      response[a].course = JSON.parse(response[a].intakecourse.course_DETAIL);
      response[a].intakecourse_DETAIL = response[a].intake.intake_DESC + "   " + response[a].course.course_TITLE;
      
      response[a].payment = JSON.parse(response[a].payment_DETAIL);
      response[a].payment_DETAIL = response[a].payment.payment_NUMBER;
    }
    return (response);
  }

  getDetail(response) {
    response.studentinstancefee = JSON.parse(response.studentinstancefee_DETAIL);
    response.studentinstancefee_DETAIL = null;

    response.studentinstance = JSON.parse(response.studentinstancefee.studentinstance_DETAIL);
    response.studentinstancefee.studentinstance_DETAIL = null;

    response.person = JSON.parse(response.studentinstance.person_DETAIL);
    response.person_DETAIL = response.person.title + " " + response.person.forenames + " " + response.person.surname;

    response.intakecourse = JSON.parse(response.studentinstance.intakecourse_DETAIL);
    response.intake = JSON.parse(response.intakecourse.intake_DETAIL);
    response.course = JSON.parse(response.intakecourse.course_DETAIL);
    response.intakecourse_DETAIL = response.intake.intake_DESC + "   " + response.course.course_TITLE;
    
    response.payment = JSON.parse(response.payment_DETAIL);
    response.payment_DETAIL = response.payment.payment_NUMBER;

    return (response);
  }
}
