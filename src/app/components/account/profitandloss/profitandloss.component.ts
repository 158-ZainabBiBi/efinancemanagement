import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { TrialbalanceComponent } from '../trialbalance/trialbalance.component';
import { ProfitandlossService } from './profitandloss.service';

declare var $: any;

@Component({
  selector: 'app-profitandloss',
  templateUrl: './profitandloss.component.html',
  styleUrls: ['./profitandloss.component.css']
})
export class ProfitandlossComponent implements OnInit, AfterViewInit {
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
  profitandlossID = null;
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
  @Output() onProfitandLossChange = new EventEmitter();

  profitandlosses = [];
  profitandlossesAll = [];
  profitandloss = {
    profitandloss_ID: 0,
    profitandloss_CODE: null,
    profitandloss_NAME: null,
    trialbalance_ID: null,
    isactive: true
  }

  constructor(
    private profitandlossservice: ProfitandlossService,
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
    if (window.sessionStorage.getItem('profitandlosses') != null) {
      this.profitandlosses = JSON.parse(window.sessionStorage.getItem('profitandlosses'));
    }
    if (window.sessionStorage.getItem('profitandlossesAll') != null) {
      this.profitandlossesAll = JSON.parse(window.sessionStorage.getItem('profitandlossesAll'));
    }
    if (this.profitandlossID != 0 && !this.profitandlossID && Number(window.sessionStorage.getItem('profitandloss')) > 0) {
      this.profitandlossID = Number(window.sessionStorage.getItem('profitandloss'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.profitandlosses == null || this.profitandlosses.length == 0 || reload == true)) {
      this.profitandlosses == null;
      this.profitandlossGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.profitandlossesAll == null || this.profitandlossesAll.length == 0 || reload == true)) {
      this.profitandlossesAll == null;
      this.profitandlossGetAll();
    }

    var search = {
      trialbalance_ID: this.trialbalanceID
    }

    if (this.view >= 5 && this.view <= 6 && this.profitandlossID) {
      window.sessionStorage.setItem("profitandloss", this.profitandlossID);
      this.profitandlossGetOne(this.profitandlossID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.profitandlosses == null || this.profitandlosses.length == 0 || reload == true)) {
      this.profitandlosses == null;
      this.profitandlossAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.profitandlossesAll == null || this.profitandlossesAll.length == 0 || reload == true)) {
      this.profitandlossesAll == null;
      this.profitandlossAdvancedSearchAll(search);
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
    if (this.profitandlossesAll) {
      this.profitandlossesAll.forEach(totals => {
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
    if (this.profitandlossesAll) {
      this.profitandlossesAll.forEach(totals => {
        const debit = Number(totals.trialbalance.ledger.ledger_DEBIT);
        if (!isNaN(debit)) {
          total += debit;
        }
      });
    }
    return total;
  }

  add() {
    this.profitandloss = {
      profitandloss_ID: 0,
      profitandloss_CODE: null,
      profitandloss_NAME: null,
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
    this.profitandloss.profitandloss_NAME = trialbalance.trialbalance_NAME;
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

  profitandlossEdit() {
    this.disabled = false;
  }

  profitandlossCancel() {
    this.disabled = true;
    if (this.profitandloss.profitandloss_ID == 0) {
      this.router.navigate(["/home/profitandlosses"], {});
    }
  }

  onChange(profitandlossID) {
    for (var i = 0; i < this.profitandlossesAll.length; i++) {
      if (this.profitandlossesAll[i].profitandloss_ID == profitandlossID) {
        this.onProfitandLossChange.next(this.profitandlossesAll[i]);
        break;
      }
    }
  }

  setProfitandloss(response) {
    this.trialbalanceID = response.trialbalance_ID;
    this.profitandlossID = response.profitandloss_ID;

    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.profitandloss = response;
  }

  setProfitandlosses(response) {
    this.cancel.next();
    return response;
  }

  profitandlossGet() {
    this.profitandlossservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.profitandlosses = this.setProfitandlosses(this.profitandlossservice.getAllDetail(response));
          window.sessionStorage.setItem("profitandlosses", JSON.stringify(this.profitandlosses));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  profitandlossGetAll() {
    this.profitandlossservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.profitandlossesAll = this.setProfitandlosses(this.profitandlossservice.getAllDetail(response));
          window.sessionStorage.setItem("profitandlossesAll", JSON.stringify(this.profitandlossesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  profitandlossGetOne(id) {
    this.disabled = true;
    this.profitandlossservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setProfitandloss(this.profitandlossservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  profitandlossAdd(profitandloss) {
    profitandloss.trialbalance_ID = this.trialbalance.trialbalanceID;

    profitandloss.isactive = "Y";
    this.profitandlossservice.add(profitandloss).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.profitandloss_ID) {
          this.toastrservice.success("Success", "New Profit and Loss Added");
          this.setProfitandloss(this.profitandlossservice.getDetail(response));
          this.refresh.next();
          this.disabled = true;
          this.profitandlossGetAll();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  profitandlossUpdate(profitandloss) {

    profitandloss.trialbalance_ID = this.trialbalance.trialbalanceID;

    if (profitandloss.isactive == true) {
      profitandloss.isactive = "Y";
    } else {
      profitandloss.isactive = "N";
    }
    this.profitandlossservice.update(profitandloss, profitandloss.profitandloss_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.profitandloss_ID) {
          this.toastrservice.success("Success", "Profit and Loss Updated");
          this.setProfitandloss(this.profitandlossservice.getDetail(response));
          this.refresh.next();
          this.disabled = true;
          this.profitandlossGetAll();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  profitandlossUpdateAll(profitandlosses) {
    this.profitandlossservice.updateAll(profitandlosses).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Profit and Losss Updated");
          this.setProfitandloss(this.profitandlossservice.getDetail(response));
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  profitandlossSearch(str) {
    var search = {
      search: str
    }
    this.profitandlossservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.profitandlosses = this.setProfitandlosses(this.profitandlossservice.getAllDetail(response));
          window.sessionStorage.setItem("profitandlosses", JSON.stringify(this.profitandlosses));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  profitandlossSearchAll(str) {
    var search = {
      search: str
    }
    this.profitandlossservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.profitandlossesAll = this.setProfitandlosses(this.profitandlossservice.getAllDetail(response));
          window.sessionStorage.setItem("profitandlossesAll", JSON.stringify(this.profitandlossesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  profitandlossAdvancedSearch(search) {
    this.trialbalanceID = search.trialbalance_ID;

    this.profitandlossservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.profitandlosses = this.setProfitandlosses(this.profitandlossservice.getAllDetail(response));
          window.sessionStorage.setItem("profitandlosses", JSON.stringify(this.profitandlosses));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  profitandlossAdvancedSearchAll(search) {
    this.trialbalanceID = search.trialbalance_ID;

    this.profitandlossservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.profitandlossesAll = this.setProfitandlosses(this.profitandlossservice.getAllDetail(response));
          window.sessionStorage.setItem("profitandlossesAll", JSON.stringify(this.profitandlossesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
