import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { BankdepositService } from './bankdeposit.service';
import { BankaccountComponent } from '../bankaccount/bankaccount.component';
import { TransactionComponent } from '../transaction/transaction.component';

@Component({
  selector: 'app-bankdeposit',
  templateUrl: './bankdeposit.component.html',
  styleUrls: ['./bankdeposit.component.css']
})
export class BankdepositComponent implements OnInit {
  @ViewChild("tobankaccount") tobankaccount: BankaccountComponent;
  @ViewChild("frombankaccount") frombankaccount: BankaccountComponent;

  @ViewChild("transaction") transaction: TransactionComponent;
  @ViewChild("addtransaction") addtransaction: TransactionComponent;
  @ViewChild("edittransaction") edittransaction: TransactionComponent;


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
  bankdepositID = null;
  @Input()
  bankaccountID = null;
  @Input()
  transactionID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onBankDepositChange = new EventEmitter();

  bankdeposits = [];
  bankdepositsAll = [];
  bankdeposit = {
    bankdeposit_ID: 0,
    frombankaccount_ID: null,
    tobankaccount_ID: null,
    transaction_ID: null,

    bankdeposit_CODE: null,
    bankdeposit_DATE: null,

    cash_AMOUNT: null,
    cheque_AMOUNT: null,
    total_AMOUNT: null,

    isactive: true,
  }

  constructor(
    private bankdepositservice: BankdepositService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload): void {
    if (window.sessionStorage.getItem('bankdeposits') != null) {
      this.bankdeposits = JSON.parse(window.sessionStorage.getItem('bankdeposits'));
    }
    if (window.sessionStorage.getItem('bankdepositsAll') != null) {
      this.bankdepositsAll = JSON.parse(window.sessionStorage.getItem('bankdepositsAll'));
    }
    if (this.bankdepositID != 0 && !this.bankdepositID && Number(window.sessionStorage.getItem('bankdeposit')) > 0) {
      this.bankdepositID = Number(window.sessionStorage.getItem('bankdeposit'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.bankdeposits == null || this.bankdeposits.length == 0 || reload == true)) {
      this.bankdeposits == null;
      this.bankdepositGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.bankdepositsAll == null || this.bankdepositsAll.length == 0 || reload == true)) {
      this.bankdepositsAll == null;
      this.bankdepositGetAll();
    }

    var search = {
      frombankaccount_ID: this.bankaccountID,
      tobankaccount_ID: this.bankaccountID,
      transaction_ID: this.transactionID,
    }

    if (this.view >= 5 && this.view <= 6 && this.bankdepositID) {
      window.sessionStorage.setItem("bankdeposit", this.bankdepositID);
      this.bankdepositGetOne(this.bankdepositID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.bankdeposits == null || this.bankdeposits.length == 0 || reload == true)) {
      this.bankdeposits == null;
      this.bankdepositAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.bankdepositsAll == null || this.bankdepositsAll.length == 0 || reload == true)) {
      this.bankdepositsAll == null;
      this.bankdepositAdvancedSearchAll(search);
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
    this.bankdeposit = {
      bankdeposit_ID: 0,
      frombankaccount_ID: null,
      tobankaccount_ID: null,
      transaction_ID: null,

      bankdeposit_CODE: null,
      bankdeposit_DATE: null,

      cash_AMOUNT: null,
      cheque_AMOUNT: null,
      total_AMOUNT: null,

      isactive: true,
    };
  }

  transactionAddNew() {
    this.addtransaction.add();
    $("#addtransaction").modal("show");
  }

  transactionCancel() {
    $("#addtransaction").modal("hide");
    $("#edittransaction").modal("hide");
    this.transaction.transactions = this.addtransaction.transactions;
  }

  onTransactionChange(transaction) {
    // this.journal.journal_NAME = transaction.transaction_NAME;
    // this.journal.journal_DESC = transaction.transaction_DESC;
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

  bankdepositEdit() {
    this.disabled = false;
  }

  bankdepositCancel() {
    this.disabled = true;
    if (this.bankdeposit.bankdeposit_ID == 0) {
      this.router.navigate(["/home/bankdeposits "], {});
    }
  }

  onChange(bankdepositID) {
    for (var i = 0; i < this.bankdeposits.length; i++) {
      if (this.bankdeposits[i].bankdeposit_ID == bankdepositID) {
        this.onBankDepositChange.next(this.bankdeposits[i]);
        break;
      }
    }
  }

  setBankdeposit(response) {
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.bankdeposit = response;
  }

  setFeecategories(response) {
    this.cancel.next();
    return response;
  }

  bankdepositGet() {
    this.bankdepositservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.bankdeposits = this.setFeecategories(this.bankdepositservice.getAllDetail(response));
          window.sessionStorage.setItem("bankdeposits", JSON.stringify(this.bankdeposits));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  bankdepositGetAll() {
    this.bankdepositservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.bankdepositsAll = this.setFeecategories(this.bankdepositservice.getAllDetail(response));
          window.sessionStorage.setItem("bankdepositsAll", JSON.stringify(this.bankdepositsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  bankdepositGetOne(id) {
    this.disabled = true;
    this.bankdepositservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setBankdeposit(this.bankdepositservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  bankdepositAdd(bankdeposit) {
    bankdeposit.isactive = "Y";
    bankdeposit.transaction_ID = this.transaction.transactionID;
    bankdeposit.frombankaccount_ID = this.frombankaccount.bankaccountID;
    bankdeposit.tobankaccount_ID = this.tobankaccount.bankaccountID;

    this.bankdepositservice.add(bankdeposit).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.bankdeposit_ID) {
          this.toastrservice.success("Success", "New Bank Deposit Added");
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

  bankdepositUpdate(bankdeposit) {
    bankdeposit.transaction_ID = this.transaction.transactionID;
    bankdeposit.frombankaccount_ID = this.frombankaccount.bankaccountID;
    bankdeposit.tobankaccount_ID = this.tobankaccount.bankaccountID;

    if (bankdeposit.isactive == true) {
      bankdeposit.isactive = "Y";
    } else {
      bankdeposit.isactive = "N";
    }
    this.bankdepositservice.update(bankdeposit, bankdeposit.bankdeposit_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.bankdeposit_ID) {
          this.toastrservice.success("Success", "Bank Deposit Updated");
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

  bankdepositUpdateAll(bankdeposits) {
    this.bankdepositservice.updateAll(bankdeposits).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Bank Deposit Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  bankdepositSearch(str) {
    var search = {
      search: str
    }
    this.bankdepositservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.bankdeposits = this.setFeecategories(this.bankdepositservice.getAllDetail(response));
          window.sessionStorage.setItem("bankdeposits", JSON.stringify(this.bankdeposits));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  bankdepositSearchAll(str) {
    var search = {
      search: str
    }
    this.bankdepositservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.bankdepositsAll = this.setFeecategories(this.bankdepositservice.getAllDetail(response));
          window.sessionStorage.setItem("bankdepositsAll", JSON.stringify(this.bankdepositsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  bankdepositAdvancedSearch(search) {
    this.bankaccountID = search.tobankaccount_ID;
    this.bankaccountID = search.frombankaccount_ID;
    this.transactionID = search.transaction_ID;

    this.bankdepositservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.bankdeposits = this.setFeecategories(this.bankdepositservice.getAllDetail(response));
          window.sessionStorage.setItem("bankdeposits", JSON.stringify(this.bankdeposits));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  bankdepositAdvancedSearchAll(search) {
    this.bankaccountID = search.tobankaccount_ID;
    this.bankaccountID = search.frombankaccount_ID;
    this.transactionID = search.transaction_ID;


    this.bankdepositservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.bankdepositsAll = this.setFeecategories(this.bankdepositservice.getAllDetail(response));
          window.sessionStorage.setItem("bankdepositsAll", JSON.stringify(this.bankdepositsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
