import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { JournalService } from './journal.service';
import { JournallineComponent } from '../journalline/journalline.component';
import { TransactionComponent } from '../transaction/transaction.component';

declare var $: any;

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.css']
})
export class JournalComponent implements OnInit {
  @ViewChild("journalline") journalline: JournallineComponent;
  @ViewChild("addjournalline") addjournalline: JournallineComponent;
  @ViewChild("editjournalline") editjournalline: JournallineComponent;

  @ViewChild("transaction") transaction: TransactionComponent;
  @ViewChild("addtransaction") addtransaction: TransactionComponent;
  @ViewChild("edittransaction") edittransaction: TransactionComponent;

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
  journallineID = null;
  @Input()
  transactionID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onJournalChange = new EventEmitter();

  journals = [];
  journalsAll = [];
  journal = {
    journal_ID: 0,
    journalline_ID: {
      balance_CREDIT: null,
      balance_DEBIT: null,
    },
    transaction_ID: null,

    journal_CODE: null,

    isactive: true,
  }

  constructor(
    private journalservice: JournalService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
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
      journalline_ID: this.journallineID,
      transaction_ID: this.transactionID,
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
    this.journalsAll.forEach(account => {
      const credit = Number(account.journalline.balance_CREDIT);
      if (!isNaN(credit)) {
        total += credit;
      }
    });
    return total;
  }

  getTotalDebit() {
    let total = 0;
    this.journalsAll.forEach(account => {
      const debit = Number(account.journalline.balance_DEBIT);
      if (!isNaN(debit)) {
        total += debit;
      }
    });
    return total;
  }

  onCreditChange() {
    this.journal.journalline_ID.balance_DEBIT = 0;
    this.creditdisabled = true;
  }

  onDebitChange() {
    this.journal.journalline_ID.balance_CREDIT = 0;
    this.debitdisabled = true;
  }

  add() {
    this.journal = {
      journal_ID: 0,
      journalline_ID: {
        balance_CREDIT: null,
        balance_DEBIT: null,
      },
      transaction_ID: null,

      journal_CODE: null,

      isactive: true,
    };
  }

  journallineAddNew() {
    this.addjournalline.add();
    $("#addjournalline").modal("show");
  }

  journallineCancel() {
    $("#addjournalline").modal("hide");
    $("#editjournalline").modal("hide");
    this.journalline.journallines = this.addjournalline.journallines;
  }

  onJournallineChange(journalline) {
    // this.journal.journal_NAME = journalline.journalline_NAME;
    // this.journal.journal_DESC = journalline.journalline_DESC;
  }

  transactionAddNew() {
    this.addtransaction.add();
    $("#addtransaction").modal("show");
  }

  transactionCancel() {
    $("#addtransaction").modal("hide");
    $("#edittransaction").modal("hide");
    this.transaction.transactions = this.addtransaction.transactions;
  }

  onTransactionChange(transaction) {
    // this.journal.journal_NAME = transaction.transaction_NAME;
    // this.journal.journal_DESC = transaction.transaction_DESC;
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
    journal.isactive = "Y";

    journal.journalline_ID = this.journalline.journallineID;
    journal.transaction_ID = this.transaction.transactionID;

    this.journalservice.add(journal).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.journal_ID) {
          this.toastrservice.success("Success", "New Journal Added");
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

    journal.journalline_ID = this.journalline.journallineID;
    journal.transaction_ID = this.transaction.transactionID;

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
          this.refresh.next();
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
    this.journallineID = search.journalline_ID;
    this.transactionID = search.transaction_ID;

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
    this.journallineID = search.journalline_ID;
    this.transactionID = search.transaction_ID;

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
