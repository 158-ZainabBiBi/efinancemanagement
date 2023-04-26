import { Injectable } from "@angular/core";
import { HttpCallServieService } from "../../../services/http-call-servie.service";
import { setting } from "../../../setting";
import { JournallineService } from "../journalline/journalline.service";


@Injectable({
  providedIn: "root"
})
export class JournalopeningbalanceService {
  constructor(
    private HttpCallServieService: HttpCallServieService,
    private journallineservice: JournallineService,
  ) { }

  get() {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "GET",
      request_URI: "journalopeningbalance",
      request_BODY: ""
    }
    return this.HttpCallServieService.api(postData);
  }

  getAll() {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "GET",
      request_URI: "journalopeningbalance/all",
      request_BODY: ""
    }
    return this.HttpCallServieService.api(postData);
  }


  getOne(id) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "GET",
      request_URI: "journalopeningbalance/" + id,
      request_BODY: ""
    }
    return this.HttpCallServieService.api(postData);
  }

  add(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "journalopeningbalance",
      request_BODY: JSON.stringify(data)
    }
    return this.HttpCallServieService.api(postData);
  }

  update(data, id) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "PUT",
      request_URI: "journalopeningbalance/" + id,
      request_BODY: JSON.stringify(data)

    }
    return this.HttpCallServieService.api(postData);
  }

  updateAll(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "PUT",
      request_URI: "journalopeningbalance",
      request_BODY: JSON.stringify(data)

    }
    return this.HttpCallServieService.api(postData);
  }

  delete(id) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "DELETE",
      request_URI: "journalopeningbalance/" + id,
      request_BODY: ""
    }
    return this.HttpCallServieService.api(postData);
  }

  search(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "journalopeningbalance/search",
      request_BODY: JSON.stringify(data)

    }
    return this.HttpCallServieService.api(postData);
  }

  searchAll(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "journalopeningbalance/search/all",
      request_BODY: JSON.stringify(data)
    }
    return this.HttpCallServieService.api(postData);
  }

  advancedSearch(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "journalopeningbalance/advancedsearch",
      request_BODY: JSON.stringify(data)
    }
    return this.HttpCallServieService.api(postData);
  }

  advancedSearchAll(data) {
    var postData = {
      service_NAME: setting.accountservice_NAME,
      request_TYPE: "POST",
      request_URI: "journalopeningbalance/advancedsearch/all",
      request_BODY: JSON.stringify(data)
    }
    return this.HttpCallServieService.api(postData);
  }

  getAllDetail(response) {
    for (var a = 0; a < response.length; a++) {
      response[a] = this.getDetail(response[a]);
    }
    return (response);
  }

  getDetail(response) {
    if (response.journalline_DETAIL != null) {
      response.journalline = this.journallineservice.getDetail(JSON.parse(response.journalline_DETAIL));
      response.journalline_DETAIL = null;
    }

    return (response);
  }
}

