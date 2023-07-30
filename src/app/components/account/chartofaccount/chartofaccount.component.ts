import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { ChartofaccountService } from './chartofaccount.service';
import { LedgerComponent } from '../ledger/ledger.component';

declare var $: any;

@Component({
  selector: 'app-chartofaccount',
  templateUrl: './chartofaccount.component.html',
  styleUrls: ['./chartofaccount.component.css']
})
export class ChartofaccountComponent implements OnInit {
  @ViewChild("ledger") ledger: LedgerComponent;
  @ViewChild("addledger") addledger: LedgerComponent;
  @ViewChild("editledger") editledger: LedgerComponent;

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
  chartofaccountID = null;
  @Input()
  ledgerID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onChartofaccountChange = new EventEmitter();

  chartofaccounts = [];
  chartofaccountsAll = [];
  chartofaccount = {
    chartofaccount_ID: 0,
    chartofaccount_CODE: null,
    chartofaccount_NAME: null,
    ledger_ID: null,
    isactive: true
  }

  constructor(
    private chartofaccountservice: ChartofaccountService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload) {
    if (window.sessionStorage.getItem('chartofaccounts') != null) {
      this.chartofaccounts = JSON.parse(window.sessionStorage.getItem('chartofaccounts'));
    }
    if (window.sessionStorage.getItem('chartofaccountsAll') != null) {
      this.chartofaccountsAll = JSON.parse(window.sessionStorage.getItem('chartofaccountsAll'));
    }
    if (this.chartofaccountID != 0 && !this.chartofaccountID && Number(window.sessionStorage.getItem('chartofaccount')) > 0) {
      this.chartofaccountID = Number(window.sessionStorage.getItem('chartofaccount'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.chartofaccounts == null || this.chartofaccounts.length == 0 || reload == true)) {
      this.chartofaccounts == null;
      this.chartofaccountGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.chartofaccountsAll == null || this.chartofaccountsAll.length == 0 || reload == true)) {
      this.chartofaccountsAll == null;
      this.chartofaccountGetAll();
    }

    var search = {
      ledger_ID: this.ledgerID
    }

    if (this.view >= 5 && this.view <= 6 && this.chartofaccountID) {
      window.sessionStorage.setItem("chartofaccount", this.chartofaccountID);
      this.chartofaccountGetOne(this.chartofaccountID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.chartofaccounts == null || this.chartofaccounts.length == 0 || reload == true)) {
      this.chartofaccounts == null;
      this.chartofaccountAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.chartofaccountsAll == null || this.chartofaccountsAll.length == 0 || reload == true)) {
      this.chartofaccountsAll == null;
      this.chartofaccountAdvancedSearchAll(search);
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
    this.chartofaccount = {
      chartofaccount_ID: 0,
      chartofaccount_CODE: null,
      chartofaccount_NAME: null,
      ledger_ID: null,
      isactive: true
    };
  }

  ledgerAddNew() {
    this.addledger.add();
    $("#addledger").modal("show");
  }

  ledgerrefresh() {
    this.ledger.load(true);
    this.ledgerCancel();
  }

  ledgerCancel() {
    $("#addledger").modal("hide");
    $("#editledger").modal("hide");
    this.ledger.ledgers = this.addledger.ledgers;
  }

  onLedgerChange(ledger) {
    this.chartofaccount.chartofaccount_NAME = ledger.ledger_NAME;
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

  chartofaccountEdit() {
    this.disabled = false;
  }

  chartofaccountCancel() {
    this.disabled = true;
    if (this.chartofaccount.chartofaccount_ID == 0) {
      this.router.navigate(["/home/chartofaccounts"], {});
    }
  }

  onChange(chartofaccountID) {
    for (var i = 0; i < this.chartofaccountsAll.length; i++) {
      if (this.chartofaccountsAll[i].chartofaccount_ID == chartofaccountID) {
        this.onChartofaccountChange.next(this.chartofaccountsAll[i]);
        break;
      }
    }
  }

  setChartofaccount(response) {
    this.chartofaccountID = response.chartofaccount_ID;
    this.ledgerID = response.ledger_ID;

    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.chartofaccount = response;
  }

  setChartofaccounts(response) {
    this.cancel.next();
    return response;
  }

  chartofaccountGet() {
    this.chartofaccountservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.chartofaccounts = this.setChartofaccounts(this.chartofaccountservice.getAllDetail(response));
          window.sessionStorage.setItem("chartofaccounts", JSON.stringify(this.chartofaccounts));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  chartofaccountGetAll() {
    this.chartofaccountservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.chartofaccountsAll = this.setChartofaccounts(this.chartofaccountservice.getAllDetail(response));
          window.sessionStorage.setItem("chartofaccountsAll", JSON.stringify(this.chartofaccountsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  chartofaccountGetOne(id) {
    this.disabled = true;
    this.chartofaccountservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setChartofaccount(this.chartofaccountservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  chartofaccountAdd(chartofaccount) {
    chartofaccount.ledger_ID = this.ledger.ledgerID;

    chartofaccount.isactive = "Y";
    this.chartofaccountservice.add(chartofaccount).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.chartofaccount_ID) {
          this.toastrservice.success("Success", "New Chart of Account Added");
          this.setChartofaccount(this.chartofaccountservice.getDetail(response));
          this.refresh.next();
          this.chartofaccountGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  chartofaccountUpdate(chartofaccount) {
    chartofaccount.ledger_ID = this.ledger.ledgerID;

    if (chartofaccount.isactive == true) {
      chartofaccount.isactive = "Y";
    } else {
      chartofaccount.isactive = "N";
    }
    this.chartofaccountservice.update(chartofaccount, chartofaccount.chartofaccount_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.chartofaccount_ID) {
          this.toastrservice.success("Success", "Chart of Account Updated");
          this.setChartofaccount(this.chartofaccountservice.getDetail(response));
          this.refresh.next();
          this.chartofaccountGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  chartofaccountUpdateAll(chartofaccounts) {
    this.chartofaccountservice.updateAll(chartofaccounts).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Chart of Accounts Updated");
          this.setChartofaccount(this.chartofaccountservice.getDetail(response));
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  chartofaccountSearch(str) {
    var search = {
      search: str
    }
    this.chartofaccountservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.chartofaccounts = this.setChartofaccounts(this.chartofaccountservice.getAllDetail(response));
          window.sessionStorage.setItem("chartofaccounts", JSON.stringify(this.chartofaccounts));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  chartofaccountSearchAll(str) {
    var search = {
      search: str
    }
    this.chartofaccountservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.chartofaccountsAll = this.setChartofaccounts(this.chartofaccountservice.getAllDetail(response));
          window.sessionStorage.setItem("chartofaccountsAll", JSON.stringify(this.chartofaccountsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  chartofaccountAdvancedSearch(search) {
    this.ledgerID = search.ledger_ID;

    this.chartofaccountservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.chartofaccounts = this.setChartofaccounts(this.chartofaccountservice.getAllDetail(response));
          window.sessionStorage.setItem("chartofaccounts", JSON.stringify(this.chartofaccounts));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  chartofaccountAdvancedSearchAll(search) {
    this.ledgerID = search.ledger_ID;

    this.chartofaccountservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.chartofaccountsAll = this.setChartofaccounts(this.chartofaccountservice.getAllDetail(response));
          window.sessionStorage.setItem("chartofaccountsAll", JSON.stringify(this.chartofaccountsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
