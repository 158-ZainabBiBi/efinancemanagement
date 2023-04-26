import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { CoaaccountService } from './coaaccount.service';
import { LedgeraccountComponent } from '../ledgeraccount/ledgeraccount.component';

@Component({
  selector: 'app-coaaccount',
  templateUrl: './coaaccount.component.html',
  styleUrls: ['./coaaccount.component.css']
})
export class CoaaccountComponent implements OnInit {
  @ViewChild("ledgeraccount") ledgeraccount: LedgeraccountComponent;

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
  coaaccountID = null;
  @Input()
  ledgeraccountID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onCoaAccountChange = new EventEmitter();

  coaaccounts = [];
  coaaccountsAll = [];
  coaaccount = {
    coaaccount_ID: 0,
    ledgeraccount_ID: null,

    coaaccount_CODE: null,
    coaaccount_NAME: null,
    coaaccount_DESC: null,

    isactive: true,
  }

  constructor(
    private coaaccountservice: CoaaccountService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload) {
    if (window.sessionStorage.getItem('coaaccounts') != null) {
      this.coaaccounts = JSON.parse(window.sessionStorage.getItem('coaaccounts'));
    }
    if (window.sessionStorage.getItem('coaaccountsAll') != null) {
      this.coaaccountsAll = JSON.parse(window.sessionStorage.getItem('coaaccountsAll'));
    }
    if (this.coaaccountID != 0 && !this.coaaccountID && Number(window.sessionStorage.getItem('coaaccount')) > 0) {
      this.coaaccountID = Number(window.sessionStorage.getItem('coaaccount'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.coaaccounts == null || this.coaaccounts.length == 0 || reload == true)) {
      this.coaaccounts == null;
      this.coaaccountGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.coaaccountsAll == null || this.coaaccountsAll.length == 0 || reload == true)) {
      this.coaaccountsAll == null;
      this.coaaccountGetAll();
    }

    var search = {
      ledgeraccount_ID: this.ledgeraccountID
    }

    if (this.view >= 5 && this.view <= 6 && this.coaaccountID) {
      window.sessionStorage.setItem("coaaccount", this.coaaccountID);
      this.coaaccountGetOne(this.coaaccountID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.coaaccounts == null || this.coaaccounts.length == 0 || reload == true)) {
      this.coaaccounts == null;
      this.coaaccountAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.coaaccountsAll == null || this.coaaccountsAll.length == 0 || reload == true)) {
      this.coaaccountsAll == null;
      this.coaaccountAdvancedSearchAll(search);
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
    this.coaaccount = {
      coaaccount_ID: 0,
      ledgeraccount_ID: null,

      coaaccount_CODE: null,
      coaaccount_NAME: null,
      coaaccount_DESC: null,

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

  coaaccountEdit() {
    this.disabled = false;
  }

  coaaccountCancel() {
    this.disabled = true;
    if (this.coaaccount.coaaccount_ID == 0) {
      this.router.navigate(["/home/coaaccounts "], {});
    }
  }

  onChange(coaaccountID) {
    for (var i = 0; i < this.coaaccountsAll.length; i++) {
      if (this.coaaccountsAll[i].coaaccount_ID == coaaccountID) {
        this.onCoaAccountChange.next(this.coaaccountsAll[i]);
        break;
      }
    }
  }

  setCoaaccount(response) {
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.coaaccount = response;
  }

  setCoaaccounts(response) {
    this.cancel.next();
    return response;
  }

  coaaccountGet() {
    this.coaaccountservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.coaaccounts = this.setCoaaccounts(this.coaaccountservice.getAllDetail(response));
          window.sessionStorage.setItem("coaaccounts", JSON.stringify(this.coaaccounts));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  coaaccountGetAll() {
    this.coaaccountservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.coaaccountsAll = this.setCoaaccounts(this.coaaccountservice.getAllDetail(response));
          window.sessionStorage.setItem("coaaccountsAll", JSON.stringify(this.coaaccountsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  coaaccountGetOne(id) {
    this.disabled = true;
    this.coaaccountservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setCoaaccount(this.coaaccountservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  coaaccountAdd(coaaccount) {
    coaaccount.isactive = "Y";

    coaaccount.ledgeraccount_ID = this.ledgeraccount.ledgeraccountID;

    this.coaaccountservice.add(coaaccount).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.coaaccount_ID) {
          this.toastrservice.success("Success", "New Coa Account Added");
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

  coaaccountUpdate(coaaccount) {

    coaaccount.ledgeraccount_ID = this.ledgeraccount.ledgeraccountID;

    if (coaaccount.isactive == true) {
      coaaccount.isactive = "Y";
    } else {
      coaaccount.isactive = "N";
    }
    this.coaaccountservice.update(coaaccount, coaaccount.coaaccount_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.coaaccount_ID) {
          this.toastrservice.success("Success", "Coa Account Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  coaaccountUpdateAll(coaaccounts) {
    this.coaaccountservice.updateAll(coaaccounts).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Coa Accounts Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  coaaccountSearch(str) {
    var search = {
      search: str
    }
    this.coaaccountservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.coaaccounts = this.setCoaaccounts(this.coaaccountservice.getAllDetail(response));
          window.sessionStorage.setItem("coaaccounts", JSON.stringify(this.coaaccounts));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  coaaccountSearchAll(str) {
    var search = {
      search: str
    }
    this.coaaccountservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.coaaccountsAll = this.setCoaaccounts(this.coaaccountservice.getAllDetail(response));
          window.sessionStorage.setItem("coaaccountsAll", JSON.stringify(this.coaaccountsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  coaaccountAdvancedSearch(search) {
    this.ledgeraccountID = search.ledgeraccount_ID;

    this.coaaccountservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.coaaccounts = this.setCoaaccounts(this.coaaccountservice.getAllDetail(response));
          window.sessionStorage.setItem("coaaccounts", JSON.stringify(this.coaaccounts));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  coaaccountAdvancedSearchAll(search) {
    this.ledgeraccountID = search.ledgeraccount_ID;

    this.coaaccountservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.coaaccountsAll = this.setCoaaccounts(this.coaaccountservice.getAllDetail(response));
          window.sessionStorage.setItem("coaaccountsAll", JSON.stringify(this.coaaccountsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
