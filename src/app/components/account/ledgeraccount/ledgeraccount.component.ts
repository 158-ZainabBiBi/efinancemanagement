import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { LedgeraccountService } from './ledgeraccount.service';
import { LedgeraccountclassificationComponent } from '../ledgeraccountclassification/ledgeraccountclassification.component';

@Component({
  selector: 'app-ledgeraccount',
  templateUrl: './ledgeraccount.component.html',
  styleUrls: ['./ledgeraccount.component.css']
})
export class LedgeraccountComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;

  @ViewChild("ledgeraccountclassification") ledgeraccountclassification: LedgeraccountclassificationComponent;

  @Input()
  view: number = 1;
  @Input()
  iscompulsory: boolean = false;
  @Input()
  isreload: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  debitdisabled: boolean = false;
  @Input()
  creditdisabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  ledgeraccountID = null;
  @Input()
  ledgeraccountclassificationID = null;
  @Input()
  taxcodeID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onLedgerAccountChange = new EventEmitter();

  ledgeraccounts = [];
  ledgeraccountsAll = [];
  ledgeraccount = {
    ledgeraccount_ID: 0,
    ledgeraccountclassification_ID: null,

    ledgeraccount_CODE: null,
    ledgeraccount_DATE: null,
    ledgeraccount_NAME: null,
    ledgeraccount_DESC: null,

    balance_CREDIT: null,
    balance_DEBIT: null,

    isactive: true,
  }

  constructor(
    private ledgeraccountservice: LedgeraccountService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload) {
    if (window.sessionStorage.getItem('ledgeraccounts') != null) {
      this.ledgeraccounts = JSON.parse(window.sessionStorage.getItem('ledgeraccounts'));
    }
    if (window.sessionStorage.getItem('ledgeraccountsAll') != null) {
      this.ledgeraccountsAll = JSON.parse(window.sessionStorage.getItem('ledgeraccountsAll'));
    }
    if (this.ledgeraccountID != 0 && !this.ledgeraccountID && Number(window.sessionStorage.getItem('ledgeraccount')) > 0) {
      this.ledgeraccountID = Number(window.sessionStorage.getItem('ledgeraccount'));
    }

    this.getTotalDebit();
    this.getTotalCredit();

    if (this.view >= 1 && this.view <= 2 && (this.ledgeraccounts == null || this.ledgeraccounts.length == 0 || reload == true)) {
      this.ledgeraccounts == null;
      this.ledgeraccountGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.ledgeraccountsAll == null || this.ledgeraccountsAll.length == 0 || reload == true)) {
      this.ledgeraccountsAll == null;
      this.ledgeraccountGetAll();
    }

    var search = {
      ledgeraccountclassification_ID: this.ledgeraccountclassificationID,
    }

    if (this.view >= 5 && this.view <= 6 && this.ledgeraccountID) {
      window.sessionStorage.setItem("ledgeraccount", this.ledgeraccountID);
      this.ledgeraccountGetOne(this.ledgeraccountID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.ledgeraccounts == null || this.ledgeraccounts.length == 0 || reload == true)) {
      this.ledgeraccounts == null;
      this.ledgeraccountAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.ledgeraccountsAll == null || this.ledgeraccountsAll.length == 0 || reload == true)) {
      this.ledgeraccountsAll == null;
      this.ledgeraccountAdvancedSearchAll(search);
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
      },
      // {
      //   location: 'after',
      //   text: `Total Credit: ${this.getTotalCredit()}`,
      // },
      // {
      //   location: 'after',
      //   text: `Total Debit: ${this.getTotalDebit()}`,
      // }
    );
  }

  getTotalCredit() {
    let total = 0;
    this.ledgeraccountsAll.forEach(account => {
      const credit = Number(account.balance_CREDIT);
      if (!isNaN(credit)) {
        total += credit;
      }
    });
    return total;
  }

  getTotalDebit() {
    let total = 0;
    this.ledgeraccountsAll.forEach(account => {
      const debit = Number(account.balance_DEBIT);
      if (!isNaN(debit)) {
        total += debit;
      }
    });
    return total;
  }

  onCreditChange() {
    this.ledgeraccount.balance_DEBIT = 0;
    this.creditdisabled = true;
  }

  onDebitChange() {
    this.ledgeraccount.balance_CREDIT = 0;
    this.debitdisabled = true;
  }

  add() {
    this.ledgeraccount = {
      ledgeraccount_ID: 0,
      ledgeraccountclassification_ID: null,

      ledgeraccount_CODE: null,
      ledgeraccount_DATE: null,
      ledgeraccount_NAME: null,
      ledgeraccount_DESC: null,

      balance_CREDIT: null,
      balance_DEBIT: null,

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

  ledgeraccountEdit() {
    this.disabled = false;
  }

  ledgeraccountCancel() {
    this.disabled = true;
    if (this.ledgeraccount.ledgeraccount_ID == 0) {
      this.router.navigate(["/home/ledgeraccounts"], {});
    }
  }

  onChange(ledgeraccountID) {
    for (var i = 0; i < this.ledgeraccountsAll.length; i++) {
      if (this.ledgeraccountsAll[i].ledgeraccount_ID == ledgeraccountID) {
        this.onLedgerAccountChange.next(this.ledgeraccountsAll[i]);
        break;
      }
    }
  }

  setLedgeraccount(response) {
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.ledgeraccount = response;
  }

  setLedgeraccounts(response) {
    this.cancel.next();
    return response;
  }

  ledgeraccountGet() {
    this.ledgeraccountservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.ledgeraccounts = this.setLedgeraccounts(this.ledgeraccountservice.getAllDetail(response));
          window.sessionStorage.setItem("ledgeraccounts", JSON.stringify(this.ledgeraccounts));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgeraccountGetAll() {
    this.ledgeraccountservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.ledgeraccountsAll = this.setLedgeraccounts(this.ledgeraccountservice.getAllDetail(response));
          window.sessionStorage.setItem("ledgeraccountsAll", JSON.stringify(this.ledgeraccountsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgeraccountGetOne(id) {
    this.disabled = true;
    this.ledgeraccountservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setLedgeraccount(this.ledgeraccountservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgeraccountAdd(ledgeraccount) {
    ledgeraccount.isactive = "Y";
    ledgeraccount.ledgeraccountclassification_ID = this.ledgeraccountclassification.ledgeraccountclassificationID;

    this.ledgeraccountservice.add(ledgeraccount).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.ledgeraccount_ID) {
          this.toastrservice.success("Success", "New Ledger Account Added");
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

  ledgeraccountUpdate(ledgeraccount) {

    ledgeraccount.ledgeraccountclassification_ID = this.ledgeraccountclassification.ledgeraccountclassificationID;

    if (ledgeraccount.isactive == true) {
      ledgeraccount.isactive = "Y";
    } else {
      ledgeraccount.isactive = "N";
    }
    this.ledgeraccountservice.update(ledgeraccount, ledgeraccount.ledgeraccount_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.ledgeraccount_ID) {
          this.toastrservice.success("Success", "Ledger Account Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgeraccountUpdateAll(ledgeraccounts) {
    this.ledgeraccountservice.updateAll(ledgeraccounts).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Ledger Accounts Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgeraccountSearch(str) {
    var search = {
      search: str
    }
    this.ledgeraccountservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.ledgeraccounts = this.setLedgeraccounts(this.ledgeraccountservice.getAllDetail(response));
          window.sessionStorage.setItem("ledgeraccounts", JSON.stringify(this.ledgeraccounts));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgeraccountSearchAll(str) {
    var search = {
      search: str
    }
    this.ledgeraccountservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.ledgeraccountsAll = this.setLedgeraccounts(this.ledgeraccountservice.getAllDetail(response));
          window.sessionStorage.setItem("ledgeraccountsAll", JSON.stringify(this.ledgeraccountsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgeraccountAdvancedSearch(search) {
    this.ledgeraccountclassificationID = search.ledgeraccountclassification_ID;

    this.ledgeraccountservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.ledgeraccounts = this.setLedgeraccounts(this.ledgeraccountservice.getAllDetail(response));
          window.sessionStorage.setItem("ledgeraccounts", JSON.stringify(this.ledgeraccounts));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgeraccountAdvancedSearchAll(search) {
    this.ledgeraccountclassificationID = search.ledgeraccountclassification_ID;

    this.ledgeraccountservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.ledgeraccountsAll = this.setLedgeraccounts(this.ledgeraccountservice.getAllDetail(response));
          window.sessionStorage.setItem("ledgeraccountsAll", JSON.stringify(this.ledgeraccountsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
