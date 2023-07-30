import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { ProfitandlossService } from './profitandloss.service';
import { LedgerComponent } from '../ledger/ledger.component';

declare var $: any;

@Component({
  selector: 'app-profitandloss',
  templateUrl: './profitandloss.component.html',
  styleUrls: ['./profitandloss.component.css']
})
export class ProfitandlossComponent implements OnInit {
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
  profitandlossID = null;
  @Input()
  ledgerID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onProfitandlossChange = new EventEmitter();

  profitandlosss = [];
  profitandlosssAll = [];
  profitandloss = {
    profitandloss_ID: 0,
    profitandloss_CODE: null,
    profitandloss_NAME: null,
    ledger_ID: null,
    isactive: true
  }

  constructor(
    private profitandlossservice: ProfitandlossService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload) {
    if (window.sessionStorage.getItem('profitandlosss') != null) {
      this.profitandlosss = JSON.parse(window.sessionStorage.getItem('profitandlosss'));
    }
    if (window.sessionStorage.getItem('profitandlosssAll') != null) {
      this.profitandlosssAll = JSON.parse(window.sessionStorage.getItem('profitandlosssAll'));
    }
    if (this.profitandlossID != 0 && !this.profitandlossID && Number(window.sessionStorage.getItem('profitandloss')) > 0) {
      this.profitandlossID = Number(window.sessionStorage.getItem('profitandloss'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.profitandlosss == null || this.profitandlosss.length == 0 || reload == true)) {
      this.profitandlosss == null;
      this.profitandlossGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.profitandlosssAll == null || this.profitandlosssAll.length == 0 || reload == true)) {
      this.profitandlosssAll == null;
      this.profitandlossGetAll();
    }

    var search = {
      ledger_ID: this.ledgerID
    }

    if (this.view >= 5 && this.view <= 6 && this.profitandlossID) {
      window.sessionStorage.setItem("profitandloss", this.profitandlossID);
      this.profitandlossGetOne(this.profitandlossID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.profitandlosss == null || this.profitandlosss.length == 0 || reload == true)) {
      this.profitandlosss == null;
      this.profitandlossAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.profitandlosssAll == null || this.profitandlosssAll.length == 0 || reload == true)) {
      this.profitandlosssAll == null;
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
      }
    );
  }

  add() {
    this.profitandloss = {
      profitandloss_ID: 0,
      profitandloss_CODE: null,
      profitandloss_NAME: null,
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
    this.profitandloss.profitandloss_NAME = ledger.ledger_NAME;
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
      this.router.navigate(["/home/profitandlosss"], {});
    }
  }

  onChange(profitandlossID) {
    for (var i = 0; i < this.profitandlosssAll.length; i++) {
      if (this.profitandlosssAll[i].profitandloss_ID == profitandlossID) {
        this.onProfitandlossChange.next(this.profitandlosssAll[i]);
        break;
      }
    }
  }

  setProfitandloss(response) {
    this.profitandlossID = response.profitandloss_ID;
    this.ledgerID = response.ledger_ID;

    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.profitandloss = response;
  }

  setProfitandlosss(response) {
    this.cancel.next();
    return response;
  }

  profitandlossGet() {
    this.profitandlossservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.profitandlosss = this.setProfitandlosss(this.profitandlossservice.getAllDetail(response));
          window.sessionStorage.setItem("profitandlosss", JSON.stringify(this.profitandlosss));
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
          this.profitandlosssAll = this.setProfitandlosss(this.profitandlossservice.getAllDetail(response));
          window.sessionStorage.setItem("profitandlosssAll", JSON.stringify(this.profitandlosssAll));
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
    profitandloss.ledger_ID = this.ledger.ledgerID;

    profitandloss.isactive = "Y";
    this.profitandlossservice.add(profitandloss).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.profitandloss_ID) {
          this.toastrservice.success("Success", "New Profit and Loss Added");
          this.setProfitandloss(this.profitandlossservice.getDetail(response));
          this.refresh.next();
          this.profitandlossGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  profitandlossUpdate(profitandloss) {
    profitandloss.ledger_ID = this.ledger.ledgerID;

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
          this.profitandlossGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  profitandlossUpdateAll(profitandlosss) {
    this.profitandlossservice.updateAll(profitandlosss).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Profit and Losses Updated");
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
          this.profitandlosss = this.setProfitandlosss(this.profitandlossservice.getAllDetail(response));
          window.sessionStorage.setItem("profitandlosss", JSON.stringify(this.profitandlosss));
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
          this.profitandlosssAll = this.setProfitandlosss(this.profitandlossservice.getAllDetail(response));
          window.sessionStorage.setItem("profitandlosssAll", JSON.stringify(this.profitandlosssAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  profitandlossAdvancedSearch(search) {
    this.ledgerID = search.ledger_ID;

    this.profitandlossservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.profitandlosss = this.setProfitandlosss(this.profitandlossservice.getAllDetail(response));
          window.sessionStorage.setItem("profitandlosss", JSON.stringify(this.profitandlosss));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  profitandlossAdvancedSearchAll(search) {
    this.ledgerID = search.ledger_ID;

    this.profitandlossservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.profitandlosssAll = this.setProfitandlosss(this.profitandlossservice.getAllDetail(response));
          window.sessionStorage.setItem("profitandlosssAll", JSON.stringify(this.profitandlosssAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
