import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { ValidatorFn, AbstractControl } from '@angular/forms';

import { TrialbalanceService } from './trialbalance.service';
import { LedgerentryComponent } from '../ledgerentry/ledgerentry.component';

declare var $: any;

@Component({
  selector: 'app-trialbalance',
  templateUrl: './trialbalance.component.html',
  styleUrls: ['./trialbalance.component.css']
})
export class TrialbalanceComponent implements OnInit {
  @ViewChild("ledgerentry") ledgerentry: LedgerentryComponent;
  @ViewChild("addledgerentry") addledgerentry: LedgerentryComponent;
  @ViewChild("editledgerentry") editledgerentry: LedgerentryComponent;

  @Input()
  view: number = 1;
  @Input()
  iscompulsory: boolean = false;
  @Input()
  isreload: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  balancetypedisabled: boolean = false;
  @Input()
  debitdisabled: boolean = false;
  @Input()
  creditdisabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  trialbalanceID = null;
  @Input()
  ledgerentryID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onTrialBalanceChange = new EventEmitter();

  trialbalances = [];
  trialbalancesAll = [];
  trialbalance = {
    trialbalance_ID: 0,
    ledgerentry_ID: {
      credit_AMOUNT: null,
      debit_AMOUNT: null,
    },

    trialbalance_CODE: null,
    trialbalance_NAME: null,

    balance_FROMDATE: null,
    balance_TODATE: null,
    balance_CREDIT: null,
    balance_DEBIT: null,

    isactive: true,
  }

  constructor(
    private trialbalanceservice: TrialbalanceService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload) {
    if (window.sessionStorage.getItem('trialbalances') != null) {
      this.trialbalances = JSON.parse(window.sessionStorage.getItem('trialbalances'));
    }
    if (window.sessionStorage.getItem('trialbalancesAll') != null) {
      this.trialbalancesAll = JSON.parse(window.sessionStorage.getItem('trialbalancesAll'));
    }
    if (this.trialbalanceID != 0 && !this.trialbalanceID && Number(window.sessionStorage.getItem('trialbalance')) > 0) {
      this.trialbalanceID = Number(window.sessionStorage.getItem('trialbalance'));
    }

    this.getTotalDebit();
    this.getTotalCredit();

    if (this.view >= 1 && this.view <= 2 && (this.trialbalances == null || this.trialbalances.length == 0 || reload == true)) {
      this.trialbalances == null;
      this.trialbalanceGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.trialbalancesAll == null || this.trialbalancesAll.length == 0 || reload == true)) {
      this.trialbalancesAll == null;
      this.trialbalanceGetAll();
    }

    var search = {
      ledgerentry_ID: this.ledgerentryID
    }

    if (this.view >= 5 && this.view <= 6 && this.trialbalanceID) {
      window.sessionStorage.setItem("trialbalance", this.trialbalanceID);
      this.trialbalanceGetOne(this.trialbalanceID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.trialbalances == null || this.trialbalances.length == 0 || reload == true)) {
      this.trialbalances == null;
      this.trialbalanceAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.trialbalancesAll == null || this.trialbalancesAll.length == 0 || reload == true)) {
      this.trialbalancesAll == null;
      this.trialbalanceAdvancedSearchAll(search);
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
      {
        location: 'after',
        text: `Total Credit: ${this.getTotalCredit()}`,
      },
      {
        location: 'after',
        text: `Total Debit: ${this.getTotalDebit()}`,
      }
    );
  }

  getTotalCredit() {
    let total = 0;
    this.trialbalancesAll.forEach(account => {
      const credit = Number(account.balance_CREDIT);
      if (!isNaN(credit)) {
        total += credit;
      }
    });
    return total;
  }

  getTotalDebit() {
    let total = 0;
    this.trialbalancesAll.forEach(account => {
      const debit = Number(account.balance_DEBIT);
      if (!isNaN(debit)) {
        total += debit;
      }
    });
    return total;
  }

  onCreditChange() {
    this.trialbalance.balance_DEBIT = 0;
    this.creditdisabled = true;
  }

  onDebitChange() {
    this.trialbalance.balance_CREDIT = 0;
    this.debitdisabled = true;
  }

  add() {
    this.trialbalance = {
      trialbalance_ID: 0,
      ledgerentry_ID: {
        credit_AMOUNT: null,
        debit_AMOUNT: null,
      },

      trialbalance_CODE: null,
      trialbalance_NAME: null,

      balance_FROMDATE: null,
      balance_TODATE: null,
      balance_CREDIT: null,
      balance_DEBIT: null,

      isactive: true,
    };
  }

  ledgerentryAddNew() {
    this.addledgerentry.add();
    $("#addledgerentry").modal("show");
  }

  ledgerentryCancel() {
    $("#addledgerentry").modal("hide");
    $("#editledgerentry").modal("hide");
    this.ledgerentry.ledgerentries = this.addledgerentry.ledgerentries;
  }

  onLedgerentryChange(ledgerentry) {
    this.trialbalance.trialbalance_NAME = ledgerentry.ledgerentry_NAME;
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

  trialbalanceEdit() {
    this.disabled = false;
  }

  trialbalanceCancel() {
    this.disabled = true;
    if (this.trialbalance.trialbalance_ID == 0) {
      this.router.navigate(["/home/trialbalances"], {});
    }
  }

  onChange(trialbalanceID) {
    for (var i = 0; i < this.trialbalancesAll.length; i++) {
      if (this.trialbalancesAll[i].trialbalance_ID == trialbalanceID) {
        this.onTrialBalanceChange.next(this.trialbalancesAll[i]);
        break;
      }
    }
  }

  setTrialbalance(response) {
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.trialbalance = response;
  }

  setTrialbalances(response) {
    this.cancel.next();
    return response;
  }

  trialbalanceGet() {
    this.trialbalanceservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.trialbalances = this.setTrialbalances(this.trialbalanceservice.getAllDetail(response));
          window.sessionStorage.setItem("trialbalances", JSON.stringify(this.trialbalances));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  trialbalanceGetAll() {
    this.trialbalanceservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.trialbalancesAll = this.setTrialbalances(this.trialbalanceservice.getAllDetail(response));
          window.sessionStorage.setItem("trialbalancesAll", JSON.stringify(this.trialbalancesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  trialbalanceGetOne(id) {
    this.disabled = true;
    this.trialbalanceservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setTrialbalance(this.trialbalanceservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  trialbalanceAdd(trialbalance) {
    trialbalance.isactive = "Y";

    trialbalance.ledgerentry_ID = this.ledgerentry.ledgerentryID;

    this.trialbalanceservice.add(trialbalance).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.trialbalance_ID) {
          this.toastrservice.success("Success", "New Trial Balance Added");
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

  trialbalanceUpdate(trialbalance) {

    trialbalance.ledgerentry_ID = this.ledgerentry.ledgerentryID;

    if (trialbalance.isactive == true) {
      trialbalance.isactive = "Y";
    } else {
      trialbalance.isactive = "N";
    }
    this.trialbalanceservice.update(trialbalance, trialbalance.trialbalance_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.trialbalance_ID) {
          this.toastrservice.success("Success", "Trial Balance Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  trialbalanceUpdateAll(trialbalances) {
    this.trialbalanceservice.updateAll(trialbalances).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Trial Balances Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  trialbalanceSearch(str) {
    var search = {
      search: str
    }
    this.trialbalanceservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.trialbalances = this.setTrialbalances(this.trialbalanceservice.getAllDetail(response));
          window.sessionStorage.setItem("trialbalances", JSON.stringify(this.trialbalances));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  trialbalanceSearchAll(str) {
    var search = {
      search: str
    }
    this.trialbalanceservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.trialbalancesAll = this.setTrialbalances(this.trialbalanceservice.getAllDetail(response));
          window.sessionStorage.setItem("trialbalancesAll", JSON.stringify(this.trialbalancesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  trialbalanceAdvancedSearch(search) {
    this.ledgerentryID = search.ledgerentry_ID;

    this.trialbalanceservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.trialbalances = this.setTrialbalances(this.trialbalanceservice.getAllDetail(response));
          window.sessionStorage.setItem("trialbalances", JSON.stringify(this.trialbalances));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  trialbalanceAdvancedSearchAll(search) {
    this.ledgerentryID = search.ledgerentry_ID;

    this.trialbalanceservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.trialbalancesAll = this.setTrialbalances(this.trialbalanceservice.getAllDetail(response));
          window.sessionStorage.setItem("trialbalancesAll", JSON.stringify(this.trialbalancesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
