import { Component, OnInit, Input, Output, ViewChild, EventEmitter, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { LedgerService } from './ledger.service';
import { JournalComponent } from '../journal/journal.component';
import { AccountclassificationComponent } from '../accountclassification/accountclassification.component';

declare var $: any;

@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.css']
})
export class LedgerComponent implements OnInit, AfterViewInit {
  @ViewChild("journal") journal: JournalComponent;
  @ViewChild("addjournal") addjournal: JournalComponent;
  @ViewChild("editjournal") editjournal: JournalComponent;

  @ViewChild("accountclassification") accountclassification: AccountclassificationComponent;
  @ViewChild("addaccountclassification") addaccountclassification: AccountclassificationComponent;
  @ViewChild("editaccountclassification") editaccountclassification: AccountclassificationComponent;

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
  ledgerID = null;
  @Input()
  journalID = null;
  @Input()
  accountclassificationID = null;
  @Input()
  totalcredit: number = 0;
  @Input()
  totaldebit: number = 0;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onLedgerChange = new EventEmitter();

  ledgers = [];
  ledgersAll = [];
  ledger = {
    ledger_ID: 0,
    journal_ID: null,
    accountclassification_ID: null,

    ledger_CODE: null,
    ledger_CREDIT: null,
    ledger_DEBIT: null,
    ledger_NAME: null,

    isactive: true,
  }

  constructor(
    private ledgerservice: LedgerService,
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
    if (window.sessionStorage.getItem('ledgers') != null) {
      this.ledgers = JSON.parse(window.sessionStorage.getItem('ledgers'));
    }
    if (window.sessionStorage.getItem('ledgersAll') != null) {
      this.ledgersAll = JSON.parse(window.sessionStorage.getItem('ledgersAll'));
    }
    if (this.ledgerID != 0 && !this.ledgerID && Number(window.sessionStorage.getItem('ledger')) > 0) {
      this.ledgerID = Number(window.sessionStorage.getItem('ledger'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.ledgers == null || this.ledgers.length == 0 || reload == true)) {
      this.ledgers == null;
      this.ledgerGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.ledgersAll == null || this.ledgersAll.length == 0 || reload == true)) {
      this.ledgersAll == null;
      this.ledgerGetAll();
    }

    var search = {
      journal_ID: this.journalID,
      accountclassification_ID: this.accountclassificationID,
    }

    if (this.view >= 5 && this.view <= 6 && this.ledgerID) {
      window.sessionStorage.setItem("ledger", this.ledgerID);
      this.ledgerGetOne(this.ledgerID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.ledgers == null || this.ledgers.length == 0 || reload == true)) {
      this.ledgers == null;
      this.ledgerAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.ledgersAll == null || this.ledgersAll.length == 0 || reload == true)) {
      this.ledgersAll == null;
      this.ledgerAdvancedSearchAll(search);
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
    if (this.ledgersAll) {
      this.ledgersAll.forEach(totals => {
        const credit = Number(totals.ledger_CREDIT);
        if (!isNaN(credit)) {
          total += credit;
        }
      });
    }
    return total;
  }

  getTotalDebit() {
    let total = 0;
    if (this.ledgersAll) {
      this.ledgersAll.forEach(totals => {
        const debit = Number(totals.ledger_DEBIT);
        if (!isNaN(debit)) {
          total += debit;
        }
      });
    }
    return total;
  }

  onCreditChange() {
    this.ledger.ledger_DEBIT = 0;
    this.creditdisabled = true;
  }

  onDebitChange() {
    this.ledger.ledger_CREDIT = 0;
    this.debitdisabled = true;
  }

  add() {
    this.ledger = {
      ledger_ID: 0,
      journal_ID: null,
      accountclassification_ID: null,

      ledger_CODE: null,
      ledger_CREDIT: null,
      ledger_DEBIT: null,
      ledger_NAME: null,

      isactive: true,
    };
  }

  journalAddNew() {
    this.addjournal.add();
    $("#addjournal").modal("show");
  }

  journalrefresh() {
    this.journal.load(true);
    this.journalCancel();
  }

  journalCancel() {
    $("#addjournal").modal("hide");
    $("#editjournal").modal("hide");
    this.journal.journals = this.addjournal.journals;
  }

  onJournalChange(journal) {
    this.ledger.ledger_NAME = journal.journal_NAME;
  }

  onAccountclassificationChange(accountclassification) { }

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

  ledgerEdit() {
    this.disabled = false;
  }

  ledgerCancel() {
    this.disabled = true;
    if (this.ledger.ledger_ID == 0) {
      this.router.navigate(["/home/ledgers"], {});
    }
  }

  onChange(ledgerID) {
    for (var i = 0; i < this.ledgersAll.length; i++) {
      if (this.ledgersAll[i].ledger_ID == ledgerID) {
        this.onLedgerChange.next(this.ledgersAll[i]);
        break;
      }
    }
  }

  setLedger(response) {
    this.journalID = response.journal_ID;
    this.ledgerID = response.ledger_ID;
    this.accountclassificationID = response.accountclassification_ID;

    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.ledger = response;
  }

  setLedgers(response) {
    this.cancel.next();
    return response;
  }

  ledgerGet() {
    this.ledgerservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.ledgers = this.setLedgers(this.ledgerservice.getAllDetail(response));
          window.sessionStorage.setItem("ledgers", JSON.stringify(this.ledgers));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgerGetAll() {
    this.ledgerservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.ledgersAll = this.setLedgers(this.ledgerservice.getAllDetail(response));
          window.sessionStorage.setItem("ledgersAll", JSON.stringify(this.ledgersAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgerGetOne(id) {
    this.disabled = true;
    this.ledgerservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setLedger(this.ledgerservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgerAdd(ledger) {
    ledger.journal_ID = this.journal.journalID;
    ledger.accountclassification_ID = this.accountclassification.accountclassificationID;

    ledger.isactive = "Y";
    this.ledgerservice.add(ledger).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.ledger_ID) {
          this.toastrservice.success("Success", "New Ledger Added");
          this.setLedger(this.ledgerservice.getDetail(response));
          this.refresh.next();
          this.disabled = true;
          this.ledgerGetAll();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgerUpdate(ledger) {

    ledger.journal_ID = this.journal.journalID;
    ledger.accountclassification_ID = this.accountclassification.accountclassificationID;

    if (ledger.isactive == true) {
      ledger.isactive = "Y";
    } else {
      ledger.isactive = "N";
    }
    this.ledgerservice.update(ledger, ledger.ledger_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.ledger_ID) {
          this.toastrservice.success("Success", "Ledger Updated");
          this.setLedger(this.ledgerservice.getDetail(response));
          this.refresh.next();
          this.disabled = true;
          this.ledgerGetAll();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgerUpdateAll(ledgers) {
    this.ledgerservice.updateAll(ledgers).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Ledgers Updated");
          this.setLedger(this.ledgerservice.getDetail(response));
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgerSearch(str) {
    var search = {
      search: str
    }
    this.ledgerservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.ledgers = this.setLedgers(this.ledgerservice.getAllDetail(response));
          window.sessionStorage.setItem("ledgers", JSON.stringify(this.ledgers));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgerSearchAll(str) {
    var search = {
      search: str
    }
    this.ledgerservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.ledgersAll = this.setLedgers(this.ledgerservice.getAllDetail(response));
          window.sessionStorage.setItem("ledgersAll", JSON.stringify(this.ledgersAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgerAdvancedSearch(search) {
    this.journalID = search.journal_ID;
    this.accountclassificationID = search.accountclassification_ID;

    this.ledgerservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.ledgers = this.setLedgers(this.ledgerservice.getAllDetail(response));
          window.sessionStorage.setItem("ledgers", JSON.stringify(this.ledgers));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgerAdvancedSearchAll(search) {
    this.journalID = search.journal_ID;
    this.accountclassificationID = search.accountclassification_ID;

    this.ledgerservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.ledgersAll = this.setLedgers(this.ledgerservice.getAllDetail(response));
          window.sessionStorage.setItem("ledgersAll", JSON.stringify(this.ledgersAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
