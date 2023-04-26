import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { LedgeraccountopeningbalanceService } from './ledgeraccountopeningbalance.service';
import { LedgeraccountComponent } from '../ledgeraccount/ledgeraccount.component';

@Component({
  selector: 'app-ledgeraccountopeningbalance',
  templateUrl: './ledgeraccountopeningbalance.component.html',
  styleUrls: ['./ledgeraccountopeningbalance.component.css']
})
export class LedgeraccountopeningbalanceComponent implements OnInit {
  @ViewChild("ledgeraccount") ledgeraccount: LedgeraccountComponent;

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
  ledgeraccountopeningbalanceID = null;
  @Input()
  ledgeraccountID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onLedgeraccountopeningbalanceChange = new EventEmitter();

  ledgeraccountopeningbalances = [];
  ledgeraccountopeningbalancesAll = [];
  ledgeraccountopeningbalance = {
    ledgeraccountopeningbalance_ID: 0,
    ledgeraccount_ID: null,
    ledgeraccountopeningbalance_DESC: null,
    ledgeraccountopeningbalance_DEBIT: null,
    ledgeraccountopeningbalance_CREDIT: null,
    isactive: true
  }

  constructor(
    private ledgeraccountopeningbalanceservice: LedgeraccountopeningbalanceService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload): void {
    if (window.sessionStorage.getItem('ledgeraccountopeningbalances') != null) {
      this.ledgeraccountopeningbalances = JSON.parse(window.sessionStorage.getItem('ledgeraccountopeningbalances'));
    }
    if (window.sessionStorage.getItem('ledgeraccountopeningbalancesAll') != null) {
      this.ledgeraccountopeningbalancesAll = JSON.parse(window.sessionStorage.getItem('ledgeraccountopeningbalancesAll'));
    }
    if (this.ledgeraccountopeningbalanceID != 0 && !this.ledgeraccountopeningbalanceID && Number(window.sessionStorage.getItem('ledgeraccountopeningbalance')) > 0) {
      this.ledgeraccountopeningbalanceID = Number(window.sessionStorage.getItem('ledgeraccountopeningbalance'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.ledgeraccountopeningbalances == null || this.ledgeraccountopeningbalances.length == 0 || reload == true)) {
      this.ledgeraccountopeningbalances == null;
      this.ledgeraccountopeningbalanceGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.ledgeraccountopeningbalancesAll == null || this.ledgeraccountopeningbalancesAll.length == 0 || reload == true)) {
      this.ledgeraccountopeningbalancesAll == null;
      this.ledgeraccountopeningbalanceGetAll();
    }

    var search = {

    }

    if (this.view >= 5 && this.view <= 6 && this.ledgeraccountopeningbalanceID) {
      window.sessionStorage.setItem("ledgeraccountopeningbalance", this.ledgeraccountopeningbalanceID);
      this.ledgeraccountopeningbalanceGetOne(this.ledgeraccountopeningbalanceID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.ledgeraccountopeningbalances == null || this.ledgeraccountopeningbalances.length == 0 || reload == true)) {
      this.ledgeraccountopeningbalances == null;
      this.ledgeraccountopeningbalanceAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.ledgeraccountopeningbalancesAll == null || this.ledgeraccountopeningbalancesAll.length == 0 || reload == true)) {
      this.ledgeraccountopeningbalancesAll == null;
      this.ledgeraccountopeningbalanceAdvancedSearchAll(search);
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
    this.ledgeraccountopeningbalance = {
      ledgeraccountopeningbalance_ID: 0,
      ledgeraccount_ID: null,
      ledgeraccountopeningbalance_DESC: null,
      ledgeraccountopeningbalance_DEBIT: null,
      ledgeraccountopeningbalance_CREDIT: null,
      isactive: true
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

  ledgeraccountopeningbalanceEdit() {
    this.disabled = false;
  }

  ledgeraccountopeningbalanceCancel() {
    this.disabled = true;
    if (this.ledgeraccountopeningbalance.ledgeraccountopeningbalance_ID == 0) {
      this.router.navigate(["/home/ledgeraccountopeningbalance "], {});
    }
  }

  onChange(ledgeraccountopeningbalanceID) {
    for (var i = 0; i < this.ledgeraccountopeningbalances.length; i++) {
      if (this.ledgeraccountopeningbalances[i].ledgeraccountopeningbalance_ID == ledgeraccountopeningbalanceID) {
        this.onLedgeraccountopeningbalanceChange.next(this.ledgeraccountopeningbalances[i]);
        break;
      }
    }
  }

  setLedgeraccountopeningbalance(response) {
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.ledgeraccountopeningbalance = response;
  }

  setFeecategories(response) {
    this.cancel.next();
    return response;
  }

  ledgeraccountopeningbalanceGet() {
    this.ledgeraccountopeningbalanceservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.ledgeraccountopeningbalances = this.setFeecategories(this.ledgeraccountopeningbalanceservice.getAllDetail(response));
          window.sessionStorage.setItem("ledgeraccountopeningbalances", JSON.stringify(this.ledgeraccountopeningbalances));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgeraccountopeningbalanceGetAll() {
    this.ledgeraccountopeningbalanceservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.ledgeraccountopeningbalancesAll = this.setFeecategories(this.ledgeraccountopeningbalanceservice.getAllDetail(response));
          window.sessionStorage.setItem("ledgeraccountopeningbalancesAll", JSON.stringify(this.ledgeraccountopeningbalancesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgeraccountopeningbalanceGetOne(id) {
    this.disabled = true;
    this.ledgeraccountopeningbalanceservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setLedgeraccountopeningbalance(this.ledgeraccountopeningbalanceservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgeraccountopeningbalanceAdd(ledgeraccountopeningbalance) {

    ledgeraccountopeningbalance.isactive = "Y";
    // journalopeningbalance.fromledgeraccount_ID = this.ledgeraccount.ledgeraccountID;

    this.ledgeraccountopeningbalanceservice.add(ledgeraccountopeningbalance).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.ledgeraccountopeningbalance_ID) {
          this.toastrservice.success("Success", "New Fee Category Added");
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

  ledgeraccountopeningbalanceUpdate(ledgeraccountopeningbalance) {
    // journalopeningbalance.fromledgeraccount_ID = this.ledgeraccount.ledgeraccountID;

    if (ledgeraccountopeningbalance.isactive == true) {
      ledgeraccountopeningbalance.isactive = "Y";
    } else {
      ledgeraccountopeningbalance.isactive = "N";
    }
    this.ledgeraccountopeningbalanceservice.update(ledgeraccountopeningbalance, ledgeraccountopeningbalance.ledgeraccountopeningbalance_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.ledgeraccountopeningbalance_ID) {
          this.toastrservice.success("Success", "Fee Category Updated");
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

  ledgeraccountopeningbalanceUpdateAll(ledgeraccountopeningbalances) {
    this.ledgeraccountopeningbalanceservice.updateAll(ledgeraccountopeningbalances).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Fee Category Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgeraccountopeningbalanceSearch(str) {
    var search = {
      search: str
    }
    this.ledgeraccountopeningbalanceservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.ledgeraccountopeningbalances = this.setFeecategories(this.ledgeraccountopeningbalanceservice.getAllDetail(response));
          window.sessionStorage.setItem("ledgeraccountopeningbalances", JSON.stringify(this.ledgeraccountopeningbalances));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgeraccountopeningbalanceSearchAll(str) {
    var search = {
      search: str
    }
    this.ledgeraccountopeningbalanceservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.ledgeraccountopeningbalancesAll = this.setFeecategories(this.ledgeraccountopeningbalanceservice.getAllDetail(response));
          window.sessionStorage.setItem("ledgeraccountopeningbalancesAll", JSON.stringify(this.ledgeraccountopeningbalancesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgeraccountopeningbalanceAdvancedSearch(search) {
    this.ledgeraccountID = search.ledgeraccount_ID;

    this.ledgeraccountopeningbalanceservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.ledgeraccountopeningbalances = this.setFeecategories(this.ledgeraccountopeningbalanceservice.getAllDetail(response));
          window.sessionStorage.setItem("ledgeraccountopeningbalances", JSON.stringify(this.ledgeraccountopeningbalances));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgeraccountopeningbalanceAdvancedSearchAll(search) {
    this.ledgeraccountID = search.ledgeraccount_ID;

    this.ledgeraccountopeningbalanceservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.ledgeraccountopeningbalancesAll = this.setFeecategories(this.ledgeraccountopeningbalanceservice.getAllDetail(response));
          window.sessionStorage.setItem("ledgeraccountopeningbalancesAll", JSON.stringify(this.ledgeraccountopeningbalancesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}