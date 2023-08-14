import { Component, OnInit, Input, Output, ViewChild, EventEmitter, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { BalancesheetService } from './balancesheet.service';
import { LedgerComponent } from '../ledger/ledger.component';

declare var $: any;

@Component({
  selector: 'app-balancesheet',
  templateUrl: './balancesheet.component.html',
  styleUrls: ['./balancesheet.component.css']
})
export class BalancesheetComponent implements OnInit, AfterViewInit {
  @ViewChild("ledger") ledger: LedgerComponent;
  @ViewChild("addledger") addledger: LedgerComponent;
  @ViewChild("editledger") editledger: LedgerComponent;

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
  balancesheetID = null;
  @Input()
  ledgerID = null;
  @Input()
  totalcredit: number = 0;
  @Input()
  totaldebit: number = 0;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onBalanceSheetChange = new EventEmitter();

  balancesheets = [];
  balancesheetsAll = [];
  balancesheet = {
    balancesheet_ID: 0,
    balancesheet_CODE: null,
    balancesheet_NAME: null,
    ledger_ID: null,
    isactive: true
  }

  constructor(
    private balancesheetservice: BalancesheetService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  ngAfterViewInit(): void {
    this.totalcredit = this.getTotalCredit();
    this.totaldebit = this.getTotalDebit();
    this.cdr.detectChanges();
  }

  load(reload) {
    if (window.sessionStorage.getItem('balancesheets') != null) {
      this.balancesheets = JSON.parse(window.sessionStorage.getItem('balancesheets'));
    }
    if (window.sessionStorage.getItem('balancesheetsAll') != null) {
      this.balancesheetsAll = JSON.parse(window.sessionStorage.getItem('balancesheetsAll'));
    }
    if (this.balancesheetID != 0 && !this.balancesheetID && Number(window.sessionStorage.getItem('balancesheet')) > 0) {
      this.balancesheetID = Number(window.sessionStorage.getItem('balancesheet'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.balancesheets == null || this.balancesheets.length == 0 || reload == true)) {
      this.balancesheets == null;
      this.balancesheetGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.balancesheetsAll == null || this.balancesheetsAll.length == 0 || reload == true)) {
      this.balancesheetsAll == null;
      this.balancesheetGetAll();
    }

    var search = {
      ledger_ID: this.ledgerID
    }

    if (this.view >= 5 && this.view <= 6 && this.balancesheetID) {
      window.sessionStorage.setItem("balancesheet", this.balancesheetID);
      this.balancesheetGetOne(this.balancesheetID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.balancesheets == null || this.balancesheets.length == 0 || reload == true)) {
      this.balancesheets == null;
      this.balancesheetAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.balancesheetsAll == null || this.balancesheetsAll.length == 0 || reload == true)) {
      this.balancesheetsAll == null;
      this.balancesheetAdvancedSearchAll(search);
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
    );
  }

  getTotalCredit() {
    let total = 0;
    if (this.balancesheetsAll) {
      this.balancesheetsAll.forEach(totals => {
        const credit = Number(totals.ledger.ledger_CREDIT);
        if (!isNaN(credit)) {
          total += credit;
        }
      });
    }
    return total;
  }

  getTotalDebit() {
    let total = 0;
    if (this.balancesheetsAll) {
      this.balancesheetsAll.forEach(totals => {
        const debit = Number(totals.ledger.ledger_DEBIT);
        if (!isNaN(debit)) {
          total += debit;
        }
      });
    }
    return total;
  }

  add() {
    this.balancesheet = {
      balancesheet_ID: 0,
      balancesheet_CODE: null,
      balancesheet_NAME: null,
      ledger_ID: null,
      isactive: true
    };
  }

  ledgerAddNew() {
    this.addledger.add();
    $("#addledger").modal("show");
  }

  ledgerrefresh() {
    this.ledger.load(true);
    this.ledgerCancel();
  }

  ledgerCancel() {
    $("#addledger").modal("hide");
    $("#editledger").modal("hide");
    this.ledger.ledgers = this.addledger.ledgers;
  }

  onLedgerChange(ledger) {
    this.balancesheet.balancesheet_NAME = ledger.ledger_NAME;
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

  balancesheetEdit() {
    this.disabled = false;
  }

  balancesheetCancel() {
    this.disabled = true;
    if (this.balancesheet.balancesheet_ID == 0) {
      this.router.navigate(["/home/balancesheets"], {});
    }
  }

  onChange(balancesheetID) {
    for (var i = 0; i < this.balancesheetsAll.length; i++) {
      if (this.balancesheetsAll[i].balancesheet_ID == balancesheetID) {
        this.onBalanceSheetChange.next(this.balancesheetsAll[i]);
        break;
      }
    }
  }

  setBalancesheet(response) {
    this.ledgerID = response.ledger_ID;
    this.balancesheetID = response.balancesheet_ID;

    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.balancesheet = response;
  }

  setBalancesheets(response) {
    this.cancel.next();
    return response;
  }

  balancesheetGet() {
    this.balancesheetservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.balancesheets = this.setBalancesheets(this.balancesheetservice.getAllDetail(response));
          window.sessionStorage.setItem("balancesheets", JSON.stringify(this.balancesheets));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  balancesheetGetAll() {
    this.balancesheetservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.balancesheetsAll = this.setBalancesheets(this.balancesheetservice.getAllDetail(response));
          window.sessionStorage.setItem("balancesheetsAll", JSON.stringify(this.balancesheetsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  balancesheetGetOne(id) {
    this.disabled = true;
    this.balancesheetservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setBalancesheet(this.balancesheetservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  balancesheetAdd(balancesheet) {
    balancesheet.ledger_ID = this.ledger.ledgerID;

    balancesheet.isactive = "Y";
    this.balancesheetservice.add(balancesheet).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.balancesheet_ID) {
          this.toastrservice.success("Success", "New Balance Sheet Added");
          this.setBalancesheet(this.balancesheetservice.getDetail(response));
          this.refresh.next();
          this.disabled = true;
          this.balancesheetGetAll();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  balancesheetUpdate(balancesheet) {

    balancesheet.ledger_ID = this.ledger.ledgerID;

    if (balancesheet.isactive == true) {
      balancesheet.isactive = "Y";
    } else {
      balancesheet.isactive = "N";
    }
    this.balancesheetservice.update(balancesheet, balancesheet.balancesheet_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.balancesheet_ID) {
          this.toastrservice.success("Success", "Balance Sheet Updated");
          this.setBalancesheet(this.balancesheetservice.getDetail(response));
          this.refresh.next();
          this.disabled = true;
          this.balancesheetGetAll();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  balancesheetUpdateAll(balancesheets) {
    this.balancesheetservice.updateAll(balancesheets).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Balance Sheets Updated");
          this.setBalancesheet(this.balancesheetservice.getDetail(response));
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  balancesheetSearch(str) {
    var search = {
      search: str
    }
    this.balancesheetservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.balancesheets = this.setBalancesheets(this.balancesheetservice.getAllDetail(response));
          window.sessionStorage.setItem("balancesheets", JSON.stringify(this.balancesheets));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  balancesheetSearchAll(str) {
    var search = {
      search: str
    }
    this.balancesheetservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.balancesheetsAll = this.setBalancesheets(this.balancesheetservice.getAllDetail(response));
          window.sessionStorage.setItem("balancesheetsAll", JSON.stringify(this.balancesheetsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  balancesheetAdvancedSearch(search) {
    this.ledgerID = search.ledger_ID;

    this.balancesheetservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.balancesheets = this.setBalancesheets(this.balancesheetservice.getAllDetail(response));
          window.sessionStorage.setItem("balancesheets", JSON.stringify(this.balancesheets));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  balancesheetAdvancedSearchAll(search) {
    this.ledgerID = search.ledger_ID;

    this.balancesheetservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.balancesheetsAll = this.setBalancesheets(this.balancesheetservice.getAllDetail(response));
          window.sessionStorage.setItem("balancesheetsAll", JSON.stringify(this.balancesheetsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
