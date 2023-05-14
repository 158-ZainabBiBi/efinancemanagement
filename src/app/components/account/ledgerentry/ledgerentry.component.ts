import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { LedgerentryService } from './ledgerentry.service';
import { JournalComponent } from '../journal/journal.component';

declare var $: any;

@Component({
  selector: 'app-ledgerentry',
  templateUrl: './ledgerentry.component.html',
  styleUrls: ['./ledgerentry.component.css']
})
export class LedgerentryComponent implements OnInit {
  @ViewChild("journal") journal: JournalComponent;
  @ViewChild("addjournal") addjournal: JournalComponent;
  @ViewChild("editjournal") editjournal: JournalComponent;

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
  ledgerentryID = null;
  @Input()
  journalID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onLedgerEntryChange = new EventEmitter();

  ledgerentries = [];
  ledgerentriesAll = [];
  ledgerentry = {
    ledgerentry_ID: 0,
    journal_ID: null,

    ledgerentry_CODE: null,
    ledgerentry_NAME: null,
    credit_AMOUNT: null,
    debit_AMOUNT: null,

    isactive: true,
  }

  constructor(
    private ledgerentryservice: LedgerentryService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload) {
    if (window.sessionStorage.getItem('ledgerentries') != null) {
      this.ledgerentries = JSON.parse(window.sessionStorage.getItem('ledgerentries'));
    }
    if (window.sessionStorage.getItem('ledgerentriesAll') != null) {
      this.ledgerentriesAll = JSON.parse(window.sessionStorage.getItem('ledgerentriesAll'));
    }
    if (this.ledgerentryID != 0 && !this.ledgerentryID && Number(window.sessionStorage.getItem('ledgerentry')) > 0) {
      this.ledgerentryID = Number(window.sessionStorage.getItem('ledgerentry'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.ledgerentries == null || this.ledgerentries.length == 0 || reload == true)) {
      this.ledgerentries == null;
      this.ledgerentryGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.ledgerentriesAll == null || this.ledgerentriesAll.length == 0 || reload == true)) {
      this.ledgerentriesAll == null;
      this.ledgerentryGetAll();
    }

    var search = {
      journal_ID: this.journalID,
    }

    if (this.view >= 5 && this.view <= 6 && this.ledgerentryID) {
      window.sessionStorage.setItem("ledgerentry", this.ledgerentryID);
      this.ledgerentryGetOne(this.ledgerentryID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.ledgerentries == null || this.ledgerentries.length == 0 || reload == true)) {
      this.ledgerentries == null;
      this.ledgerentryAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.ledgerentriesAll == null || this.ledgerentriesAll.length == 0 || reload == true)) {
      this.ledgerentriesAll == null;
      this.ledgerentryAdvancedSearchAll(search);
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
    this.ledgerentry = {
      ledgerentry_ID: 0,
      journal_ID: null,

      ledgerentry_CODE: null,
      ledgerentry_NAME: null,

      credit_AMOUNT: null,
      debit_AMOUNT: null,

      isactive: true,
    };
  }

  journalAddNew() {
    this.addjournal.add();
    $("#addjournal").modal("show");
  }

  journalCancel() {
    $("#addjournal").modal("hide");
    $("#editjournal").modal("hide");
    this.journal.journals = this.addjournal.journals;
  }

  onJournalChange(journal) {
    // this.ledgerentry.ledgerentry_NAME = journal.journal_NAME;
    // this.ledgerentry.ledgerentry_DESC = journal.journal_DESC;
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

  ledgerentryEdit() {
    this.disabled = false;
  }

  ledgerentryCancel() {
    this.disabled = true;
    if (this.ledgerentry.ledgerentry_ID == 0) {
      this.router.navigate(["/home/ledgerentries "], {});
    }
  }

  onChange(ledgerentryID) {
    for (var i = 0; i < this.ledgerentriesAll.length; i++) {
      if (this.ledgerentriesAll[i].ledgerentry_ID == ledgerentryID) {
        this.onLedgerEntryChange.next(this.ledgerentriesAll[i]);
        break;
      }
    }
  }

  setLedgerentry(response) {
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.ledgerentry = response;
  }

  setLedgerentries(response) {
    this.cancel.next();
    return response;
  }

  ledgerentryGet() {
    this.ledgerentryservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.ledgerentries = this.setLedgerentries(this.ledgerentryservice.getAllDetail(response));
          window.sessionStorage.setItem("ledgerentries", JSON.stringify(this.ledgerentries));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgerentryGetAll() {
    this.ledgerentryservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.ledgerentriesAll = this.setLedgerentries(this.ledgerentryservice.getAllDetail(response));
          window.sessionStorage.setItem("ledgerentriesAll", JSON.stringify(this.ledgerentriesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgerentryGetOne(id) {
    this.disabled = true;
    this.ledgerentryservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setLedgerentry(this.ledgerentryservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgerentryAdd(ledgerentry) {
    ledgerentry.isactive = "Y";

    ledgerentry.journal_ID = this.journal.journalID;

    this.ledgerentryservice.add(ledgerentry).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.ledgerentry_ID) {
          this.toastrservice.success("Success", "New Ledger Entry Added");
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

  ledgerentryUpdate(ledgerentry) {
    ledgerentry.journal_ID = this.journal.journalID;

    if (ledgerentry.isactive == true) {
      ledgerentry.isactive = "Y";
    } else {
      ledgerentry.isactive = "N";
    }
    this.ledgerentryservice.update(ledgerentry, ledgerentry.ledgerentry_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.ledgerentry_ID) {
          this.toastrservice.success("Success", "Ledger Entry Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgerentryUpdateAll(ledgerentries) {
    this.ledgerentryservice.updateAll(ledgerentries).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Ledger Entrys Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgerentrySearch(str) {
    var search = {
      search: str
    }
    this.ledgerentryservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.ledgerentries = this.setLedgerentries(this.ledgerentryservice.getAllDetail(response));
          window.sessionStorage.setItem("ledgerentries", JSON.stringify(this.ledgerentries));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgerentrySearchAll(str) {
    var search = {
      search: str
    }
    this.ledgerentryservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.ledgerentriesAll = this.setLedgerentries(this.ledgerentryservice.getAllDetail(response));
          window.sessionStorage.setItem("ledgerentriesAll", JSON.stringify(this.ledgerentriesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgerentryAdvancedSearch(search) {
    this.journalID = search.journal_ID;

    this.ledgerentryservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.ledgerentries = this.setLedgerentries(this.ledgerentryservice.getAllDetail(response));
          window.sessionStorage.setItem("ledgerentries", JSON.stringify(this.ledgerentries));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgerentryAdvancedSearchAll(search) {
    this.journalID = search.journal_ID;

    this.ledgerentryservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.ledgerentriesAll = this.setLedgerentries(this.ledgerentryservice.getAllDetail(response));
          window.sessionStorage.setItem("ledgerentriesAll", JSON.stringify(this.ledgerentriesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
