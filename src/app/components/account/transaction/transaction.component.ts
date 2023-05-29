import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { CurrencyComponent } from '../../lookup/finance/currency/currency.component';
import { TransactiontypeComponent } from '../../lookup/account/transactiontype/transactiontype.component';
import { TransactionService } from './transaction.service';
import { BankaccountComponent } from '../bankaccount/bankaccount.component';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  @ViewChild("bankaccount") bankaccount: BankaccountComponent;
  @ViewChild("transactiontype") transactiontype: TransactiontypeComponent;
  @ViewChild("currency") currency: CurrencyComponent;

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
  transactionID = null;
  @Input()
  bankaccountID = null;
  @Input()
  transactiontypeID = null;
  @Input()
  transactiontypeCode = null;
  @Input()
  currencyID = null;
  @Input()
  currencyCode = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onTransactionChange = new EventEmitter();

  transactions = [];
  transactionsAll = [];
  transaction = {
    transaction_ID: 0,
    bankaccount_ID: null,
    currency_ID: null,
    transactiontype_ID: null,

    transaction_CODE: null,
    transaction_DATE: null,
    transaction_TOTAL: null,
    transaction_NAME: null,
    transaction_DESC: null,

    isactive: true,
  }

  constructor(
    private transactionservice: TransactionService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload) {
    if (window.sessionStorage.getItem('transactions') != null) {
      this.transactions = JSON.parse(window.sessionStorage.getItem('transactions'));
    }
    if (window.sessionStorage.getItem('transactionsAll') != null) {
      this.transactionsAll = JSON.parse(window.sessionStorage.getItem('transactionsAll'));
    }
    if (this.transactionID != 0 && !this.transactionID && Number(window.sessionStorage.getItem('transaction')) > 0) {
      this.transactionID = Number(window.sessionStorage.getItem('transaction'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.transactions == null || this.transactions.length == 0 || reload == true)) {
      this.transactions == null;
      this.transactionGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.transactionsAll == null || this.transactionsAll.length == 0 || reload == true)) {
      this.transactionsAll == null;
      this.transactionGetAll();
    }

    var search = {
      bankaccount_ID: this.bankaccountID,
      transactiontype_ID: this.transactiontypeID,
      transactiontype_CODE: this.transactiontypeCode,
      currency_ID: this.currencyID,
      currency_CODE: this.currencyCode,
    }

    if (this.view >= 5 && this.view <= 6 && this.transactionID) {
      window.sessionStorage.setItem("transaction", this.transactionID);
      this.transactionGetOne(this.transactionID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.transactions == null || this.transactions.length == 0 || reload == true)) {
      this.transactions == null;
      this.transactionAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.transactionsAll == null || this.transactionsAll.length == 0 || reload == true)) {
      this.transactionsAll == null;
      this.transactionAdvancedSearchAll(search);
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
    this.transaction = {
      transaction_ID: 0,
      bankaccount_ID: null,
      currency_ID: null,
      transactiontype_ID: null,

      transaction_CODE: null,
      transaction_DATE: null,
      transaction_TOTAL: null,
      transaction_NAME: null,
      transaction_DESC: null,

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

  transactionEdit() {
    this.disabled = false;
  }

  transactionCancel() {
    this.disabled = true;
    if (this.transaction.transaction_ID == 0) {
      this.router.navigate(["/home/transactions"], {});
    }
  }

  onChange(transactionID) {
    for (var i = 0; i < this.transactionsAll.length; i++) {
      if (this.transactionsAll[i].transaction_ID == transactionID) {
        this.onTransactionChange.next(this.transactionsAll[i]);
        break;
      }
    }
  }

  setTransaction(response) {
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
    this.transaction = response;
  }

  setTransactions(response) {
    this.cancel.next();
    return response;
  }

  transactionGet() {
    this.transactionservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.transactions = this.setTransactions(this.transactionservice.getAllDetail(response));
          window.sessionStorage.setItem("transactions", JSON.stringify(this.transactions));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  transactionGetAll() {
    this.transactionservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.transactionsAll = this.setTransactions(this.transactionservice.getAllDetail(response));
          window.sessionStorage.setItem("transactionsAll", JSON.stringify(this.transactionsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  transactionGetOne(id) {
    this.disabled = true;
    this.transactionservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setTransaction(this.transactionservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  transactionAdd(transaction) {
    transaction.isactive = "Y";
    transaction.bankaccount_ID = this.bankaccount.bankaccountID;
    transaction.currency_ID = this.currency.currencyID;
    transaction.transactiontype_ID = this.transactiontype.transactiontypeID;

    this.transactionservice.add(transaction).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.transaction_ID) {
          this.toastrservice.success("Success", "New Transaction Added");
          this.refresh.next();
          this.disabled = true;
          this.transactionGetAll();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  transactionUpdate(transaction) {
    transaction.bankaccount_ID = this.bankaccount.bankaccountID;
    transaction.currency_ID = this.currency.currencyID;
    transaction.transactiontype_ID = this.transactiontype.transactiontypeID;

    if (transaction.isapproved == true) {
      transaction.isapproved = "Y";
    } else {
      transaction.isapproved = "N";
    }
    if (transaction.isactive == true) {
      transaction.isactive = "Y";
    } else {
      transaction.isactive = "N";
    }
    this.transactionservice.update(transaction, transaction.transaction_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.transaction_ID) {
          this.toastrservice.success("Success", "Transaction Updated");
          this.refresh.next();
          this.disabled = true;
          this.transactionGetAll();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  transactionUpdateAll(transactions) {
    this.transactionservice.updateAll(transactions).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Transactions Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  transactionSearch(str) {
    var search = {
      search: str
    }
    this.transactionservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.transactions = this.setTransactions(this.transactionservice.getAllDetail(response));
          window.sessionStorage.setItem("transactions", JSON.stringify(this.transactions));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  transactionSearchAll(str) {
    var search = {
      search: str
    }
    this.transactionservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.transactionsAll = this.setTransactions(this.transactionservice.getAllDetail(response));
          window.sessionStorage.setItem("transactionsAll", JSON.stringify(this.transactionsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  transactionAdvancedSearch(search) {
    this.bankaccountID = search.bankaccount_ID;
    this.transactiontypeID = search.transactiontype_ID;
    this.transactiontypeCode = search.transactiontype_CODE;
    this.currencyID = search.currency_ID;
    this.currencyCode = search.currency_CODE;

    this.transactionservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.transactions = this.setTransactions(this.transactionservice.getAllDetail(response));
          window.sessionStorage.setItem("transactions", JSON.stringify(this.transactions));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  transactionAdvancedSearchAll(search) {
    this.bankaccountID = search.bankaccount_ID;
    this.transactiontypeID = search.transactiontype_ID;
    this.transactiontypeCode = search.transactiontype_CODE;
    this.currencyID = search.currency_ID;
    this.currencyCode = search.currency_CODE;

    this.transactionservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.transactionsAll = this.setTransactions(this.transactionservice.getAllDetail(response));
          window.sessionStorage.setItem("transactionsAll", JSON.stringify(this.transactionsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
