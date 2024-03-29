import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { BanktransferService } from './banktransfer.service';
import { BankaccountComponent } from '../bankaccount/bankaccount.component';
import { TransactionComponent } from '../transaction/transaction.component';

declare var $: any;
@Component({
  selector: 'app-banktransfer',
  templateUrl: './banktransfer.component.html',
  styleUrls: ['./banktransfer.component.css']
})
export class BanktransferComponent implements OnInit {
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
  banktransferID = null;
  @Input()
  bankaccountID = null;
  @Input()
  frombankaccountID = null;
  @Input()
  tobankaccountID = null;
  @Input()
  transactionID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onBankTransferChange = new EventEmitter();

  banktransfers = [];
  banktransfersAll = [];
  banktransfer = {
    banktransfer_ID: 0,
    frombankaccount_ID: null,
    tobankaccount_ID: null,
    transaction_ID: null,

    banktransfer_NAME: null,
    banktransfer_CODE: null,
    banktransfer_AMOUNT: null,
    banktransfer_DESC: null,
    isactive: true,
  }

  constructor(
    private banktransferservice: BanktransferService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload): void {
    if (window.sessionStorage.getItem('banktransfers') != null) {
      this.banktransfers = JSON.parse(window.sessionStorage.getItem('banktransfers'));
    }
    if (window.sessionStorage.getItem('banktransfersAll') != null) {
      this.banktransfersAll = JSON.parse(window.sessionStorage.getItem('banktransfersAll'));
    }
    if (this.banktransferID != 0 && !this.banktransferID && Number(window.sessionStorage.getItem('banktransfer')) > 0) {
      this.banktransferID = Number(window.sessionStorage.getItem('banktransfer'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.banktransfers == null || this.banktransfers.length == 0 || reload == true)) {
      this.banktransfers == null;
      this.banktransferGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.banktransfersAll == null || this.banktransfersAll.length == 0 || reload == true)) {
      this.banktransfersAll == null;
      this.banktransferGetAll();
    }

    var search = {
      frombankaccount_ID: this.frombankaccountID,
      tobankaccount_ID: this.tobankaccountID,
      transaction_ID: this.transactionID,
    }

    if (this.view >= 5 && this.view <= 6 && this.banktransferID) {
      window.sessionStorage.setItem("banktransfer", this.banktransferID);
      this.banktransferGetOne(this.banktransferID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.banktransfers == null || this.banktransfers.length == 0 || reload == true)) {
      this.banktransfers == null;
      this.banktransferAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.banktransfersAll == null || this.banktransfersAll.length == 0 || reload == true)) {
      this.banktransfersAll == null;
      this.banktransferAdvancedSearchAll(search);
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
    this.banktransfer = {
      banktransfer_ID: 0,
      frombankaccount_ID: null,
      tobankaccount_ID: null,
      transaction_ID: null,

      banktransfer_NAME: null,
      banktransfer_CODE: null,
      banktransfer_AMOUNT: null,
      banktransfer_DESC: null,
      isactive: true,
    };
  }

  transactionAddNew() {
    this.addtransaction.add();
    $("#addtransaction").modal("show");
  }

  transactionrefresh() {
    this.transaction.load(true);
    this.transactionCancel();
  }

  transactionCancel() {
    $("#addtransaction").modal("hide");
    $("#edittransaction").modal("hide");
    this.transaction.transactions = this.addtransaction.transactions;
  }

  onTransactionChange(transaction) {
    this.banktransfer.banktransfer_NAME = transaction.transaction_NAME;
    this.banktransfer.banktransfer_AMOUNT = transaction.transaction_AMOUNT;
    this.banktransfer.banktransfer_DESC = transaction.transaction_DESC;
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

  banktransferEdit() {
    this.disabled = false;
  }

  banktransferCancel() {
    this.disabled = true;
    if (this.banktransfer.banktransfer_ID == 0) {
      this.router.navigate(["/home/banktransfer"], {});
    }
  }

  onChange(banktransferID) {
    for (var i = 0; i < this.banktransfersAll.length; i++) {
      if (this.banktransfersAll[i].banktransfer_ID == banktransferID) {
        this.onBankTransferChange.next(this.banktransfersAll[i]);
        break;
      }
    }
  }

  setBanktransfer(response) {
    this.banktransferID = response.banktransfer_ID;
    this.banktransferID = response.tobanktransfer_ID;
    this.banktransferID = response.frombanktransfer_ID;
    this.transactionID = response.transaction_ID;

    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.banktransfer = response;
  }

  setBanktransfers(response) {
    this.cancel.next();
    return response;
  }

  banktransferGet() {
    this.banktransferservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.banktransfers = this.setBanktransfers(this.banktransferservice.getAllDetail(response));
          window.sessionStorage.setItem("banktransfers", JSON.stringify(this.banktransfers));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  banktransferGetAll() {
    this.banktransferservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.banktransfersAll = this.setBanktransfers(this.banktransferservice.getAllDetail(response));
          window.sessionStorage.setItem("banktransfersAll", JSON.stringify(this.banktransfersAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  banktransferGetOne(id) {
    this.disabled = true;
    this.banktransferservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setBanktransfer(this.banktransferservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  banktransferAdd(banktransfer) {
    banktransfer.isactive = "Y";
    banktransfer.transaction_ID = this.transaction.transactionID;
    banktransfer.frombankaccount_ID = this.frombankaccount.bankaccountID;
    banktransfer.tobankaccount_ID = this.tobankaccount.bankaccountID;

    this.banktransferservice.add(banktransfer).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.banktransfer_ID) {
          this.toastrservice.success("Success", "New Bank Transfer Added");
          this.setBanktransfer(this.banktransferservice.getDetail(response));
          this.refresh.next();
          this.disabled = true;
          this.banktransferGetAll();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  banktransferUpdate(banktransfer) {
    banktransfer.transaction_ID = this.transaction.transactionID;
    banktransfer.frombankaccount_ID = this.frombankaccount.bankaccountID;
    banktransfer.tobankaccount_ID = this.tobankaccount.bankaccountID;

    if (banktransfer.isactive == true) {
      banktransfer.isactive = "Y";
    } else {
      banktransfer.isactive = "N";
    }
    this.banktransferservice.update(banktransfer, banktransfer.banktransfer_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.banktransfer_ID) {
          this.toastrservice.success("Success", "Bank Transfer Updated");
          this.setBanktransfer(this.banktransferservice.getDetail(response));
          this.refresh.next();
          this.disabled = true;
          this.banktransferGetAll();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  banktransferUpdateAll(banktransfers) {
    this.banktransferservice.updateAll(banktransfers).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Bank Transfer Updated");
          this.setBanktransfer(this.banktransferservice.getDetail(response));
          this.refresh.next();
          this.disabled = true;
          this.banktransferGetAll();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  banktransferSearch(str) {
    var search = {
      search: str
    }
    this.banktransferservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.banktransfers = this.setBanktransfers(this.banktransferservice.getAllDetail(response));
          window.sessionStorage.setItem("banktransfers", JSON.stringify(this.banktransfers));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  banktransferSearchAll(str) {
    var search = {
      search: str
    }
    this.banktransferservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.banktransfersAll = this.setBanktransfers(this.banktransferservice.getAllDetail(response));
          window.sessionStorage.setItem("banktransfersAll", JSON.stringify(this.banktransfersAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  banktransferAdvancedSearch(search) {
    this.tobankaccountID = search.tobankaccount_ID;
    this.frombankaccountID = search.frombankaccount_ID;
    this.transactionID = search.transaction_ID;

    this.banktransferservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.banktransfers = this.setBanktransfers(this.banktransferservice.getAllDetail(response));
          window.sessionStorage.setItem("banktransfers", JSON.stringify(this.banktransfers));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  banktransferAdvancedSearchAll(search) {
    this.tobankaccountID = search.tobankaccount_ID;
    this.frombankaccountID = search.frombankaccount_ID;
    this.transactionID = search.transaction_ID;

    this.banktransferservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.banktransfersAll = this.setBanktransfers(this.banktransferservice.getAllDetail(response));
          window.sessionStorage.setItem("banktransfersAll", JSON.stringify(this.banktransfersAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
