import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { LedgerentryService } from './ledgerentry.service';
import { LedgeraccountComponent } from '../ledgeraccount/ledgeraccount.component';
import { TransactionComponent } from '../transaction/transaction.component';

declare var $: any;

@Component({
  selector: 'app-ledgerentry',
  templateUrl: './ledgerentry.component.html',
  styleUrls: ['./ledgerentry.component.css']
})
export class LedgerentryComponent implements OnInit {
  @ViewChild("ledgeraccount") ledgeraccount: LedgeraccountComponent;
  @ViewChild("addledgeraccount") addledgeraccount: LedgeraccountComponent;
  @ViewChild("editledgeraccount") editledgeraccount: LedgeraccountComponent;
  @ViewChild("transaction") transaction: TransactionComponent;

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
  ledgeraccountID = null;
  @Input()
  transactionID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onLedgerEntryChange = new EventEmitter();

  ledgerentrys = [];
  ledgerentrysAll = [
    {
      ledgerentry_ID: 1,
      ledgerentry_CODE: 'LE001',
      ledgerentry_NAME: 'Dummy Ledger Entry 1',
      transaction: {
        transaction_CODE: 'TR001',
        transaction_DATE: '2023-04-30'
      },
      ledgeraccount: {
        ledgeraccount_NAME: 'Dummy Account 1'
      },
      credit_AMOUNT: 1000,
      debit_AMOUNT: 0,
      ledgerentry_DESC: 'This is a dummy ledger entry.',
      isactive: true
    },
    {
      ledgerentry_ID: 2,
      ledgerentry_CODE: 'LE002',
      ledgerentry_NAME: 'Dummy Ledger Entry 2',
      transaction: {
        transaction_CODE: 'TR002',
        transaction_DATE: '2023-04-30'
      },
      ledgeraccount: {
        ledgeraccount_NAME: 'Dummy Account 2'
      },
      credit_AMOUNT: 0,
      debit_AMOUNT: 500,
      ledgerentry_DESC: 'This is another dummy ledger entry.',
      isactive: false
    }
  ];
  ledgerentry = {
    ledgerentry_ID: 0,
    ledgeraccount_ID: null,
    transaction_ID: null,

    ledgerentry_CODE: null,
    ledgerentry_NAME: null,
    ledgerentry_DESC: null,

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
    if (window.sessionStorage.getItem('ledgerentrys') != null) {
      this.ledgerentrys = JSON.parse(window.sessionStorage.getItem('ledgerentrys'));
    }
    if (window.sessionStorage.getItem('ledgerentrysAll') != null) {
      this.ledgerentrysAll = JSON.parse(window.sessionStorage.getItem('ledgerentrysAll'));
    }
    if (this.ledgerentryID != 0 && !this.ledgerentryID && Number(window.sessionStorage.getItem('ledgerentry')) > 0) {
      this.ledgerentryID = Number(window.sessionStorage.getItem('ledgerentry'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.ledgerentrys == null || this.ledgerentrys.length == 0 || reload == true)) {
      this.ledgerentrys == null;
      this.ledgerentryGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.ledgerentrysAll == null || this.ledgerentrysAll.length == 0 || reload == true)) {
      this.ledgerentrysAll == null;
      this.ledgerentryGetAll();
    }

    var search = {
      ledgeraccount_ID: this.ledgeraccountID,
      transaction_ID: this.transactionID,
    }

    if (this.view >= 5 && this.view <= 6 && this.ledgerentryID) {
      window.sessionStorage.setItem("ledgerentry", this.ledgerentryID);
      this.ledgerentryGetOne(this.ledgerentryID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.ledgerentrys == null || this.ledgerentrys.length == 0 || reload == true)) {
      this.ledgerentrys == null;
      this.ledgerentryAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.ledgerentrysAll == null || this.ledgerentrysAll.length == 0 || reload == true)) {
      this.ledgerentrysAll == null;
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
      ledgeraccount_ID: null,
      transaction_ID: null,

      ledgerentry_CODE: null,
      ledgerentry_NAME: null,
      ledgerentry_DESC: null,

      credit_AMOUNT: null,
      debit_AMOUNT: null,

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
    this.ledgerentry.ledgerentry_NAME = ledgeraccount.ledgeraccount_NAME;
    this.ledgerentry.ledgerentry_DESC = ledgeraccount.ledgeraccount_DESC;
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
      this.router.navigate(["/home/ledgerentrys "], {});
    }
  }

  onChange(ledgerentryID) {
    for (var i = 0; i < this.ledgerentrysAll.length; i++) {
      if (this.ledgerentrysAll[i].ledgerentry_ID == ledgerentryID) {
        this.onLedgerEntryChange.next(this.ledgerentrysAll[i]);
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

  setLedgerentrys(response) {
    this.cancel.next();
    return response;
  }

  ledgerentryGet() {
    this.ledgerentryservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.ledgerentrys = this.setLedgerentrys(this.ledgerentryservice.getAllDetail(response));
          window.sessionStorage.setItem("ledgerentrys", JSON.stringify(this.ledgerentrys));
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
          this.ledgerentrysAll = this.setLedgerentrys(this.ledgerentryservice.getAllDetail(response));
          window.sessionStorage.setItem("ledgerentrysAll", JSON.stringify(this.ledgerentrysAll));
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

    ledgerentry.ledgeraccount_ID = this.ledgeraccount.ledgeraccountID;
    ledgerentry.transaction_ID = this.transaction.transactionID;

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

    ledgerentry.ledgeraccount_ID = this.ledgeraccount.ledgeraccountID;
    ledgerentry.transaction_ID = this.transaction.transactionID;

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

  ledgerentryUpdateAll(ledgerentrys) {
    this.ledgerentryservice.updateAll(ledgerentrys).subscribe(response => {
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
          this.ledgerentrys = this.setLedgerentrys(this.ledgerentryservice.getAllDetail(response));
          window.sessionStorage.setItem("ledgerentrys", JSON.stringify(this.ledgerentrys));
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
          this.ledgerentrysAll = this.setLedgerentrys(this.ledgerentryservice.getAllDetail(response));
          window.sessionStorage.setItem("ledgerentrysAll", JSON.stringify(this.ledgerentrysAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgerentryAdvancedSearch(search) {
    this.ledgeraccountID = search.ledgeraccount_ID;
    this.transactionID = search.transaction_ID;

    this.ledgerentryservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.ledgerentrys = this.setLedgerentrys(this.ledgerentryservice.getAllDetail(response));
          window.sessionStorage.setItem("ledgerentrys", JSON.stringify(this.ledgerentrys));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgerentryAdvancedSearchAll(search) {
    this.ledgeraccountID = search.ledgeraccount_ID;
    this.transactionID = search.transaction_ID;

    this.ledgerentryservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.ledgerentrysAll = this.setLedgerentrys(this.ledgerentryservice.getAllDetail(response));
          window.sessionStorage.setItem("ledgerentrysAll", JSON.stringify(this.ledgerentrysAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
