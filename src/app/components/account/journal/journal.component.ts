import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { AccountComponent } from '../account/account.component';
import { TransactionComponent } from '../transaction/transaction.component';
import { JournalService } from './journal.service';

declare var $: any;

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.css']
})
export class JournalComponent implements OnInit, AfterViewInit {
  @ViewChild("transaction") transaction: TransactionComponent;
  @ViewChild("addtransaction") addtransaction: TransactionComponent;
  @ViewChild("edittransaction") edittransaction: TransactionComponent;

  @ViewChild("account") account: AccountComponent;
  @ViewChild("addaccount") addaccount: AccountComponent;
  @ViewChild("editaccount") editaccount: AccountComponent;

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
  journalID = null;
  @Input()
  transactionID = null;
  @Input()
  accountID = null;
  @Input()
  totalcredit: number = 0;
  @Input()
  totaldebit: number = 0;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onJournalChange = new EventEmitter();

  journals = [];
  journalsAll = [];
  journal = {
    journal_ID: 0,
    transaction_ID: null,
    account_ID: null,

    journal_CODE: null,
    journal_NAME: null,
    journal_DEBIT: null,
    journal_CREDIT: null,

    isactive: true,
  }

  constructor(
    private journalservice: JournalService,
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
    if (window.sessionStorage.getItem('journals') != null) {
      this.journals = JSON.parse(window.sessionStorage.getItem('journals'));
    }
    if (window.sessionStorage.getItem('journalsAll') != null) {
      this.journalsAll = JSON.parse(window.sessionStorage.getItem('journalsAll'));
    }
    if (this.journalID != 0 && !this.journalID && Number(window.sessionStorage.getItem('journal')) > 0) {
      this.journalID = Number(window.sessionStorage.getItem('journal'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.journals == null || this.journals.length == 0 || reload == true)) {
      this.journals == null;
      this.journalGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.journalsAll == null || this.journalsAll.length == 0 || reload == true)) {
      this.journalsAll == null;
      this.journalGetAll();
    }

    var search = {
      transaction_ID: this.transactionID,
      account_ID: this.accountID,
    }

    if (this.view >= 5 && this.view <= 6 && this.journalID) {
      window.sessionStorage.setItem("journal", this.journalID);
      this.journalGetOne(this.journalID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.journals == null || this.journals.length == 0 || reload == true)) {
      this.journals == null;
      this.journalAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.journalsAll == null || this.journalsAll.length == 0 || reload == true)) {
      this.journalsAll == null;
      this.journalAdvancedSearchAll(search);
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
    if (this.journalsAll) {
      this.journalsAll.forEach(totals => {
        const credit = Number(totals.journal_CREDIT);
        if (!isNaN(credit)) {
          total += credit;
        }
      });
    }
    return total;
  }

  getTotalDebit() {
    let total = 0;
    if (this.journalsAll) {
      this.journalsAll.forEach(totals => {
        const debit = Number(totals.journal_DEBIT);
        if (!isNaN(debit)) {
          total += debit;
        }
      });
    }
    return total;
  }

  onCreditChange() {
    this.journal.journal_DEBIT = 0;
    this.creditdisabled = true;
  }

  onDebitChange() {
    this.journal.journal_CREDIT = 0;
    this.debitdisabled = true;
  }

  add() {
    this.journal = {
      journal_ID: 0,
      transaction_ID: null,
      account_ID: null,

      journal_CODE: null,
      journal_NAME: null,
      journal_DEBIT: null,
      journal_CREDIT: null,

      isactive: true,
    };
  }

  transactionAddNew() {
    this.addtransaction.add();
    $("#addtransaction").modal("show");
  }

  transactionrefresh() {
    this.transaction.load(true);
    this.transactionCancel();
  }

  transactionCancel() {
    $("#addtransaction").modal("hide");
    $("#edittransaction").modal("hide");
    this.transaction.transactions = this.addtransaction.transactions;
  }

  onTransactionChange(transaction) { }

  onAccountChange(account) {
    this.journal.journal_NAME = account.account_TITLE;
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

  journalEdit() {
    this.disabled = false;
  }

  journalCancel() {
    this.disabled = true;
    if (this.journal.journal_ID == 0) {
      this.router.navigate(["/home/journals"], {});
    }
  }

  onChange(journalID) {
    for (var i = 0; i < this.journalsAll.length; i++) {
      if (this.journalsAll[i].journal_ID == journalID) {
        this.onJournalChange.next(this.journalsAll[i]);
        break;
      }
    }
  }

  setJournal(response) {
    this.transactionID = response.transaction_ID;
    this.journalID = response.journal_ID;
    this.accountID = response.account_ID;

    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.journal = response;
  }

  setJournals(response) {
    this.cancel.next();
    return response;
  }

  journalGet() {
    this.journalservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.journals = this.setJournals(this.journalservice.getAllDetail(response));
          window.sessionStorage.setItem("journals", JSON.stringify(this.journals));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  journalGetAll() {
    this.journalservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.journalsAll = this.setJournals(this.journalservice.getAllDetail(response));
          window.sessionStorage.setItem("journalsAll", JSON.stringify(this.journalsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  journalGetOne(id) {
    this.disabled = true;
    this.journalservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setJournal(this.journalservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  journalAdd(journal) {
    journal.transaction_ID = this.transaction.transactionID;
    journal.account_ID = this.account.accountID;

    journal.isactive = "Y";
    this.journalservice.add(journal).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.journal_ID) {
          this.toastrservice.success("Success", "New Journal Added");
          this.setJournal(this.journalservice.getDetail(response));
          this.refresh.next();
          this.disabled = true;
          this.journalGetAll();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  journalUpdate(journal) {

    journal.transaction_ID = this.transaction.transactionID;
    journal.account_ID = this.account.accountID;

    if (journal.isactive == true) {
      journal.isactive = "Y";
    } else {
      journal.isactive = "N";
    }
    this.journalservice.update(journal, journal.journal_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.journal_ID) {
          this.toastrservice.success("Success", "Journal Updated");
          this.setJournal(this.journalservice.getDetail(response));
          this.refresh.next();
          this.disabled = true;
          this.journalGetAll();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  journalUpdateAll(journals) {
    this.journalservice.updateAll(journals).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Journals Updated");
          this.setJournal(this.journalservice.getDetail(response));
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  journalSearch(str) {
    var search = {
      search: str
    }
    this.journalservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.journals = this.setJournals(this.journalservice.getAllDetail(response));
          window.sessionStorage.setItem("journals", JSON.stringify(this.journals));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  journalSearchAll(str) {
    var search = {
      search: str
    }
    this.journalservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.journalsAll = this.setJournals(this.journalservice.getAllDetail(response));
          window.sessionStorage.setItem("journalsAll", JSON.stringify(this.journalsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  journalAdvancedSearch(search) {
    this.transactionID = search.transaction_ID;
    this.accountID = search.account_ID;

    this.journalservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.journals = this.setJournals(this.journalservice.getAllDetail(response));
          window.sessionStorage.setItem("journals", JSON.stringify(this.journals));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  journalAdvancedSearchAll(search) {
    this.transactionID = search.transaction_ID;
    this.accountID = search.account_ID;

    this.journalservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.journalsAll = this.setJournals(this.journalservice.getAllDetail(response));
          window.sessionStorage.setItem("journalsAll", JSON.stringify(this.journalsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
