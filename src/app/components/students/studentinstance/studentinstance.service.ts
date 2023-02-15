import { Injectable } from '@angular/core';
import { HttpCallServieService } from '../../../services/http-call-servie.service';
import { setting } from '../../../setting';

@Injectable({
  providedIn: 'root'
})
export class StudentinstanceService {
  constructor(
    private _HttpCallServieService_: HttpCallServieService
  ) { }

  get() {
    var postData = {
      service_NAME: setting.studentservice_NAME,
      request_TYPE: "GET",
      request_URI: "studentinstance",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  getAll() {
    var postData = {
      service_NAME: setting.studentservice_NAME,
      request_TYPE: "GET",
      request_URI: "studentinstance/all",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }


  getOne(id) {
    var postData = {
      service_NAME: setting.studentservice_NAME,
      request_TYPE: "GET",
      request_URI: "studentinstance/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  add(data) {
    var postData = {
      service_NAME: setting.studentservice_NAME,
      request_TYPE: "POST",
      request_URI: "studentinstance",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  update(data, id) {
    var postData = {
      service_NAME: setting.studentservice_NAME,
      request_TYPE: "PUT",
      request_URI: "studentinstance/" + id,
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  delete(id) {
    var postData = {
      service_NAME: setting.studentservice_NAME,
      request_TYPE: "DELETE",
      request_URI: "studentinstance/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  search(data) {
    var postData = {
      service_NAME: setting.studentservice_NAME,
      request_TYPE: "POST",
      request_URI: "studentinstance/search",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  searchAll(data) {
    var postData = {
      service_NAME: setting.studentservice_NAME,
      request_TYPE: "POST",
      request_URI: "studentinstance/search/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearch(data) {
    var postData = {
      service_NAME: setting.studentservice_NAME,
      request_TYPE: "POST",
      request_URI: "studentinstance/advancedsearch",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearchAll(data) {
    var postData = {
      service_NAME: setting.studentservice_NAME,
      request_TYPE: "POST",
      request_URI: "studentinstance/advancedsearch/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  getAllDetail(response) {
    for (var a = 0; a < response.length; a++) {
      response[a].person = JSON.parse(response[a].person_DETAIL);
      response[a].person_DETAIL = response[a].person.title + " " + response[a].person.forenames + " " + response[a].person.surname;

      response[a].intakecourse = JSON.parse(response[a].intakecourse_DETAIL);
      response[a].intake = JSON.parse(response[a].intakecourse.intake_DETAIL);
      response[a].course = JSON.parse(response[a].intakecourse.course_DETAIL);
      response[a].intakecourse_DETAIL = response[a].intake.intake_DESC + "   " + response[a].course.course_TITLE;

      response[a].qualificationonentry = JSON.parse(response[a].qualificationonentry_DETAIL);
      if (response[a].qualificationonentry != null)
        response[a].qualificationonentry_DETAIL = response[a].qualificationonentry.code + ' - ' + response[a].qualificationonentry.description;

      response[a].studentstatus = JSON.parse(response[a].studentstatus_DETAIL);
      if (response[a].studentstatus != null)
        response[a].studentstatus_DETAIL = response[a].studentstatus.description;

      response[a].reasonend = JSON.parse(response[a].reasonend_DETAIL);
      if (response[a].reasonend != null)
        response[a].reasonend_DETAIL = response[a].reasonend.code + ' - ' + response[a].reasonend.description;

      response[a].unitlgth = JSON.parse(response[a].unitlgth_DETAIL);
      if (response[a].unitlgth != null)
        response[a].unitlgth_DETAIL = response[a].unitlgth.code + ' - ' + response[a].unitlgth.description;

      response[a].sourcetuitionfee = JSON.parse(response[a].sourcetuitionfee_DETAIL);
      if (response[a].sourcetuitionfee != null)
        response[a].sourcetuitionfee_DETAIL = response[a].sourcetuitionfee.code + ' - ' + response[a].sourcetuitionfee.description;

    }
    return (response);
  }

  getDetail(response) {
    response.person = JSON.parse(response.person_DETAIL);
    response.person_DETAIL = response.person.forenames;

    response.intakecourse = JSON.parse(response.intakecourse_DETAIL);
    response.intake = JSON.parse(response.intakecourse.intake_DETAIL);
    response.course = JSON.parse(response.intakecourse.course_DETAIL);
    response.intakecourse_DETAIL = response.intake.intake_DESC + "   " + response.course.course_TITLE;

    response.qualificationonentry = JSON.parse(response.qualificationonentry_DETAIL);
    if (response.qualificationonentry != null)
      response.qualificationonentry_DETAIL = response.qualificationonentry.code + ' - ' + response.qualificationonentry.description;

    response.studentstatus = JSON.parse(response.studentstatus_DETAIL);
    if (response.studentstatus != null)
      response.studentstatus_DETAIL = response.studentstatus.description;

    response.reasonend = JSON.parse(response.reasonend_DETAIL);
    if (response.reasonend != null)
      response.reasonend_DETAIL = response.reasonend.code + ' - ' + response.reasonend.description;

    response.unitlgth = JSON.parse(response.unitlgth_DETAIL);
    if (response.unitlgth != null)
      response.unitlgth_DETAIL = response.unitlgth.code + ' - ' + response.unitlgth.description;

    response.sourcetuitionfee = JSON.parse(response.sourcetuitionfee_DETAIL);
    if (response.sourcetuitionfee != null)
      response.sourcetuitionfee_DETAIL = response.sourcetuitionfee.code + ' - ' + response.sourcetuitionfee.description;

    return (response);
  }

}
