import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { JournalopeningbalanceService } from './journalopeningbalance.service';
import { JournallineComponent } from '../journalline/journalline.component';

@Component({
  selector: 'app-journalopeningbalance',
  templateUrl: './journalopeningbalance.component.html',
  styleUrls: ['./journalopeningbalance.component.css']
})
export class JournalopeningbalanceComponent implements OnInit {
  @ViewChild("journalline") journalline: JournallineComponent;

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
  journalopeningbalanceID = null;
  @Input()
  journallineID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onJournalOpeningBalanceChange = new EventEmitter();

  journalopeningbalances = [];
  journalopeningbalancesAll = [];
  journalopeningbalance = {
    journalopeningbalance_ID: 0,
    journalline_ID: null,

    balance_CODE: null,
    balance_DATE: null,

    isactive: true,
  }

  constructor(
    private journalopeningbalanceservice: JournalopeningbalanceService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload): void {
    if (window.sessionStorage.getItem('journalopeningbalances') != null) {
      this.journalopeningbalances = JSON.parse(window.sessionStorage.getItem('journalopeningbalances'));
    }
    if (window.sessionStorage.getItem('journalopeningbalancesAll') != null) {
      this.journalopeningbalancesAll = JSON.parse(window.sessionStorage.getItem('journalopeningbalancesAll'));
    }
    if (this.journalopeningbalanceID != 0 && !this.journalopeningbalanceID && Number(window.sessionStorage.getItem('journalopeningbalance')) > 0) {
      this.journalopeningbalanceID = Number(window.sessionStorage.getItem('journalopeningbalance'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.journalopeningbalances == null || this.journalopeningbalances.length == 0 || reload == true)) {
      this.journalopeningbalances == null;
      this.journalopeningbalanceGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.journalopeningbalancesAll == null || this.journalopeningbalancesAll.length == 0 || reload == true)) {
      this.journalopeningbalancesAll == null;
      this.journalopeningbalanceGetAll();
    }

    var search = {
      journalline_ID: this.journallineID,
    }

    if (this.view >= 5 && this.view <= 6 && this.journalopeningbalanceID) {
      window.sessionStorage.setItem("journalopeningbalance", this.journalopeningbalanceID);
      this.journalopeningbalanceGetOne(this.journalopeningbalanceID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.journalopeningbalances == null || this.journalopeningbalances.length == 0 || reload == true)) {
      this.journalopeningbalances == null;
      this.journalopeningbalanceAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.journalopeningbalancesAll == null || this.journalopeningbalancesAll.length == 0 || reload == true)) {
      this.journalopeningbalancesAll == null;
      this.journalopeningbalanceAdvancedSearchAll(search);
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
    this.journalopeningbalance = {
      journalopeningbalance_ID: 0,
      journalline_ID: null,

      balance_CODE: null,
      balance_DATE: null,

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

  journalopeningbalanceEdit() {
    this.disabled = false;
  }

  journalopeningbalanceCancel() {
    this.disabled = true;
    if (this.journalopeningbalance.journalopeningbalance_ID == 0) {
      this.router.navigate(["/home/journalopeningbalance "], {});
    }
  }

  onChange(journalopeningbalanceID) {
    for (var i = 0; i < this.journalopeningbalances.length; i++) {
      if (this.journalopeningbalances[i].journalopeningbalance_ID == journalopeningbalanceID) {
        this.onJournalOpeningBalanceChange.next(this.journalopeningbalances[i]);
        break;
      }
    }
  }

  setJournalopeningbalance(response) {
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.journalopeningbalance = response;
  }

  setFeecategories(response) {
    this.cancel.next();
    return response;
  }

  journalopeningbalanceGet() {
    this.journalopeningbalanceservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.journalopeningbalances = this.setFeecategories(this.journalopeningbalanceservice.getAllDetail(response));
          window.sessionStorage.setItem("journalopeningbalances", JSON.stringify(this.journalopeningbalances));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  journalopeningbalanceGetAll() {
    this.journalopeningbalanceservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.journalopeningbalancesAll = this.setFeecategories(this.journalopeningbalanceservice.getAllDetail(response));
          window.sessionStorage.setItem("journalopeningbalancesAll", JSON.stringify(this.journalopeningbalancesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  journalopeningbalanceGetOne(id) {
    this.disabled = true;
    this.journalopeningbalanceservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setJournalopeningbalance(this.journalopeningbalanceservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  journalopeningbalanceAdd(journalopeningbalance) {

    journalopeningbalance.isactive = "Y";
    journalopeningbalance.journalline_ID = this.journalline.journallineID;

    this.journalopeningbalanceservice.add(journalopeningbalance).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.journalopeningbalance_ID) {
          this.toastrservice.success("Success", "New Journal Opening Balance Added");
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

  journalopeningbalanceUpdate(journalopeningbalance) {
    journalopeningbalance.fromjournalline_ID = this.journalline.journallineID;

    if (journalopeningbalance.isactive == true) {
      journalopeningbalance.isactive = "Y";
    } else {
      journalopeningbalance.isactive = "N";
    }
    this.journalopeningbalanceservice.update(journalopeningbalance, journalopeningbalance.journalopeningbalance_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.journalopeningbalance_ID) {
          this.toastrservice.success("Success", "Journal Opening Balance Updated");
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

  journalopeningbalanceUpdateAll(journalopeningbalances) {
    this.journalopeningbalanceservice.updateAll(journalopeningbalances).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Journal Opening Balance Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  journalopeningbalanceSearch(str) {
    var search = {
      search: str
    }
    this.journalopeningbalanceservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.journalopeningbalances = this.setFeecategories(this.journalopeningbalanceservice.getAllDetail(response));
          window.sessionStorage.setItem("journalopeningbalances", JSON.stringify(this.journalopeningbalances));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  journalopeningbalanceSearchAll(str) {
    var search = {
      search: str
    }
    this.journalopeningbalanceservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.journalopeningbalancesAll = this.setFeecategories(this.journalopeningbalanceservice.getAllDetail(response));
          window.sessionStorage.setItem("journalopeningbalancesAll", JSON.stringify(this.journalopeningbalancesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  journalopeningbalanceAdvancedSearch(search) {
    this.journallineID = search.journalline_ID;

    this.journalopeningbalanceservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.journalopeningbalances = this.setFeecategories(this.journalopeningbalanceservice.getAllDetail(response));
          window.sessionStorage.setItem("journalopeningbalances", JSON.stringify(this.journalopeningbalances));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  journalopeningbalanceAdvancedSearchAll(search) {
    this.journallineID = search.journalline_ID;

    this.journalopeningbalanceservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.journalopeningbalancesAll = this.setFeecategories(this.journalopeningbalanceservice.getAllDetail(response));
          window.sessionStorage.setItem("journalopeningbalancesAll", JSON.stringify(this.journalopeningbalancesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
