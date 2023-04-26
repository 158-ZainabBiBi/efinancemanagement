import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { BankreconciliationService } from './bankreconciliation.service';
import { BankaccountComponent } from '../bankaccount/bankaccount.component';

@Component({
  selector: 'app-bankreconciliation',
  templateUrl: './bankreconciliation.component.html',
  styleUrls: ['./bankreconciliation.component.css']
})
export class BankreconciliationComponent implements OnInit {
  @ViewChild("bankaccount") bankaccount: BankaccountComponent;

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
  bankreconciliationID = null;
  @Input()
  bankaccountID = null;
  @Input()
  statusID = null;


  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onBankreconciliationChange = new EventEmitter();

  bankreconciliations = [];
  bankreconciliationsAll = [];
  bankreconciliation = {
    bankreconciliation_ID: 0,
    bankaccount_ID: null,
    bankreconciliation_CODE: null,
    statement_DATE: null,
    statementend_BALANCE: null,
    total_RECEIVED: null,
    total_PAID: null,
    starting_BALANCE: null,
    closing_BALANCE: null,
    reconciled_BALANCE: null,
    balance_DIFFERENCE: null,
    isactive: true,
  }

  constructor(
    private bankreconciliationservice: BankreconciliationService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload): void {
    if (window.sessionStorage.getItem('bankreconciliations') != null) {
      this.bankreconciliations = JSON.parse(window.sessionStorage.getItem('bankreconciliations'));
    }
    if (window.sessionStorage.getItem('bankreconciliationsAll') != null) {
      this.bankreconciliationsAll = JSON.parse(window.sessionStorage.getItem('bankreconciliationsAll'));
    }
    if (this.bankreconciliationID != 0 && !this.bankreconciliationID && Number(window.sessionStorage.getItem('bankreconciliation')) > 0) {
      this.bankreconciliationID = Number(window.sessionStorage.getItem('bankreconciliation'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.bankreconciliations == null || this.bankreconciliations.length == 0 || reload == true)) {
      this.bankreconciliations == null;
      this.bankreconciliationGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.bankreconciliationsAll == null || this.bankreconciliationsAll.length == 0 || reload == true)) {
      this.bankreconciliationsAll == null;
      this.bankreconciliationGetAll();
    }

    var search = {

    }

    if (this.view >= 5 && this.view <= 6 && this.bankreconciliationID) {
      window.sessionStorage.setItem("bankreconciliation", this.bankreconciliationID);
      this.bankreconciliationGetOne(this.bankreconciliationID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.bankreconciliations == null || this.bankreconciliations.length == 0 || reload == true)) {
      this.bankreconciliations == null;
      this.bankreconciliationAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.bankreconciliationsAll == null || this.bankreconciliationsAll.length == 0 || reload == true)) {
      this.bankreconciliationsAll == null;
      this.bankreconciliationAdvancedSearchAll(search);
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
    this.bankreconciliation = {
      bankreconciliation_ID: 0,
      bankaccount_ID: null,
      bankreconciliation_CODE: null,
      statement_DATE: null,
      statementend_BALANCE: null,
      total_RECEIVED: null,
      total_PAID: null,
      starting_BALANCE: null,
      closing_BALANCE: null,
      reconciled_BALANCE: null,
      balance_DIFFERENCE: null,
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

  bankreconciliationEdit() {
    this.disabled = false;
  }

  bankreconciliationCancel() {
    this.disabled = true;
    if (this.bankreconciliation.bankreconciliation_ID == 0) {
      this.router.navigate(["/home/bankreconciliation "], {});
    }
  }

  onChange(bankreconciliationID) {
    for (var i = 0; i < this.bankreconciliations.length; i++) {
      if (this.bankreconciliations[i].bankreconciliation_ID == bankreconciliationID) {
        this.onBankreconciliationChange.next(this.bankreconciliations[i]);
        break;
      }
    }
  }

  setBankreconciliation(response) {
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.bankreconciliation = response;
  }

  setFeecategories(response) {
    this.cancel.next();
    return response;
  }

  bankreconciliationGet() {
    this.bankreconciliationservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.bankreconciliations = this.setFeecategories(this.bankreconciliationservice.getAllDetail(response));
          window.sessionStorage.setItem("bankreconciliations", JSON.stringify(this.bankreconciliations));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  bankreconciliationGetAll() {
    this.bankreconciliationservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.bankreconciliationsAll = this.setFeecategories(this.bankreconciliationservice.getAllDetail(response));
          window.sessionStorage.setItem("bankreconciliationsAll", JSON.stringify(this.bankreconciliationsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  bankreconciliationGetOne(id) {
    this.disabled = true;
    this.bankreconciliationservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setBankreconciliation(this.bankreconciliationservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  bankreconciliationAdd(bankreconciliation) {

    bankreconciliation.isactive = "Y";
    bankreconciliation.bankaccount_ID = this.bankaccount.bankaccountID;
    this.bankreconciliationservice.add(bankreconciliation).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.bankreconciliation_ID) {
          this.toastrservice.success("Success", "New Bank Reconciliation Added");
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

  bankreconciliationUpdate(bankreconciliation) {
    bankreconciliation.bankaccount_ID = this.bankaccount.bankaccountID;
    if (bankreconciliation.isactive == true) {
      bankreconciliation.isactive = "Y";
    } else {
      bankreconciliation.isactive = "N";
    }
    this.bankreconciliationservice.update(bankreconciliation, bankreconciliation.bankreconciliation_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.bankreconciliation_ID) {
          this.toastrservice.success("Success", "Bank Reconciliation Updated");
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

  bankreconciliationUpdateAll(bankreconciliations) {
    this.bankreconciliationservice.updateAll(bankreconciliations).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Bank Reconciliation Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  bankreconciliationSearch(str) {
    var search = {
      search: str
    }
    this.bankreconciliationservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.bankreconciliations = this.setFeecategories(this.bankreconciliationservice.getAllDetail(response));
          window.sessionStorage.setItem("bankreconciliations", JSON.stringify(this.bankreconciliations));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  bankreconciliationSearchAll(str) {
    var search = {
      search: str
    }
    this.bankreconciliationservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.bankreconciliationsAll = this.setFeecategories(this.bankreconciliationservice.getAllDetail(response));
          window.sessionStorage.setItem("bankreconciliationsAll", JSON.stringify(this.bankreconciliationsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  bankreconciliationAdvancedSearch(search) {
    this.statusID = search.status_ID;
    this.bankaccountID = search.bankaccount;
    this.bankreconciliationservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.bankreconciliations = this.setFeecategories(this.bankreconciliationservice.getAllDetail(response));
          window.sessionStorage.setItem("bankreconciliations", JSON.stringify(this.bankreconciliations));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  bankreconciliationAdvancedSearchAll(search) {
    this.statusID = search.status_ID;
    this.bankaccountID = search.bankaccount;
    this.bankreconciliationservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.bankreconciliationsAll = this.setFeecategories(this.bankreconciliationservice.getAllDetail(response));
          window.sessionStorage.setItem("bankreconciliationsAll", JSON.stringify(this.bankreconciliationsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
