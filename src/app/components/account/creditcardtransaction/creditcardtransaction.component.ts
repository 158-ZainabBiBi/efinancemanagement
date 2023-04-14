import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { CreditcardtransactionService } from './creditcardtransaction.service';
import { CardtypeComponent } from '../../lookup/cardtype/cardtype.component';
import { CustomerComponent } from '../../customer/customer/customer.component';

@Component({
  selector: 'app-creditcardtransaction',
  templateUrl: './creditcardtransaction.component.html',
  styleUrls: ['./creditcardtransaction.component.css']
})
export class CreditcardtransactionComponent implements OnInit {
  @ViewChild("customer") customer: CustomerComponent;
  @ViewChild("cardtype") cardtype: CardtypeComponent;

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
  creditcardtransactionID = null;
  @Input()
  customerID = null;
  @Input()
  cardtypeID = null;
  @Input()
  cardtypeCode = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onCreditCardTransactionChange = new EventEmitter();

  creditcardtransactions = [];
  creditcardtransactionsAll = [];
  creditcardtransaction = {
    creditcardtransaction_ID: 0,
    cardtype_ID: null,
    customer_ID: null,
    transaction_DATE: null,
    transaction_AMOUNT: null,
    transaction_STATUS: null,
    name_ONCARD: null,
    card_NUMBER: null,
    authcode: null,
    isactive: true,
  }

  constructor(
    private creditcardtransactionservice: CreditcardtransactionService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload) {
    if (window.sessionStorage.getItem('creditcardtransactions') != null) {
      this.creditcardtransactions = JSON.parse(window.sessionStorage.getItem('creditcardtransactions'));
    }
    if (window.sessionStorage.getItem('creditcardtransactionsAll') != null) {
      this.creditcardtransactionsAll = JSON.parse(window.sessionStorage.getItem('creditcardtransactionsAll'));
    }
    if (this.creditcardtransactionID != 0 && !this.creditcardtransactionID && Number(window.sessionStorage.getItem('creditcardtransaction')) > 0) {
      this.creditcardtransactionID = Number(window.sessionStorage.getItem('creditcardtransaction'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.creditcardtransactions == null || this.creditcardtransactions.length == 0 || reload == true)) {
      this.creditcardtransactions == null;
      this.creditcardtransactionGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.creditcardtransactionsAll == null || this.creditcardtransactionsAll.length == 0 || reload == true)) {
      this.creditcardtransactionsAll == null;
      this.creditcardtransactionGetAll();
    }

    var search = {
      customer_ID: this.customerID,
      cardtype_ID: this.cardtypeID,
      cardtype_CODE: this.cardtypeCode,
    }

    if (this.view >= 5 && this.view <= 6 && this.creditcardtransactionID) {
      window.sessionStorage.setItem("creditcardtransaction", this.creditcardtransactionID);
      this.creditcardtransactionGetOne(this.creditcardtransactionID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.creditcardtransactions == null || this.creditcardtransactions.length == 0 || reload == true)) {
      this.creditcardtransactions == null;
      this.creditcardtransactionAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.creditcardtransactionsAll == null || this.creditcardtransactionsAll.length == 0 || reload == true)) {
      this.creditcardtransactionsAll == null;
      this.creditcardtransactionAdvancedSearchAll(search);
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
    this.creditcardtransaction = {
      creditcardtransaction_ID: 0,
      cardtype_ID: null,
      customer_ID: null,
      transaction_DATE: null,
      transaction_AMOUNT: null,
      transaction_STATUS: null,
      name_ONCARD: null,
      card_NUMBER: null,
      authcode: null,
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

  creditcardtransactionEdit() {
    this.disabled = false;
  }

  creditcardtransactionCancel() {
    this.disabled = true;
    if (this.creditcardtransaction.creditcardtransaction_ID == 0) {
      this.router.navigate(["/home/creditcardtransactions "], {});
    }
  }

  onChange(creditcardtransactionID) {
    for (var i = 0; i < this.creditcardtransactionsAll.length; i++) {
      if (this.creditcardtransactionsAll[i].creditcardtransaction_ID == creditcardtransactionID) {
        this.onCreditCardTransactionChange.next(this.creditcardtransactionsAll[i]);
        break;
      }
    }
  }

  setCreditcardtransaction(response) {
    if (response.isapproved == "Y") {
      response.isapproved = true;
    } else {
      response.isapproved = false;
    }
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.creditcardtransaction = response;
  }

  setCreditcardtransactions(response) {
    this.cancel.next();
    return response;
  }

  creditcardtransactionGet() {
    this.creditcardtransactionservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.creditcardtransactions = this.setCreditcardtransactions(this.creditcardtransactionservice.getAllDetail(response));
          window.sessionStorage.setItem("creditcardtransactions", JSON.stringify(this.creditcardtransactions));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  creditcardtransactionGetAll() {
    this.creditcardtransactionservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.creditcardtransactionsAll = this.setCreditcardtransactions(this.creditcardtransactionservice.getAllDetail(response));
          window.sessionStorage.setItem("creditcardtransactionsAll", JSON.stringify(this.creditcardtransactionsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  creditcardtransactionGetOne(id) {
    this.disabled = true;
    this.creditcardtransactionservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setCreditcardtransaction(this.creditcardtransactionservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  creditcardtransactionAdd(creditcardtransaction) {
    creditcardtransaction.isactive = "Y";
    creditcardtransaction.isapproved = "N";
    creditcardtransaction.customer_ID = this.customer.customerID;
    creditcardtransaction.cardtype_ID = this.cardtype.cardtypeID;

    this.creditcardtransactionservice.add(creditcardtransaction).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.creditcardtransaction_ID) {
          this.toastrservice.success("Success", "New Credit Card Transaction Added");
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

  creditcardtransactionUpdate(creditcardtransaction) {

    creditcardtransaction.customer_ID = this.customer.customerID;
    creditcardtransaction.cardtype_ID = this.cardtype.cardtypeID;

    if (creditcardtransaction.isapproved == true) {
      creditcardtransaction.isapproved = "Y";
    } else {
      creditcardtransaction.isapproved = "N";
    }
    if (creditcardtransaction.isactive == true) {
      creditcardtransaction.isactive = "Y";
    } else {
      creditcardtransaction.isactive = "N";
    }
    this.creditcardtransactionservice.update(creditcardtransaction, creditcardtransaction.creditcardtransaction_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.creditcardtransaction_ID) {
          this.toastrservice.success("Success", "Credit Card Transaction Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  creditcardtransactionUpdateAll(creditcardtransactions) {
    this.creditcardtransactionservice.updateAll(creditcardtransactions).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Credit Card Transactions Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  creditcardtransactionSearch(str) {
    var search = {
      search: str
    }
    this.creditcardtransactionservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.creditcardtransactions = this.setCreditcardtransactions(this.creditcardtransactionservice.getAllDetail(response));
          window.sessionStorage.setItem("creditcardtransactions", JSON.stringify(this.creditcardtransactions));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  creditcardtransactionSearchAll(str) {
    var search = {
      search: str
    }
    this.creditcardtransactionservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.creditcardtransactionsAll = this.setCreditcardtransactions(this.creditcardtransactionservice.getAllDetail(response));
          window.sessionStorage.setItem("creditcardtransactionsAll", JSON.stringify(this.creditcardtransactionsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  creditcardtransactionAdvancedSearch(search) {
    this.customerID = search.customer_ID;
    this.cardtypeID = search.cardtype_ID;
    this.cardtypeCode = search.cardtype_CODE;

    this.creditcardtransactionservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.creditcardtransactions = this.setCreditcardtransactions(this.creditcardtransactionservice.getAllDetail(response));
          window.sessionStorage.setItem("creditcardtransactions", JSON.stringify(this.creditcardtransactions));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  creditcardtransactionAdvancedSearchAll(search) {
    this.customerID = search.customer_ID;
    this.cardtypeID = search.cardtype_ID;
    this.cardtypeCode = search.cardtype_CODE;

    this.creditcardtransactionservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.creditcardtransactionsAll = this.setCreditcardtransactions(this.creditcardtransactionservice.getAllDetail(response));
          window.sessionStorage.setItem("creditcardtransactionsAll", JSON.stringify(this.creditcardtransactionsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
