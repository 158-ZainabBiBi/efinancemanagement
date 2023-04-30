import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { BankaccountService } from './bankaccount.service';
import { AccountComponent } from '../../finance/account/account.component';
import { PaymentmethodComponent } from '../../lookup/paymentmethod/paymentmethod.component';
import { BankaccounttypeComponent } from '../../lookup/bankaccounttype/bankaccounttype.component';
import { LedgeraccountComponent } from '../ledgeraccount/ledgeraccount.component';
import { PersonComponent } from '../../person/person/person.component';
import { LocationsearchfilterComponent } from '../../location/locationsearchfilter/locationsearchfilter.component';

declare var $: any;

@Component({
  selector: 'app-bankaccount',
  templateUrl: './bankaccount.component.html',
  styleUrls: ['./bankaccount.component.css']
})
export class BankaccountComponent implements OnInit {
  @ViewChild("bankaccounttype") bankaccounttype: BankaccounttypeComponent;
  @ViewChild("paymentmethod") paymentmethod: PaymentmethodComponent;
  @ViewChild("locationsearchfilter") locationsearchfilter: LocationsearchfilterComponent;
  @ViewChild("person") person: PersonComponent;
  @ViewChild("account") account: AccountComponent;

  @ViewChild("ledgeraccount") ledgeraccount: LedgeraccountComponent;
  @ViewChild("addledgeraccount") addledgeraccount: LedgeraccountComponent;
  @ViewChild("editledgeraccount") editledgeraccount: LedgeraccountComponent;

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
  bankaccountID = null;
  @Input()
  accountID = null;
  @Input()
  ledgeraccountID = null;
  @Input()
  personID = null;
  @Input()
  paymentmethodID = null;
  @Input()
  paymentmethodCode = null;
  @Input()
  bankaccounttypeID = null;
  @Input()
  bankaccounttypeCode = null;
  @Input()
  locationID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onBankAccountChange = new EventEmitter();

  bankaccounts = [];
  bankaccountsAll = [
    {
      bankaccount_ID: 1,
      bankaccount_CODE: '001',
      bankaccount_DATE: '2023-04-30',
      account: { account_NUMBER: '123456' },
      bankaccounttype: { description: 'Savings' },
      bankaccount_BALANCE: 1000,
      ledgeraccount: { ledgeraccount_NAME: 'Cash' },
      paymentmethod: { description: 'Credit Card' },
      person: { forenames: 'John', surname: 'Doe' },
      location: { location_NAME: 'USA' },
      isactive: true
    },
    {
      bankaccount_ID: 2,
      bankaccount_CODE: '002',
      bankaccount_DATE: '2023-05-01',
      account: { account_NUMBER: '654321' },
      bankaccounttype: { description: 'Checking' },
      bankaccount_BALANCE: 500,
      ledgeraccount: { ledgeraccount_NAME: 'Bank' },
      paymentmethod: { description: 'PayPal' },
      person: { forenames: 'Jane', surname: 'Doe' },
      location: { location_NAME: 'Canada' },
      isactive: false
    }
  ];
  // bankaccountsAll = [];
  bankaccount = {
    bankaccount_ID: 0,
    ledgeraccount_ID: null,
    account_ID: null,
    bankaccounttype_ID: null,
    paymentmethod_ID: null,
    person_ID: null,
    location_ID: null,
    locations: [],

    bankaccount_CODE: null,
    bankaccount_DATE: null,
    bankaccount_BALANCE: null,

    isactive: true,
  }

  constructor(
    private bankaccountservice: BankaccountService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload): void {
    if (window.sessionStorage.getItem('bankaccounts') != null) {
      this.bankaccounts = JSON.parse(window.sessionStorage.getItem('bankaccounts'));
    }
    if (window.sessionStorage.getItem('bankaccountsAll') != null) {
      this.bankaccountsAll = JSON.parse(window.sessionStorage.getItem('bankaccountsAll'));
    }
    if (this.bankaccountID != 0 && !this.bankaccountID && Number(window.sessionStorage.getItem('bankaccount')) > 0) {
      this.bankaccountID = Number(window.sessionStorage.getItem('bankaccount'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.bankaccounts == null || this.bankaccounts.length == 0 || reload == true)) {
      this.bankaccounts == null;
      this.bankaccountGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.bankaccountsAll == null || this.bankaccountsAll.length == 0 || reload == true)) {
      this.bankaccountsAll == null;
      this.bankaccountGetAll();
    }

    var search = {
      ledgeraccount_ID: this.ledgeraccountID,
      account_ID: this.accountID,
      person_ID: this.personID,
      paymentmethod_ID: this.paymentmethodID,
      paymentmethod_CODE: this.paymentmethodCode,
      bankaccounttype_ID: this.bankaccounttypeID,
      bankaccounttype_CODE: this.bankaccounttypeCode,
      location_ID: this.locationID,
    }

    if (this.view >= 5 && this.view <= 6 && this.bankaccountID) {
      window.sessionStorage.setItem("bankaccount", this.bankaccountID);
      this.bankaccountGetOne(this.bankaccountID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.bankaccounts == null || this.bankaccounts.length == 0 || reload == true)) {
      this.bankaccounts == null;
      this.bankaccountAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.bankaccountsAll == null || this.bankaccountsAll.length == 0 || reload == true)) {
      this.bankaccountsAll == null;
      this.bankaccountAdvancedSearchAll(search);
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
    this.bankaccount = {
      bankaccount_ID: 0,
      ledgeraccount_ID: null,
      account_ID: null,
      bankaccounttype_ID: null,
      paymentmethod_ID: null,
      person_ID: null,
      location_ID: null,
      locations: [],

      bankaccount_CODE: null,
      bankaccount_DATE: null,
      bankaccount_BALANCE: null,

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
    // this.bankaccount.bankaccount_NAME = ledgeraccount.ledgeraccount_NAME;
    // this.bankaccount.bankaccount_DESC = ledgeraccount.ledgeraccount_DESC;
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

  bankaccountEdit() {
    this.disabled = false;
  }

  bankaccountCancel() {
    this.disabled = true;
    if (this.bankaccount.bankaccount_ID == 0) {
      this.router.navigate(["/home/bankaccounts"], {});
    }
  }

  onChange(bankaccountID) {
    for (var i = 0; i < this.bankaccounts.length; i++) {
      if (this.bankaccounts[i].bankaccount_ID == bankaccountID) {
        this.onBankAccountChange.next(this.bankaccounts[i]);
        break;
      }
    }
  }

  setBankaccount(response) {
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.bankaccount = response;
  }

  setFeecategories(response) {
    this.cancel.next();
    return response;
  }

  bankaccountGet() {
    this.bankaccountservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.bankaccounts = this.setFeecategories(this.bankaccountservice.getAllDetail(response));
          window.sessionStorage.setItem("bankaccounts", JSON.stringify(this.bankaccounts));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  bankaccountGetAll() {
    this.bankaccountservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.bankaccountsAll = this.setFeecategories(this.bankaccountservice.getAllDetail(response));
          window.sessionStorage.setItem("bankaccountsAll", JSON.stringify(this.bankaccountsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  bankaccountGetOne(id) {
    this.disabled = true;
    this.bankaccountservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setBankaccount(this.bankaccountservice.getDetail(response));
          if (this.locationsearchfilter != null)
            this.locationsearchfilter.setLocation(this.bankaccount.locations);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  bankaccountAdd(bankaccount) {

    bankaccount.isactive = "Y";
    bankaccount.bankaccounttype_ID = this.bankaccounttype.bankaccounttypeID;
    bankaccount.account_ID = this.account.accountID;
    bankaccount.ledgeraccount_ID = this.ledgeraccount.ledgeraccountID;
    bankaccount.person_ID = this.person.personID;
    bankaccount.paymentmethod_ID = this.paymentmethod.paymentmethodID;
    bankaccount.location_ID = this.locationsearchfilter.locationID;

    this.bankaccountservice.add(bankaccount).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.bankaccount_ID) {
          this.toastrservice.success("Success", "New Bank Account Added");
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

  bankaccountUpdate(bankaccount) {
    bankaccount.bankaccounttype_ID = this.bankaccounttype.bankaccounttypeID;
    bankaccount.account_ID = this.account.accountID;
    bankaccount.ledgeraccount_ID = this.ledgeraccount.ledgeraccountID;
    bankaccount.person_ID = this.person.personID;
    bankaccount.paymentmethod_ID = this.paymentmethod.paymentmethodID;
    bankaccount.location_ID = this.locationsearchfilter.locationID;

    if (bankaccount.isactive == true) {
      bankaccount.isactive = "Y";
    } else {
      bankaccount.isactive = "N";
    }
    this.bankaccountservice.update(bankaccount, bankaccount.bankaccount_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.bankaccount_ID) {
          this.toastrservice.success("Success", "Bank Account Updated");
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

  bankaccountUpdateAll(bankaccounts) {
    this.bankaccountservice.updateAll(bankaccounts).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Bank Account Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  bankaccountSearch(str) {
    var search = {
      search: str
    }
    this.bankaccountservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.bankaccounts = this.setFeecategories(this.bankaccountservice.getAllDetail(response));
          window.sessionStorage.setItem("bankaccounts", JSON.stringify(this.bankaccounts));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  bankaccountSearchAll(str) {
    var search = {
      search: str
    }
    this.bankaccountservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.bankaccountsAll = this.setFeecategories(this.bankaccountservice.getAllDetail(response));
          window.sessionStorage.setItem("bankaccountsAll", JSON.stringify(this.bankaccountsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  bankaccountAdvancedSearch(search) {
    this.accountID = search.account_ID;
    this.bankaccounttypeID = search.bankaccounttype_ID;
    this.bankaccounttypeCode = search.bankaccounttype_CODE;
    this.ledgeraccountID = search.ledgeraccount_ID;
    this.personID = search.person_ID;
    this.paymentmethodID = search.paymentmethod_ID;
    this.paymentmethodCode = search.paymentmethod_CODE;
    this.locationID = search.location_ID;

    this.bankaccountservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.bankaccounts = this.setFeecategories(this.bankaccountservice.getAllDetail(response));
          window.sessionStorage.setItem("bankaccounts", JSON.stringify(this.bankaccounts));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  bankaccountAdvancedSearchAll(search) {
    this.accountID = search.account_ID;
    this.bankaccounttypeID = search.bankaccounttype_ID;
    this.bankaccounttypeCode = search.bankaccounttype_CODE;
    this.ledgeraccountID = search.ledgeraccount_ID;
    this.personID = search.person_ID;
    this.paymentmethodID = search.paymentmethod_ID;
    this.paymentmethodCode = search.paymentmethod_CODE;
    this.locationID = search.location_ID;

    this.bankaccountservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.bankaccountsAll = this.setFeecategories(this.bankaccountservice.getAllDetail(response));
          window.sessionStorage.setItem("bankaccountsAll", JSON.stringify(this.bankaccountsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
