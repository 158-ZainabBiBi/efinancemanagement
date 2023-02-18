import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { OnFailService } from '../../../services/on-fail.service';
import { Router } from '@angular/router';
import { CardtypeComponent } from '../../lookups/cardtype/cardtype.component';
import { CustomerComponent } from '../../customers/customer/customer.component';
import { CreditcardtransactionService } from './creditcardtransaction.service';

@Component({
  selector: 'app-creditcardtransaction',
  templateUrl: './creditcardtransaction.component.html',
  styleUrls: ['./creditcardtransaction.component.css']
})
export class CreditcardtransactionComponent implements OnInit {
  @ViewChild("customer") customer: CustomerComponent;
  @ViewChild("addcustomer") addcustomer: CustomerComponent;
  @ViewChild("editcustomer") editcustomer: CustomerComponent;

  @ViewChild("cardtype") cardtype: CardtypeComponent;
  @ViewChild("addcardtype") addcardtype: CardtypeComponent;
  @ViewChild("editcardtype") editcardtype: CardtypeComponent;
  
  @Input()
  view: number = 1;
  @Input()
  iscompulsory: boolean = false;
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

  @Output() show = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();

  creditcardtransactions = [];
  creditcardtransactionsAll = [];
  creditcardtransaction = {
    creditcardtransaction_ID: 0,
    cardtype_ID: 0,
    customer_ID: 0,
    transaction_DATE: "",
    transaction_AMOUNT: "",
    transaction_STATUS: "",
    name_ONCARD: "",
    card_NUMBER: "",
    authcode: "",
    isactive: true,
  }

  constructor(
    private creditcardtransactionservice: CreditcardtransactionService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router : Router,
  ) { }

  ngOnInit(): void {
    this.creditcardtransactions = JSON.parse(window.sessionStorage.getItem('creditcardtransactions'));
    this.creditcardtransactionsAll = JSON.parse(window.sessionStorage.getItem('creditcardtransactionsAll'));
    if (this.view == 1 && this.creditcardtransactions == null) {
      this.creditcardtransactionGet();
    }else if (this.view == 1 && this.disabled == true && this.creditcardtransactionsAll == null) {
        this.creditcardtransactionGetAll();
    } else if (this. view == 2 && this.creditcardtransactionsAll == null) {
      this.creditcardtransactionGetAll();
    } else if (this. view == 22 && (this.customerID != null )) {
      this.creditcardtransactionAdvancedSearchAll(this.customerID);
    }

    if (this.creditcardtransactionID != 0 && !this.creditcardtransactionID && Number(window.sessionStorage.getItem('creditcardtransaction'))>0) {
      this.creditcardtransactionID = Number(window.sessionStorage.getItem('creditcardtransaction'));
    }
    if (this.view == 5 && this.creditcardtransactionID) {
      window.sessionStorage.setItem("creditcardtransaction", this.creditcardtransactionID);
      this.creditcardtransactionGetOne(this.creditcardtransactionID);
    } if (this.view == 11 && this.customerID && this.disabled == false) {
      this.creditcardtransactionAdvancedSearch(this.customerID);
    } else if (this.view == 11 && this.customerID && this.disabled == true) {
      this.creditcardtransactionAdvancedSearchAll(this.customerID);
      
    } else if (this.view == 11 || this.view == 1 ) {
      this.creditcardtransactionID = null;
      this.creditcardtransactionsAll = null;
      this.creditcardtransactions = null;
    }

    if (this.creditcardtransactionID == 0) {
      this.creditcardtransactionID = null;
    }
  }

  showView(row) {
    this.show.next(row);
  }

  editView() {
    this.disabled = false;
  }

  cancelView() {
    this.cancel.next();
  } 

  creditcardtransactionCancel() {
    console.log(this.creditcardtransaction);
    this.disabled = true;
    if (this.creditcardtransaction.creditcardtransaction_ID == 0) {
      this.router.navigate(["/home/creditcardtransactions"], {});
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
          onClick: this.creditcardtransactionGetAll.bind(this),
        },
      }
    );
  }

  onToolbarPreparingAdvanced(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          width: 136,
          text: 'Refresh',
          onClick: this.creditcardtransactionAdvancedSearchAll.bind(this, this.customerID),
        },
      }
    );
  }

  add() {
    this.creditcardtransaction = {
      creditcardtransaction_ID: 0,
    cardtype_ID: 0,
    customer_ID: 0,
    transaction_DATE: "",
    transaction_AMOUNT: "",
    transaction_STATUS: "",
    name_ONCARD: "",
    card_NUMBER: "",
    authcode: "",
    isactive: true,
    };
  }
  setcreditcardtransaction(response){
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.creditcardtransaction = response;
    this.disabled = true;
  }

  update(row) {
    this.edit.next(row);
  }

  setcreditcardtransactions(response) {
    if ((this.view == 1 || this.view == 11)  && this.disabled == false) {
      this.creditcardtransactions = response;
      window.sessionStorage.setItem("creditcardtransactions", JSON.stringify(this.creditcardtransactions));
    } else {
      this.creditcardtransactionsAll = response;
      window.sessionStorage.setItem("creditcardtransactionsAll", JSON.stringify(this.creditcardtransactionsAll));
    }
    this.cancel.next();
  }

  creditcardtransactionGet() {
      this.creditcardtransactionservice.get().subscribe(response => {
        if (response) {
          if (response.error && response.status) {
            this.toastrservice.warning("Message", " " + response.message);
          } else{
            this.setcreditcardtransactions(this.creditcardtransactionservice.getAllDetail(response));
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
        } else{
          this.setcreditcardtransactions(this.creditcardtransactionservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }
  creditcardtransactionGetOne(id) {
    this.creditcardtransactionservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setcreditcardtransaction(this.creditcardtransactionservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }
  creditcardtransactionAdd(creditcardtransaction) {
    creditcardtransaction.isactive = "Y";
    if(this.view == 5){
      creditcardtransaction.customer_ID = this.customer.customerID;
     creditcardtransaction.cardtype_ID = this.cardtype.cardtypeID;
     
    } else { 
       creditcardtransaction.customer_ID = this.addcustomer.customerID;
      creditcardtransaction.cardtype_ID = this.addcardtype.cardtypeID;
    }
    this.creditcardtransactionservice.add(creditcardtransaction).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.creditcardtransaction_ID) {
          this.toastrservice.success("Success", "New creditcardtransaction Added");
          this.creditcardtransactionGetAll();
          this.setcreditcardtransaction(this.creditcardtransactionservice.getDetail(response));
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
    if(this.view == 5){
      creditcardtransaction.customer_ID = this.customer.customerID;
       creditcardtransaction.cardtype_ID = this.cardtype.cardtypeID;
    } else { 
      creditcardtransaction.customer_ID = this.editcustomer.customerID;
      creditcardtransaction.cardtype_ID = this.editcardtype.cardtypeID;
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
          this.toastrservice.success("Success", "creditcardtransaction Updated");
          if (this.disabled == true) {
            this.setcreditcardtransaction(this.creditcardtransactionservice.getDetail(response));
          } else {
            this.disabled = true;
          }
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
        } else{
          this.setcreditcardtransactions(this.creditcardtransactionservice.getAllDetail(response));
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
        } else{
          this.setcreditcardtransactions(this.creditcardtransactionservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  creditcardtransactionAdvancedSearch(customerID) {
    this.customerID = customerID;
    var search = {
      customer_ID: customerID
    }
    this.creditcardtransactionservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setcreditcardtransactions(this.creditcardtransactionservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  creditcardtransactionAdvancedSearchAll(customerID) {
    this.customerID = customerID;
    var search = {
      customer_ID: customerID
    }
    this.creditcardtransactionservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setcreditcardtransactions(this.creditcardtransactionservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
