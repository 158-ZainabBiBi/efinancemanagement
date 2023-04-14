import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { ReturnauthComponent } from '../returnauth/returnauth.component';
import { RecievereturnauthService } from './recievereturnauth.service';
import { CurrencyComponent } from '../../lookup/currency/currency.component';

@Component({
  selector: 'app-recievereturnauth',
  templateUrl: './recievereturnauth.component.html',
  styleUrls: ['./recievereturnauth.component.css']
})
export class RecievereturnauthComponent implements OnInit {
  @ViewChild("returnauth") returnauth: ReturnauthComponent;
  @ViewChild("currency") currency: CurrencyComponent;

  @Input()
  view: number = 1;
  @Input()
  iscompulsory: boolean = false;
  @Input()
  isreload: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  recievereturnauthID = null;
  @Input()
  returnauthID = null;
  @Input()
  currencyID = null;
  @Input()
  currencyCode = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onRecieveReturnAuthChange = new EventEmitter();

  recievereturnauths = [];
  recievereturnauthsAll = [];
  recievereturnauth = {
    recievereturnauth_ID: 0,
    returnauth_ID: null,
    currency_ID: null,
    recievereturnauth_AMOUNT: null,
    recievereturnauth_DATE: null,
    isapproved: true,
    isactive: true,
  }

  constructor(
    private recievereturnauthservice: RecievereturnauthService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload) {
    if (window.sessionStorage.getItem('recievereturnauths') != null) {
      this.recievereturnauths = JSON.parse(window.sessionStorage.getItem('recievereturnauths'));
    }
    if (window.sessionStorage.getItem('recievereturnauthsAll') != null) {
      this.recievereturnauthsAll = JSON.parse(window.sessionStorage.getItem('recievereturnauthsAll'));
    }
    if (this.recievereturnauthID != 0 && !this.recievereturnauthID && Number(window.sessionStorage.getItem('recievereturnauth')) > 0) {
      this.recievereturnauthID = Number(window.sessionStorage.getItem('recievereturnauth'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.recievereturnauths == null || this.recievereturnauths.length == 0 || reload == true)) {
      this.recievereturnauths == null;
      this.recievereturnauthGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.recievereturnauthsAll == null || this.recievereturnauthsAll.length == 0 || reload == true)) {
      this.recievereturnauthsAll == null;
      this.recievereturnauthGetAll();
    }

    var search = {
      returnauth_ID: this.returnauthID,
      currencyID: this.currencyID,
      currency_CODE: this.currencyCode,
    }

    if (this.view >= 5 && this.view <= 6 && this.recievereturnauthID) {
      window.sessionStorage.setItem("recievereturnauth", this.recievereturnauthID);
      this.recievereturnauthGetOne(this.recievereturnauthID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.recievereturnauths == null || this.recievereturnauths.length == 0 || reload == true)) {
      this.recievereturnauths == null;
      this.recievereturnauthAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.recievereturnauthsAll == null || this.recievereturnauthsAll.length == 0 || reload == true)) {
      this.recievereturnauthsAll == null;
      this.recievereturnauthAdvancedSearchAll(search);
    }
  }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          width: 136,
          text: 'Refresh',
          onClick: this.load.bind(this, true),
        },
      }
    );
  }

  add() {
    this.recievereturnauth = {
      recievereturnauth_ID: 0,
      returnauth_ID: null,
      currency_ID: null,
      recievereturnauth_AMOUNT: null,
      recievereturnauth_DATE: null,
      isapproved: true,
      isactive: true,
    };
  }

  update(row) {
    this.edit.next(row);
  }

  editView() {
    this.disabled = false;
  }

  showView(row) {
    this.show.next(row);
  }

  cancelView() {
    this.cancel.next();
  }

  recievereturnauthEdit() {
    this.disabled = false;
  }

  recievereturnauthCancel() {
    this.disabled = true;
    if (this.recievereturnauth.recievereturnauth_ID == 0) {
      this.router.navigate(["/home/recievereturnauths "], {});
    }
  }

  onChange(recievereturnauthID) {
    for (var i = 0; i < this.recievereturnauthsAll.length; i++) {
      if (this.recievereturnauthsAll[i].recievereturnauth_ID == recievereturnauthID) {
        this.onRecieveReturnAuthChange.next(this.recievereturnauthsAll[i]);
        break;
      }
    }
  }

  setRecievereturnauth(response) {
    if (response.isapproved == "Y") {
      response.isapproved = true;
    } else {
      response.isapproved = false;
    }
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.recievereturnauth = response;
  }

  setRecievereturnauths(response) {
    this.cancel.next();
    return response;
  }

  recievereturnauthGet() {
    this.recievereturnauthservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.recievereturnauths = this.setRecievereturnauths(this.recievereturnauthservice.getAllDetail(response));
          window.sessionStorage.setItem("recievereturnauths", JSON.stringify(this.recievereturnauths));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  recievereturnauthGetAll() {
    this.recievereturnauthservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.recievereturnauthsAll = this.setRecievereturnauths(this.recievereturnauthservice.getAllDetail(response));
          window.sessionStorage.setItem("recievereturnauthsAll", JSON.stringify(this.recievereturnauthsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  recievereturnauthGetOne(id) {
    this.disabled = true;
    this.recievereturnauthservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setRecievereturnauth(this.recievereturnauthservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  recievereturnauthAdd(recievereturnauth) {
    recievereturnauth.isactive = "Y";
    recievereturnauth.isapproved = "N";
    recievereturnauth.returnauth_ID = this.returnauth.returnauthID;
    recievereturnauth.currency_ID = this.currency.currencyID;

    this.recievereturnauthservice.add(recievereturnauth).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.recievereturnauth_ID) {
          this.toastrservice.success("Success", "New Recieve Return Auth Added");
          this.refresh.next();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  recievereturnauthUpdate(recievereturnauth) {

    recievereturnauth.returnauth_ID = this.returnauth.returnauthID;
    recievereturnauth.currency_ID = this.currency.currencyID;

    if (recievereturnauth.isapproved == true) {
      recievereturnauth.isapproved = "Y";
    } else {
      recievereturnauth.isapproved = "N";
    }
    if (recievereturnauth.isactive == true) {
      recievereturnauth.isactive = "Y";
    } else {
      recievereturnauth.isactive = "N";
    }
    this.recievereturnauthservice.update(recievereturnauth, recievereturnauth.recievereturnauth_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.recievereturnauth_ID) {
          this.toastrservice.success("Success", "Recieve Return Auth Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  recievereturnauthUpdateAll(recievereturnauths) {
    this.recievereturnauthservice.updateAll(recievereturnauths).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Recieve Return Auths Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  recievereturnauthSearch(str) {
    var search = {
      search: str
    }
    this.recievereturnauthservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.recievereturnauths = this.setRecievereturnauths(this.recievereturnauthservice.getAllDetail(response));
          window.sessionStorage.setItem("recievereturnauths", JSON.stringify(this.recievereturnauths));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  recievereturnauthSearchAll(str) {
    var search = {
      search: str
    }
    this.recievereturnauthservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.recievereturnauthsAll = this.setRecievereturnauths(this.recievereturnauthservice.getAllDetail(response));
          window.sessionStorage.setItem("recievereturnauthsAll", JSON.stringify(this.recievereturnauthsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  recievereturnauthAdvancedSearch(search) {
    this.returnauthID = search.returnauth_ID;
    this.currencyID = search.currency_ID;
    this.currencyCode = search.currency_CODE;

    this.recievereturnauthservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.recievereturnauths = this.setRecievereturnauths(this.recievereturnauthservice.getAllDetail(response));
          window.sessionStorage.setItem("recievereturnauths", JSON.stringify(this.recievereturnauths));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  recievereturnauthAdvancedSearchAll(search) {
    this.returnauthID = search.returnauth_ID;
    this.currencyID = search.currency_ID;
    this.currencyCode = search.currency_CODE;

    this.recievereturnauthservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.recievereturnauthsAll = this.setRecievereturnauths(this.recievereturnauthservice.getAllDetail(response));
          window.sessionStorage.setItem("recievereturnauthsAll", JSON.stringify(this.recievereturnauthsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
