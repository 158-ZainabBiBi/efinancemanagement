import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { TrialbalanceComponent } from '../trialbalance/trialbalance.component';
import { IncomestatementService } from './incomestatement.service';

declare var $: any;

@Component({
  selector: 'app-incomestatement',
  templateUrl: './incomestatement.component.html',
  styleUrls: ['./incomestatement.component.css']
})
export class IncomestatementComponent implements OnInit, AfterViewInit {
  @ViewChild("trialbalance") trialbalance: TrialbalanceComponent;
  @ViewChild("addtrialbalance") addtrialbalance: TrialbalanceComponent;
  @ViewChild("edittrialbalance") edittrialbalance: TrialbalanceComponent;

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
  incomestatementID = null;
  @Input()
  trialbalanceID = null;
  @Input()
  totalcredit: number = 0;
  @Input()
  totaldebit: number = 0;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onIncomeStatementChange = new EventEmitter();

  incomestatements = [];
  incomestatementsAll = [];
  incomestatement = {
    incomestatement_ID: 0,
    incomestatement_CODE: null,
    incomestatement_NAME: null,
    trialbalance_ID: null,
    isactive: true
  }

  constructor(
    private incomestatementservice: IncomestatementService,
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
    if (window.sessionStorage.getItem('incomestatements') != null) {
      this.incomestatements = JSON.parse(window.sessionStorage.getItem('incomestatements'));
    }
    if (window.sessionStorage.getItem('incomestatementsAll') != null) {
      this.incomestatementsAll = JSON.parse(window.sessionStorage.getItem('incomestatementsAll'));
    }
    if (this.incomestatementID != 0 && !this.incomestatementID && Number(window.sessionStorage.getItem('incomestatement')) > 0) {
      this.incomestatementID = Number(window.sessionStorage.getItem('incomestatement'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.incomestatements == null || this.incomestatements.length == 0 || reload == true)) {
      this.incomestatements == null;
      this.incomestatementGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.incomestatementsAll == null || this.incomestatementsAll.length == 0 || reload == true)) {
      this.incomestatementsAll == null;
      this.incomestatementGetAll();
    }

    var search = {
      trialbalance_ID: this.trialbalanceID
    }

    if (this.view >= 5 && this.view <= 6 && this.incomestatementID) {
      window.sessionStorage.setItem("incomestatement", this.incomestatementID);
      this.incomestatementGetOne(this.incomestatementID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.incomestatements == null || this.incomestatements.length == 0 || reload == true)) {
      this.incomestatements == null;
      this.incomestatementAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.incomestatementsAll == null || this.incomestatementsAll.length == 0 || reload == true)) {
      this.incomestatementsAll == null;
      this.incomestatementAdvancedSearchAll(search);
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
    if (this.incomestatementsAll) {
      this.incomestatementsAll.forEach(totals => {
        const credit = Number(totals.trialbalance.ledger.ledger_CREDIT);
        if (!isNaN(credit)) {
          total += credit;
        }
      });
    }
    return total;
  }

  getTotalDebit() {
    let total = 0;
    if (this.incomestatementsAll) {
      this.incomestatementsAll.forEach(totals => {
        const debit = Number(totals.trialbalance.ledger.ledger_DEBIT);
        if (!isNaN(debit)) {
          total += debit;
        }
      });
    }
    return total;
  }

  add() {
    this.incomestatement = {
      incomestatement_ID: 0,
      incomestatement_CODE: null,
      incomestatement_NAME: null,
      trialbalance_ID: null,
      isactive: true
    };
  }

  trialbalanceAddNew() {
    this.addtrialbalance.add();
    $("#addtrialbalance").modal("show");
  }

  trialbalancerefresh() {
    this.trialbalance.load(true);
    this.trialbalanceCancel();
  }

  trialbalanceCancel() {
    $("#addtrialbalance").modal("hide");
    $("#edittrialbalance").modal("hide");
    this.trialbalance.trialbalances = this.addtrialbalance.trialbalances;
  }

  onTrialbalanceChange(trialbalance) {
    this.incomestatement.incomestatement_NAME = trialbalance.trialbalance_NAME;
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

  incomestatementEdit() {
    this.disabled = false;
  }

  incomestatementCancel() {
    this.disabled = true;
    if (this.incomestatement.incomestatement_ID == 0) {
      this.router.navigate(["/home/incomestatements"], {});
    }
  }

  onChange(incomestatementID) {
    for (var i = 0; i < this.incomestatementsAll.length; i++) {
      if (this.incomestatementsAll[i].incomestatement_ID == incomestatementID) {
        this.onIncomeStatementChange.next(this.incomestatementsAll[i]);
        break;
      }
    }
  }

  setIncomestatement(response) {
    this.trialbalanceID = response.trialbalance_ID;
    this.incomestatementID = response.incomestatement_ID;

    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.incomestatement = response;
  }

  setIncomestatements(response) {
    this.cancel.next();
    return response;
  }

  incomestatementGet() {
    this.incomestatementservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.incomestatements = this.setIncomestatements(this.incomestatementservice.getAllDetail(response));
          window.sessionStorage.setItem("incomestatements", JSON.stringify(this.incomestatements));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  incomestatementGetAll() {
    this.incomestatementservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.incomestatementsAll = this.setIncomestatements(this.incomestatementservice.getAllDetail(response));
          window.sessionStorage.setItem("incomestatementsAll", JSON.stringify(this.incomestatementsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  incomestatementGetOne(id) {
    this.disabled = true;
    this.incomestatementservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setIncomestatement(this.incomestatementservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  incomestatementAdd(incomestatement) {
    incomestatement.trialbalance_ID = this.trialbalance.trialbalanceID;

    incomestatement.isactive = "Y";
    this.incomestatementservice.add(incomestatement).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.incomestatement_ID) {
          this.toastrservice.success("Success", "New Income Statement Added");
          this.setIncomestatement(this.incomestatementservice.getDetail(response));
          this.refresh.next();
          this.disabled = true;
          this.incomestatementGetAll();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  incomestatementUpdate(incomestatement) {

    incomestatement.trialbalance_ID = this.trialbalance.trialbalanceID;

    if (incomestatement.isactive == true) {
      incomestatement.isactive = "Y";
    } else {
      incomestatement.isactive = "N";
    }
    this.incomestatementservice.update(incomestatement, incomestatement.incomestatement_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.incomestatement_ID) {
          this.toastrservice.success("Success", "Income Statement Updated");
          this.setIncomestatement(this.incomestatementservice.getDetail(response));
          this.refresh.next();
          this.disabled = true;
          this.incomestatementGetAll();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  incomestatementUpdateAll(incomestatements) {
    this.incomestatementservice.updateAll(incomestatements).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Income Statements Updated");
          this.setIncomestatement(this.incomestatementservice.getDetail(response));
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  incomestatementSearch(str) {
    var search = {
      search: str
    }
    this.incomestatementservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.incomestatements = this.setIncomestatements(this.incomestatementservice.getAllDetail(response));
          window.sessionStorage.setItem("incomestatements", JSON.stringify(this.incomestatements));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  incomestatementSearchAll(str) {
    var search = {
      search: str
    }
    this.incomestatementservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.incomestatementsAll = this.setIncomestatements(this.incomestatementservice.getAllDetail(response));
          window.sessionStorage.setItem("incomestatementsAll", JSON.stringify(this.incomestatementsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  incomestatementAdvancedSearch(search) {
    this.trialbalanceID = search.trialbalance_ID;

    this.incomestatementservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.incomestatements = this.setIncomestatements(this.incomestatementservice.getAllDetail(response));
          window.sessionStorage.setItem("incomestatements", JSON.stringify(this.incomestatements));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  incomestatementAdvancedSearchAll(search) {
    this.trialbalanceID = search.trialbalance_ID;

    this.incomestatementservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.incomestatementsAll = this.setIncomestatements(this.incomestatementservice.getAllDetail(response));
          window.sessionStorage.setItem("incomestatementsAll", JSON.stringify(this.incomestatementsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
