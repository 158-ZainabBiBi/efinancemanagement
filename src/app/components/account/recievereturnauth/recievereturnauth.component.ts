import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { OnFailService } from '../../../services/on-fail.service';
import { Router } from '@angular/router';
import { RecievereturnauthService } from './recievereturnauth.service';
import { ReturnauthComponent } from '../returnauth/returnauth.component';
import { CurrencyComponent } from '../currency/currency.component';

@Component({
  selector: 'app-recievereturnauth',
  templateUrl: './recievereturnauth.component.html',
  styleUrls: ['./recievereturnauth.component.css']
})
export class RecievereturnauthComponent implements OnInit {
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
  recievereturnauthID = null;
  @Input()
  returnauthID = null;
  @Input()
  currencyID = null;

  @Output() show = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();

  recievereturnauths = [];
  recievereturnauthsAll = [];
  recievereturnauth = {
    recievereturnauth_ID: 0,
    returnauth_ID: 0,
    currency_ID: 0,
    recievereturnauth_AMOUNT: null,
    recievereturnauth_DATE: "",
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
    this.recievereturnauths = JSON.parse(window.sessionStorage.getItem('recievereturnauths'));
    this.recievereturnauthsAll = JSON.parse(window.sessionStorage.getItem('recievereturnauthsAll'));
    if (this.view == 1 && this.recievereturnauths == null) {
      this.recievereturnauthGet();
    } else if (this.view == 1 && this.disabled == true && this.recievereturnauthsAll == null) {
      this.recievereturnauthGetAll();
    } else if (this.view == 2 && this.recievereturnauthsAll == null) {
      this.recievereturnauthGetAll();
    } else if (this.view == 22 && (this.returnauthID != null)) {
      this.recievereturnauthAdvancedSearchAll(this.returnauthID, 0);
    }

    if (this.recievereturnauthID != 0 && !this.recievereturnauthID && Number(window.sessionStorage.getItem('recievereturnauth')) > 0) {
      this.recievereturnauthID = Number(window.sessionStorage.getItem('recievereturnauth'));
    }
    if (this.view == 5 && this.recievereturnauthID) {
      window.sessionStorage.setItem("recievereturnauth", this.recievereturnauthID);
      this.recievereturnauthGetOne(this.recievereturnauthID);
    } if (this.view == 11 && this.returnauthID && this.disabled == false) {
      this.recievereturnauthAdvancedSearch(this.returnauthID, 0);
    } else if (this.view == 11 && this.returnauthID && this.disabled == true) {
      this.recievereturnauthAdvancedSearchAll(this.returnauthID, 0);

    } else if (this.view == 11 || this.view == 1) {
      this.recievereturnauthID = null;
      this.recievereturnauthsAll = null;
      this.recievereturnauths = null;
    }

    if (this.recievereturnauthID == 0) {
      this.recievereturnauthID = null;
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

  recievereturnauthCancel() {
    console.log(this.recievereturnauth);
    this.disabled = true;
    if (this.recievereturnauth.recievereturnauth_ID == 0) {
      this.router.navigate(["/home/recievereturnauths"], {});
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
          onClick: this.recievereturnauthGetAll.bind(this),
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
          onClick: this.recievereturnauthAdvancedSearchAll.bind(this, this.returnauthID),
        },
      }
    );
  }

  add() {
    this.recievereturnauth = {
      recievereturnauth_ID: 0,
      returnauth_ID: 0,
      currency_ID: 0,
      recievereturnauth_AMOUNT: null,
      recievereturnauth_DATE: "",
      isapproved: true,
      isactive: true,
    };
  }
  setrecievereturnauth(response) {
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.recievereturnauth = response;
    this.disabled = true;
  }

  update(row) {
    this.edit.next(row);
  }

  setrecievereturnauths(response) {
    if ((this.view == 1 || this.view == 11) && this.disabled == false) {
      this.recievereturnauths = response;
      window.sessionStorage.setItem("recievereturnauths", JSON.stringify(this.recievereturnauths));
    } else {
      this.recievereturnauthsAll = response;
      window.sessionStorage.setItem("recievereturnauthsAll", JSON.stringify(this.recievereturnauthsAll));
    }
    this.cancel.next();
  }

  recievereturnauthGet() {
    this.recievereturnauthservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setrecievereturnauths(this.recievereturnauthservice.getAllDetail(response));
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
          this.setrecievereturnauths(this.recievereturnauthservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }
  recievereturnauthGetOne(id) {
    this.recievereturnauthservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setrecievereturnauth(this.recievereturnauthservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }
  recievereturnauthAdd(recievereturnauth) {
    recievereturnauth.isactive = "Y";
    if (this.view == 5) {
      recievereturnauth.returnauth_ID = this.returnauth.returnauthID;
      recievereturnauth.currency_ID = this.currency.currencyID;

    } else {
      recievereturnauth.returnauth_ID = this.addreturnauth.returnauthID;
      recievereturnauth.currency_ID = this.addcurrency.currencyID;
    }
    this.recievereturnauthservice.add(recievereturnauth).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.recievereturnauth_ID) {
          this.toastrservice.success("Success", "New recievereturnauth Added");
          this.recievereturnauthGetAll();
          this.setrecievereturnauth(this.recievereturnauthservice.getDetail(response));
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
    if (this.view == 5) {
      recievereturnauth.returnauth_ID = this.returnauth.returnauthID;
      recievereturnauth.currency_ID = this.currency.currencyID;
    } else {
      recievereturnauth.returnauth_ID = this.editreturnauth.returnauthID;
      recievereturnauth.currency_ID = this.editcurrency.currencyID;
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
          this.toastrservice.success("Success", "recievereturnauth Updated");
          if (this.disabled == true) {
            this.setrecievereturnauth(this.recievereturnauthservice.getDetail(response));
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

  recievereturnauthSearch(str) {
    var search = {
      search: str
    }
    this.recievereturnauthservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setrecievereturnauths(this.recievereturnauthservice.getAllDetail(response));
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
          this.setrecievereturnauths(this.recievereturnauthservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  recievereturnauthAdvancedSearch(returnauthID, currencyID) {
    this.currencyID = currencyID;
    this.returnauthID = returnauthID;
    var search = {
      currency_ID: currencyID,
      returnauth_ID: returnauthID
    }
    this.recievereturnauthservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setrecievereturnauths(this.recievereturnauthservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  recievereturnauthAdvancedSearchAll(returnauthID, currencyID) {
    this.currencyID = currencyID;
    this.returnauthID = returnauthID;
    var search = {
      currency_ID: currencyID,
      returnauth_ID: returnauthID
    }
    this.recievereturnauthservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setrecievereturnauths(this.recievereturnauthservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
