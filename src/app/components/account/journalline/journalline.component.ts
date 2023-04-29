import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { JournallineService } from './journalline.service';
import { LedgeraccountComponent } from '../ledgeraccount/ledgeraccount.component';

declare var $: any;

@Component({
  selector: 'app-journalline',
  templateUrl: './journalline.component.html',
  styleUrls: ['./journalline.component.css']
})
export class JournallineComponent implements OnInit {
  @ViewChild("ledgeraccount") ledgeraccount: LedgeraccountComponent;
  @ViewChild("addledgeraccount") addledgeraccount: LedgeraccountComponent;
  @ViewChild("editledgeraccount") editledgeraccount: LedgeraccountComponent;

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
  journallineID = null;
  @Input()
  ledgeraccountID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onJournalLineChange = new EventEmitter();

  journallines = [];
  journallinesAll = [];
  journalline = {
    journalline_ID: 0,
    ledgeraccount_ID: null,

    journalline_CODE: null,
    journalline_NAME: null,
    journalline_DESC: null,

    isactive: true,
  }

  constructor(
    private journallineservice: JournallineService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload) {
    if (window.sessionStorage.getItem('journallines') != null) {
      this.journallines = JSON.parse(window.sessionStorage.getItem('journallines'));
    }
    if (window.sessionStorage.getItem('journallinesAll') != null) {
      this.journallinesAll = JSON.parse(window.sessionStorage.getItem('journallinesAll'));
    }
    if (this.journallineID != 0 && !this.journallineID && Number(window.sessionStorage.getItem('journalline')) > 0) {
      this.journallineID = Number(window.sessionStorage.getItem('journalline'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.journallines == null || this.journallines.length == 0 || reload == true)) {
      this.journallines == null;
      this.journallineGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.journallinesAll == null || this.journallinesAll.length == 0 || reload == true)) {
      this.journallinesAll == null;
      this.journallineGetAll();
    }

    var search = {
      ledgeraccount_ID: this.ledgeraccountID,
    }

    if (this.view >= 5 && this.view <= 6 && this.journallineID) {
      window.sessionStorage.setItem("journalline", this.journallineID);
      this.journallineGetOne(this.journallineID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.journallines == null || this.journallines.length == 0 || reload == true)) {
      this.journallines == null;
      this.journallineAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.journallinesAll == null || this.journallinesAll.length == 0 || reload == true)) {
      this.journallinesAll == null;
      this.journallineAdvancedSearchAll(search);
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
    this.journalline = {
      journalline_ID: 0,
      ledgeraccount_ID: null,

      journalline_CODE: null,
      journalline_NAME: null,
      journalline_DESC: null,

      isactive: true,
    };
  }

  ledgeraccountAddNew() {
    this.addledgeraccount.add();
    $("#addledgeraccount").modal("show");
  }

  ledgeraccountCancel() {
    $("#addledgeraccount").modal("hide");
    $("#editledgeraccount").modal("hide");
    this.ledgeraccount.ledgeraccounts = this.addledgeraccount.ledgeraccounts;
  }

  onLedgeraccountChange(ledgeraccount) {
    this.journalline.journalline_NAME = ledgeraccount.ledgeraccount_NAME;
    this.journalline.journalline_DESC = ledgeraccount.ledgeraccount_DESC;
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

  journallineEdit() {
    this.disabled = false;
  }

  journallineCancel() {
    this.disabled = true;
    if (this.journalline.journalline_ID == 0) {
      this.router.navigate(["/home/journallines "], {});
    }
  }

  onChange(journallineID) {
    for (var i = 0; i < this.journallinesAll.length; i++) {
      if (this.journallinesAll[i].journalline_ID == journallineID) {
        this.onJournalLineChange.next(this.journallinesAll[i]);
        break;
      }
    }
  }

  setJournalline(response) {
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.journalline = response;
  }

  setJournallines(response) {
    this.cancel.next();
    return response;
  }

  journallineGet() {
    this.journallineservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.journallines = this.setJournallines(this.journallineservice.getAllDetail(response));
          window.sessionStorage.setItem("journallines", JSON.stringify(this.journallines));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  journallineGetAll() {
    this.journallineservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.journallinesAll = this.setJournallines(this.journallineservice.getAllDetail(response));
          window.sessionStorage.setItem("journallinesAll", JSON.stringify(this.journallinesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  journallineGetOne(id) {
    this.disabled = true;
    this.journallineservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setJournalline(this.journallineservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  journallineAdd(journalline) {
    journalline.isactive = "Y";

    journalline.ledgeraccount_ID = this.ledgeraccount.ledgeraccountID;

    this.journallineservice.add(journalline).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.journalline_ID) {
          this.toastrservice.success("Success", "New Journal Line Added");
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

  journallineUpdate(journalline) {

    journalline.ledgeraccount_ID = this.ledgeraccount.ledgeraccountID;

    if (journalline.isactive == true) {
      journalline.isactive = "Y";
    } else {
      journalline.isactive = "N";
    }
    this.journallineservice.update(journalline, journalline.journalline_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.journalline_ID) {
          this.toastrservice.success("Success", "Journal Line Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  journallineUpdateAll(journallines) {
    this.journallineservice.updateAll(journallines).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Journal Lines Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  journallineSearch(str) {
    var search = {
      search: str
    }
    this.journallineservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.journallines = this.setJournallines(this.journallineservice.getAllDetail(response));
          window.sessionStorage.setItem("journallines", JSON.stringify(this.journallines));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  journallineSearchAll(str) {
    var search = {
      search: str
    }
    this.journallineservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.journallinesAll = this.setJournallines(this.journallineservice.getAllDetail(response));
          window.sessionStorage.setItem("journallinesAll", JSON.stringify(this.journallinesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  journallineAdvancedSearch(search) {
    this.ledgeraccountID = search.ledgeraccount_ID;

    this.journallineservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.journallines = this.setJournallines(this.journallineservice.getAllDetail(response));
          window.sessionStorage.setItem("journallines", JSON.stringify(this.journallines));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  journallineAdvancedSearchAll(search) {
    this.ledgeraccountID = search.ledgeraccount_ID;

    this.journallineservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.journallinesAll = this.setJournallines(this.journallineservice.getAllDetail(response));
          window.sessionStorage.setItem("journallinesAll", JSON.stringify(this.journallinesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
