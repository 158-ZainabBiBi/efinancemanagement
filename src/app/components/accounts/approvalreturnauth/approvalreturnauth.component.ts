import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { OnFailService } from '../../../services/on-fail.service';
import { Router } from '@angular/router';
import { ApprovalcurrencyService } from './approvalreturnauth.service';
import { ReturnauthComponent } from '../returnauth/returnauth.component';
import { CurrencyComponent } from '../currency/currency.component';

@Component({
  selector: 'app-approvalreturnauth',
  templateUrl: './approvalreturnauth.component.html',
  styleUrls: ['./approvalreturnauth.component.css']
})
export class ApprovalreturnauthComponent implements OnInit {
  @ViewChild("returnauth") returnauth: ReturnauthComponent;
  @ViewChild("addreturnauth") addreturnauth: ReturnauthComponent;
  @ViewChild("editreturnauth") editreturnauth: ReturnauthComponent;

  @ViewChild("currency") currency: CurrencyComponent;
  @ViewChild("addcurrency") addcurrency: CurrencyComponent;
  @ViewChild("editcurrency") editcurrency: CurrencyComponent;



  @Input()
  view: number = 1;
  @Input()
  iscompulsory: boolean = false;
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

  @Output() show = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();

  approvalreturnauths = [];
  approvalreturnauthsAll = [];
  approvalreturnauth = {
    approvalreturnauth_ID: 0,
    returnauth_ID: 0,
    currency_ID: 0,
    approvalreturnauth_AMOUNT: "",
    approvalreturnauth_DATE: "",
    isapproved: true,
    isactive: true,
  }

  constructor(
    private approvalreturnauthservice: ApprovalcurrencyService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.approvalreturnauths = JSON.parse(window.sessionStorage.getItem('approvalreturnauths'));
    this.approvalreturnauthsAll = JSON.parse(window.sessionStorage.getItem('approvalreturnauthsAll'));
    if (this.view == 1 && this.approvalreturnauths == null) {
      this.approvalreturnauthGet();
    } else if (this.view == 1 && this.disabled == true && this.approvalreturnauthsAll == null) {
      this.approvalreturnauthGetAll();
    } else if (this.view == 2 && this.approvalreturnauthsAll == null) {
      this.approvalreturnauthGetAll();
    } else if (this.view == 22 && (this.currencyID != null)) {
      this.approvalreturnauthAdvancedSearchAll(this.currencyID);
    }

    if (this.approvalreturnauthID != 0 && !this.approvalreturnauthID && Number(window.sessionStorage.getItem('approvalreturnauth')) > 0) {
      this.approvalreturnauthID = Number(window.sessionStorage.getItem('approvalreturnauth'));
    }
    if (this.view == 5 && this.approvalreturnauthID) {
      window.sessionStorage.setItem("approvalreturnauth", this.approvalreturnauthID);
      this.approvalreturnauthGetOne(this.approvalreturnauthID);
    } if (this.view == 11 && this.currencyID && this.disabled == false) {
      this.approvalreturnauthAdvancedSearch(this.currencyID);
    } else if (this.view == 11 && this.currencyID && this.disabled == true) {
      this.approvalreturnauthAdvancedSearchAll(this.currencyID);

    } else if (this.view == 11 || this.view == 1) {
      this.approvalreturnauthID = null;
      this.approvalreturnauthsAll = null;
      this.approvalreturnauths = null;
    }

    if (this.approvalreturnauthID == 0) {
      this.approvalreturnauthID = null;
    }
  }

  showView(row) {
    this.show.next(row);
  }

  editView() {
    this.disabled = false;
  }

  cancelView() {
    this.cancel.next();
  }

  approvalreturnauthCancel() {
    console.log(this.approvalreturnauth);
    this.disabled = true;
    if (this.approvalreturnauth.approvalreturnauth_ID == 0) {
      this.router.navigate(["/home/approvalreturnauths"], {});
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
          onClick: this.approvalreturnauthGetAll.bind(this),
        },
      }
    );
  }

  onToolbarPreparingAdvanced(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          width: 136,
          text: 'Refresh',
          onClick: this.approvalreturnauthAdvancedSearchAll.bind(this, this.currencyID),
        },
      }
    );
  }

  add() {
    this.approvalreturnauth = {
      approvalreturnauth_ID: 0,
      returnauth_ID: 0,
      currency_ID: 0,
      approvalreturnauth_AMOUNT: "",
      approvalreturnauth_DATE: "",
      isapproved: true,
      isactive: true,
    };
  }
  setapprovalreturnauth(response) {
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.approvalreturnauth = response;
    this.disabled = true;
  }

  update(row) {
    this.edit.next(row);
  }

  setapprovalreturnauths(response) {
    if ((this.view == 1 || this.view == 11) && this.disabled == false) {
      this.approvalreturnauths = response;
      window.sessionStorage.setItem("approvalreturnauths", JSON.stringify(this.approvalreturnauths));
    } else {
      this.approvalreturnauthsAll = response;
      window.sessionStorage.setItem("approvalreturnauthsAll", JSON.stringify(this.approvalreturnauthsAll));
    }
    this.cancel.next();
  }

  approvalreturnauthGet() {
    this.approvalreturnauthservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setapprovalreturnauths(this.approvalreturnauthservice.getAllDetail(response));
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
          this.setapprovalreturnauths(this.approvalreturnauthservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }
  approvalreturnauthGetOne(id) {
    this.approvalreturnauthservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setapprovalreturnauth(this.approvalreturnauthservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }
  approvalreturnauthAdd(approvalreturnauth) {
    approvalreturnauth.isactive = "Y";
    if (this.view == 5) {
      approvalreturnauth.returnauth_ID = this.returnauth.returnauthID;
      approvalreturnauth.currency_ID = this.currency.currencyID;

    } else {
      approvalreturnauth.returnauth_ID = this.addreturnauth.returnauthID;
      approvalreturnauth.currency_ID = this.addcurrency.currencyID;
    }
    this.approvalreturnauthservice.add(approvalreturnauth).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.approvalreturnauth_ID) {
          this.toastrservice.success("Success", "New approvalreturnauth Added");
          this.approvalreturnauthGetAll();
          this.setapprovalreturnauth(this.approvalreturnauthservice.getDetail(response));
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
    if (this.view == 5) {
      approvalreturnauth.returnauth_ID = this.returnauth.returnauthID;
      approvalreturnauth.currency_ID = this.currency.currencyID;
    } else {
      approvalreturnauth.returnauth_ID = this.editreturnauth.returnauthID;
      approvalreturnauth.currency_ID = this.editcurrency.currencyID;
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
          this.toastrservice.success("Success", "approvalreturnauth Updated");
          if (this.disabled == true) {
            this.setapprovalreturnauth(this.approvalreturnauthservice.getDetail(response));
          } else {
            this.disabled = true;
          }
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
          this.setapprovalreturnauths(this.approvalreturnauthservice.getAllDetail(response));
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
          this.setapprovalreturnauths(this.approvalreturnauthservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  approvalreturnauthAdvancedSearch(currencyID) {
    this.currencyID = currencyID;
    var search = {
      currency_ID: currencyID
    }
    this.approvalreturnauthservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setapprovalreturnauths(this.approvalreturnauthservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  approvalreturnauthAdvancedSearchAll(currencyID) {
    this.currencyID = currencyID;
    var search = {
      currency_ID: currencyID
    }
    this.approvalreturnauthservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setapprovalreturnauths(this.approvalreturnauthservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}