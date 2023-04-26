import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { BankopeningbalanceService } from './bankopeningbalance.service';
import { BankaccountComponent } from '../bankaccount/bankaccount.component';
import { TransactiontypeComponent } from '../../lookup/transactiontype/transactiontype.component';

@Component({
  selector: 'app-bankopeningbalance',
  templateUrl: './bankopeningbalance.component.html',
  styleUrls: ['./bankopeningbalance.component.css']
})
export class BankopeningbalanceComponent implements OnInit {
  @ViewChild("transactiontype") transactiontype: TransactiontypeComponent;
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
  bankopeningbalanceID = null;
  @Input()
  bankaccountID = null;
  @Input()
  transactiontypeID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onBankopeningbalanceChange = new EventEmitter();

  bankopeningbalances = [];
  bankopeningbalancesAll = [];
  bankopeningbalance = {
    bankopeningbalance_ID: 0,
    bankaccount_ID: null,
    transactiontype_ID: null,
    bankopeningbalance_CREDIT: null,
    bankopeningbalance_DATE: null,
    bankopeningbalance_DESCRIPTION: null,
    isactive: true,
  }

  constructor(
    private bankopeningbalanceservice: BankopeningbalanceService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload): void {
    if (window.sessionStorage.getItem('bankopeningbalances') != null) {
      this.bankopeningbalances = JSON.parse(window.sessionStorage.getItem('bankopeningbalances'));
    }
    if (window.sessionStorage.getItem('bankopeningbalancesAll') != null) {
      this.bankopeningbalancesAll = JSON.parse(window.sessionStorage.getItem('bankopeningbalancesAll'));
    }
    if (this.bankopeningbalanceID != 0 && !this.bankopeningbalanceID && Number(window.sessionStorage.getItem('bankopeningbalance')) > 0) {
      this.bankopeningbalanceID = Number(window.sessionStorage.getItem('bankopeningbalance'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.bankopeningbalances == null || this.bankopeningbalances.length == 0 || reload == true)) {
      this.bankopeningbalances == null;
      this.bankopeningbalanceGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.bankopeningbalancesAll == null || this.bankopeningbalancesAll.length == 0 || reload == true)) {
      this.bankopeningbalancesAll == null;
      this.bankopeningbalanceGetAll();
    }

    var search = {

    }

    if (this.view >= 5 && this.view <= 6 && this.bankopeningbalanceID) {
      window.sessionStorage.setItem("bankopeningbalance", this.bankopeningbalanceID);
      this.bankopeningbalanceGetOne(this.bankopeningbalanceID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.bankopeningbalances == null || this.bankopeningbalances.length == 0 || reload == true)) {
      this.bankopeningbalances == null;
      this.bankopeningbalanceAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.bankopeningbalancesAll == null || this.bankopeningbalancesAll.length == 0 || reload == true)) {
      this.bankopeningbalancesAll == null;
      this.bankopeningbalanceAdvancedSearchAll(search);
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
    this.bankopeningbalance = {
      bankopeningbalance_ID: 0,
      bankaccount_ID: null,
      transactiontype_ID: null,
      bankopeningbalance_CREDIT: null,
      bankopeningbalance_DATE: null,
      bankopeningbalance_DESCRIPTION: null,
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

  bankopeningbalanceEdit() {
    this.disabled = false;
  }

  bankopeningbalanceCancel() {
    this.disabled = true;
    if (this.bankopeningbalance.bankopeningbalance_ID == 0) {
      this.router.navigate(["/home/bankopeningbalance "], {});
    }
  }

  onChange(bankopeningbalanceID) {
    for (var i = 0; i < this.bankopeningbalances.length; i++) {
      if (this.bankopeningbalances[i].bankopeningbalance_ID == bankopeningbalanceID) {
        this.onBankopeningbalanceChange.next(this.bankopeningbalances[i]);
        break;
      }
    }
  }

  setBankopeningbalance(response) {
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.bankopeningbalance = response;
  }

  setFeecategories(response) {
    this.cancel.next();
    return response;
  }

  bankopeningbalanceGet() {
    this.bankopeningbalanceservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.bankopeningbalances = this.setFeecategories(this.bankopeningbalanceservice.getAllDetail(response));
          window.sessionStorage.setItem("bankopeningbalances", JSON.stringify(this.bankopeningbalances));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  bankopeningbalanceGetAll() {
    this.bankopeningbalanceservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.bankopeningbalancesAll = this.setFeecategories(this.bankopeningbalanceservice.getAllDetail(response));
          window.sessionStorage.setItem("bankopeningbalancesAll", JSON.stringify(this.bankopeningbalancesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  bankopeningbalanceGetOne(id) {
    this.disabled = true;
    this.bankopeningbalanceservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setBankopeningbalance(this.bankopeningbalanceservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  bankopeningbalanceAdd(bankopeningbalance) {
    bankopeningbalance.isactive = "Y";
    bankopeningbalance.bankaccount_ID = this.bankaccount.bankaccountID;
    bankopeningbalance.transactiontype_ID = this.transactiontype.transactiontypeID;
    this.bankopeningbalanceservice.add(bankopeningbalance).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.bankopeningbalance_ID) {
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

  bankopeningbalanceUpdate(bankopeningbalance) {
    bankopeningbalance.bankaccount = this.bankaccount.bankaccountID;
    bankopeningbalance.transactiontype_ID = this.transactiontype.transactiontypeID;
    if (bankopeningbalance.isactive == true) {
      bankopeningbalance.isactive = "Y";
    } else {
      bankopeningbalance.isactive = "N";
    }
    this.bankopeningbalanceservice.update(bankopeningbalance, bankopeningbalance.bankopeningbalance_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.bankopeningbalance_ID) {
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

  bankopeningbalanceUpdateAll(bankopeningbalances) {
    this.bankopeningbalanceservice.updateAll(bankopeningbalances).subscribe(response => {
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

  bankopeningbalanceSearch(str) {
    var search = {
      search: str
    }
    this.bankopeningbalanceservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.bankopeningbalances = this.setFeecategories(this.bankopeningbalanceservice.getAllDetail(response));
          window.sessionStorage.setItem("bankopeningbalances", JSON.stringify(this.bankopeningbalances));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  bankopeningbalanceSearchAll(str) {
    var search = {
      search: str
    }
    this.bankopeningbalanceservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.bankopeningbalancesAll = this.setFeecategories(this.bankopeningbalanceservice.getAllDetail(response));
          window.sessionStorage.setItem("bankopeningbalancesAll", JSON.stringify(this.bankopeningbalancesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  bankopeningbalanceAdvancedSearch(search) {
    this.transactiontypeID = search.transactiontype_ID;
    this.bankaccountID = search.bankaccount;

    this.bankopeningbalanceservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.bankopeningbalances = this.setFeecategories(this.bankopeningbalanceservice.getAllDetail(response));
          window.sessionStorage.setItem("bankopeningbalances", JSON.stringify(this.bankopeningbalances));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  bankopeningbalanceAdvancedSearchAll(search) {
    this.transactiontypeID = search.transactiontype_ID;
    this.bankaccountID = search.bankaccount;

    this.bankopeningbalanceservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.bankopeningbalancesAll = this.setFeecategories(this.bankopeningbalanceservice.getAllDetail(response));
          window.sessionStorage.setItem("bankopeningbalancesAll", JSON.stringify(this.bankopeningbalancesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
