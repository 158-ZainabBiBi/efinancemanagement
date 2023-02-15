import { Injectable } from '@angular/core';
import { HttpCallServieService } from '../../../services/http-call-servie.service';
import { setting } from '../../../setting';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {


  constructor(
    private _HttpCallServieService_: HttpCallServieService
  ) { }


  get() {
    var postData = {
      service_NAME: setting.financeservice_NAME,
      request_TYPE: "GET",
      request_URI: "payment",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  getAll() {
    var postData = {
      service_NAME: setting.financeservice_NAME,
      request_TYPE: "GET",
      request_URI: "payment/all",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }


  getOne(id) {
    var postData = {
      service_NAME: setting.financeservice_NAME,
      request_TYPE: "GET",
      request_URI: "payment/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  add(data) {
    var postData = {
      service_NAME: setting.financeservice_NAME,
      request_TYPE: "POST",
      request_URI: "payment",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  update(data, id) {
    var postData = {
      service_NAME: setting.financeservice_NAME,
      request_TYPE: "PUT",
      request_URI: "payment/" + id,
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  delete(id) {
    var postData = {
      service_NAME: setting.financeservice_NAME,
      request_TYPE: "DELETE",
      request_URI: "payment/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  search(data) {
    var postData = {
      service_NAME: setting.financeservice_NAME,
      request_TYPE: "POST",
      request_URI: "payment/search",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  searchAll(data) {
    var postData = {
      service_NAME: setting.financeservice_NAME,
      request_TYPE: "POST",
      request_URI: "payment/search/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearch(data) {
    var postData = {
      service_NAME: setting.financeservice_NAME,
      request_TYPE: "POST",
      request_URI: "payment/advancedsearch",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearchAll(data) {
    var postData = {
      service_NAME: setting.financeservice_NAME,
      request_TYPE: "POST",
      request_URI: "payment/advancedsearch/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  receivedPayment(data) {
    var postData = {
      service_NAME: setting.financeservice_NAME,
      request_TYPE: "POST",
      request_URI: "payment/receivedpayment",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  receivedPaymentStudent(data) {
    var postData = {
      service_NAME: setting.financeservice_NAME,
      request_TYPE: "POST",
      request_URI: "payment/receivedpayment/student",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  getAllDetail(response) {
    for (var a = 0; a < response.length; a++) {
      response[a].studentinstance = JSON.parse(response[a].studentinstance_DETAIL);
      response[a].studentinstance_DETAIL = null;

      response[a].person = JSON.parse(response[a].studentinstance.person_DETAIL);
      response[a].person_DETAIL = response[a].person.title + " " + response[a].person.forenames + " " + response[a].person.surname;

      response[a].intakecourse = JSON.parse(response[a].studentinstance.intakecourse_DETAIL);
      response[a].intake = JSON.parse(response[a].intakecourse.intake_DETAIL);
      response[a].course = JSON.parse(response[a].intakecourse.course_DETAIL);
      response[a].intakecourse_DETAIL = response[a].intake.intake_DESC + "   " + response[a].course.course_TITLE;
      
      response[a].account = JSON.parse(response[a].account_DETAIL);
      response[a].account_DETAIL = response[a].account.account_CODE + ' - ' + response[a].account.account_NAME;

      response[a].paymentmethod = JSON.parse(response[a].paymentmethod_DETAIL);
      response[a].paymentmethod_DETAIL = null;

      response[a].paymentstatus = JSON.parse(response[a].paymentstatus_DETAIL);
      response[a].paymentstatus_DETAIL = response[a].paymentstatus.description;
    }
    return (response);
  }

  getDetail(response) {
    response.studentinstance = JSON.parse(response.studentinstance_DETAIL);
    response.studentinstance_DETAIL = null;

    response.person = JSON.parse(response.studentinstance.person_DETAIL);
    response.person_DETAIL = response.person.title + " " + response.person.forenames + " " + response.person.surname;

    response.intakecourse = JSON.parse(response.studentinstance.intakecourse_DETAIL);
    response.intake = JSON.parse(response.intakecourse.intake_DETAIL);
    response.course = JSON.parse(response.intakecourse.course_DETAIL);
    response.intakecourse_DETAIL = response.intake.intake_DESC + "   " + response.course.course_TITLE;
    
    response.account = JSON.parse(response.account_DETAIL);
    response.account_DETAIL = response.account.account_CODE + ' - ' + response.account.account_NAME;

    response.paymentmethod = JSON.parse(response.paymentmethod_DETAIL);
     response.paymentmethod_DETAIL = null;

    response.paymentstatus = JSON.parse(response.paymentstatus_DETAIL);
    response.paymentstatus_DETAIL = response.paymentstatus.description;

    return (response);
  }
}
