import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { ReturnauthComponent } from '../returnauth/returnauth.component';
import { ApprovalreturnauthService } from './approvalreturnauth.service';
import { CurrencyComponent } from '../../lookup/currency/currency.component';

@Component({
  selector: 'app-approvalreturnauth',
  templateUrl: './approvalreturnauth.component.html',
  styleUrls: ['./approvalreturnauth.component.css']
})
export class ApprovalreturnauthComponent implements OnInit {
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
  approvalreturnauthID = null;
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
  @Output() onApprovalReturnAuthChange = new EventEmitter();

  approvalreturnauths = [];
  approvalreturnauthsAll = [];
  approvalreturnauth = {
    approvalreturnauth_ID: 0,
    returnauth_ID: null,
    currency_ID: null,
    approvalreturnauth_AMOUNT: null,
    approvalreturnauth_DATE: null,
    isapproved: false,
    isactive: true
  }

  constructor(
    private approvalreturnauthservice: ApprovalreturnauthService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload) {
    if (window.sessionStorage.getItem('approvalreturnauths') != null) {
      this.approvalreturnauths = JSON.parse(window.sessionStorage.getItem('approvalreturnauths'));
    }
    if (window.sessionStorage.getItem('approvalreturnauthsAll') != null) {
      this.approvalreturnauthsAll = JSON.parse(window.sessionStorage.getItem('approvalreturnauthsAll'));
    }
    if (this.approvalreturnauthID != 0 && !this.approvalreturnauthID && Number(window.sessionStorage.getItem('approvalreturnauth')) > 0) {
      this.approvalreturnauthID = Number(window.sessionStorage.getItem('approvalreturnauth'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.approvalreturnauths == null || this.approvalreturnauths.length == 0 || reload == true)) {
      this.approvalreturnauths == null;
      this.approvalreturnauthGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.approvalreturnauthsAll == null || this.approvalreturnauthsAll.length == 0 || reload == true)) {
      this.approvalreturnauthsAll == null;
      this.approvalreturnauthGetAll();
    }

    var search = {
      returnauth_ID: this.returnauthID,
      currencyID: this.currencyID,
      currency_CODE: this.currencyCode,
    }

    if (this.view >= 5 && this.view <= 6 && this.approvalreturnauthID) {
      window.sessionStorage.setItem("approvalreturnauth", this.approvalreturnauthID);
      this.approvalreturnauthGetOne(this.approvalreturnauthID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.approvalreturnauths == null || this.approvalreturnauths.length == 0 || reload == true)) {
      this.approvalreturnauths == null;
      this.approvalreturnauthAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.approvalreturnauthsAll == null || this.approvalreturnauthsAll.length == 0 || reload == true)) {
      this.approvalreturnauthsAll == null;
      this.approvalreturnauthAdvancedSearchAll(search);
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
    this.approvalreturnauth = {
      approvalreturnauth_ID: 0,
      returnauth_ID: null,
      currency_ID: null,
      approvalreturnauth_AMOUNT: null,
      approvalreturnauth_DATE: null,
      isapproved: false,
      isactive: true
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

  approvalreturnauthEdit() {
    this.disabled = false;
  }

  approvalreturnauthCancel() {
    this.disabled = true;
    if (this.approvalreturnauth.approvalreturnauth_ID == 0) {
      this.router.navigate(["/home/approvalreturnauths "], {});
    }
  }

  onChange(approvalreturnauthID) {
    for (var i = 0; i < this.approvalreturnauthsAll.length; i++) {
      if (this.approvalreturnauthsAll[i].approvalreturnauth_ID == approvalreturnauthID) {
        this.onApprovalReturnAuthChange.next(this.approvalreturnauthsAll[i]);
        break;
      }
    }
  }

  setApprovalreturnauth(response) {
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
    this.approvalreturnauth = response;
  }

  setApprovalreturnauths(response) {
    this.cancel.next();
    return response;
  }

  approvalreturnauthGet() {
    this.approvalreturnauthservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.approvalreturnauths = this.setApprovalreturnauths(this.approvalreturnauthservice.getAllDetail(response));
          window.sessionStorage.setItem("approvalreturnauths", JSON.stringify(this.approvalreturnauths));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  approvalreturnauthGetAll() {
    this.approvalreturnauthservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.approvalreturnauthsAll = this.setApprovalreturnauths(this.approvalreturnauthservice.getAllDetail(response));
          window.sessionStorage.setItem("approvalreturnauthsAll", JSON.stringify(this.approvalreturnauthsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  approvalreturnauthGetOne(id) {
    this.disabled = true;
    this.approvalreturnauthservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setApprovalreturnauth(this.approvalreturnauthservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  approvalreturnauthAdd(approvalreturnauth) {
    approvalreturnauth.isactive = "Y";
    approvalreturnauth.isapproved = "N";
    approvalreturnauth.returnauth_ID = this.returnauth.returnauthID;
    approvalreturnauth.currency_ID = this.currency.currencyID;

    this.approvalreturnauthservice.add(approvalreturnauth).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.approvalreturnauth_ID) {
          this.toastrservice.success("Success", "New Approval Return Auth Added");
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

  approvalreturnauthUpdate(approvalreturnauth) {

    approvalreturnauth.returnauth_ID = this.returnauth.returnauthID;
    approvalreturnauth.currency_ID = this.currency.currencyID;

    if (approvalreturnauth.isapproved == true) {
      approvalreturnauth.isapproved = "Y";
    } else {
      approvalreturnauth.isapproved = "N";
    }
    if (approvalreturnauth.isactive == true) {
      approvalreturnauth.isactive = "Y";
    } else {
      approvalreturnauth.isactive = "N";
    }
    this.approvalreturnauthservice.update(approvalreturnauth, approvalreturnauth.approvalreturnauth_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.approvalreturnauth_ID) {
          this.toastrservice.success("Success", "Approval Return Auth Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  approvalreturnauthUpdateAll(approvalreturnauths) {
    this.approvalreturnauthservice.updateAll(approvalreturnauths).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Approval Return Auths Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  approvalreturnauthSearch(str) {
    var search = {
      search: str
    }
    this.approvalreturnauthservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.approvalreturnauths = this.setApprovalreturnauths(this.approvalreturnauthservice.getAllDetail(response));
          window.sessionStorage.setItem("approvalreturnauths", JSON.stringify(this.approvalreturnauths));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  approvalreturnauthSearchAll(str) {
    var search = {
      search: str
    }
    this.approvalreturnauthservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.approvalreturnauthsAll = this.setApprovalreturnauths(this.approvalreturnauthservice.getAllDetail(response));
          window.sessionStorage.setItem("approvalreturnauthsAll", JSON.stringify(this.approvalreturnauthsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  approvalreturnauthAdvancedSearch(search) {
    this.returnauthID = search.returnauth_ID;
    this.currencyID = search.currency_ID;
    this.currencyCode = search.currency_CODE;

    this.approvalreturnauthservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.approvalreturnauths = this.setApprovalreturnauths(this.approvalreturnauthservice.getAllDetail(response));
          window.sessionStorage.setItem("approvalreturnauths", JSON.stringify(this.approvalreturnauths));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  approvalreturnauthAdvancedSearchAll(search) {
    this.returnauthID = search.returnauth_ID;
    this.currencyID = search.currency_ID;
    this.currencyCode = search.currency_CODE;

    this.approvalreturnauthservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.approvalreturnauthsAll = this.setApprovalreturnauths(this.approvalreturnauthservice.getAllDetail(response));
          window.sessionStorage.setItem("approvalreturnauthsAll", JSON.stringify(this.approvalreturnauthsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
