
import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { StudentinstanceComponent } from '../../students/studentinstance/studentinstance.component';
import { PaymentComponent } from '../payment/payment.component';
import { PaymentinvoiceService } from '../paymentinvoice/paymentinvoice.service';

@Component({
  selector: 'app-paymentinvoice',
  templateUrl: './paymentinvoice.component.html',
  styleUrls: ['./paymentinvoice.component.css']
})
export class PaymentinvoiceComponent implements OnInit {
  @ViewChild("studentinstance") studentinstance: StudentinstanceComponent;
  @ViewChild("addstudentinstance") addstudentinstance: StudentinstanceComponent;
  @ViewChild("editstudentinstance") editstudentinstance: StudentinstanceComponent;

  @ViewChild("payment") payment: PaymentComponent;
  @ViewChild("addpayment") addpayment: PaymentComponent;
  @ViewChild("editpayment") editpayment: PaymentComponent;

  @Input()
  view: number = 1;
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  paymentinvoiceID = null;
  @Input()
  paymentID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();

  paymentinvoices = [];
  paymentinvoicesAll = [];
  paymentinvoice = {
    paymentinvoice_ID: 0,
    paymentinvoice_AMOUNT: 0,
    payment_ID: null,
    payment_DETAIL: "",
    studentinstance_ID: null,
    isactive: true
  }

  constructor(
    private paymentinvoiceservice: PaymentinvoiceService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router : Router,
  ) { }

  ngOnInit(): void {
    this.paymentinvoices = JSON.parse(window.sessionStorage.getItem('paymentinvoices'));
    this.paymentinvoicesAll = JSON.parse(window.sessionStorage.getItem('paymentinvoicesAll'));
    if (this.view == 1 && this.disabled == false && this.paymentinvoices == null) {
      this.paymentinvoiceGet();
    } else if (this.view == 1 && this.disabled == true && this.paymentinvoicesAll == null) {
      this.paymentinvoiceGetAll();
    } else if (this. view == 2 && this.paymentinvoicesAll == null) {
      this.paymentinvoiceGetAll();
    }

    if (this.paymentinvoiceID != 0 && !this.paymentinvoiceID && Number(window.sessionStorage.getItem('paymentinvoice'))>0) {
      this.paymentinvoiceID = Number(window.sessionStorage.getItem('paymentinvoice'));
    }

    if (this.view == 5 && this.paymentinvoiceID) {
      window.sessionStorage.setItem("paymentinvoice", this.paymentinvoiceID);
      this.paymentinvoiceGetOne(this.paymentinvoiceID);
    }
    // if (this.paymentinvoiceID == 0) {
    //   this.paymentDisabled = false;
    //   this.paymentinvoiceID = null;
    // }

  }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          width: 136,
          text: 'Refresh',
          onClick: this.paymentinvoiceGetAll.bind(this),
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
          onClick: this.paymentinvoiceAdvancedSearchAll.bind(this, this.paymentID),
        },
      }
    );
  }

  add() {
    this.paymentinvoice = {
      paymentinvoice_ID: 0,
      paymentinvoice_AMOUNT: 0,
      payment_ID: null,
      payment_DETAIL: "",
      studentinstance_ID: null,
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

  paymentinvoiceEdit(){
    this.disabled = false;
  }

  paymentinvoiceCancel() {
    this.disabled = true;
    if (this.paymentinvoice.paymentinvoice_ID==0) {
      this.router.navigate(["/home/paymentinvoice "], {});
    }
  }

  setPaymentinvoice(response) {
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.paymentinvoice = response;
  }

  setPaymentinvoices(response) {
    if ((this.view == 1 || this.view == 11)  && this.disabled == false) {
      this.paymentinvoices = response;
      window.sessionStorage.setItem("paymentinvoices", JSON.stringify(this.paymentinvoices));
    } else {
      this.paymentinvoicesAll = response;
      window.sessionStorage.setItem("paymentinvoicesAll", JSON.stringify(this.paymentinvoicesAll));
    }
    this.cancel.next();
  }

  paymentinvoiceGet() {
    this.paymentinvoiceservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setPaymentinvoices(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  paymentinvoiceGetAll() {
    this.paymentinvoiceservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setPaymentinvoices(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  paymentinvoiceGetOne(id) {
    this.disabled = true;
    this.paymentinvoiceservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setPaymentinvoice(response);

        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  paymentinvoiceAdd(paymentinvoice) {
    paymentinvoice.isactive="Y";

    if(this.view == 5){
      paymentinvoice.payment_ID = this.payment.paymentID;
      paymentinvoice.studentinstance_ID = this.studentinstance.studentinstanceID;
     }else{
      paymentinvoice.payment_ID = this.addpayment.paymentID;
      paymentinvoice.studentinstance_ID = this.addstudentinstance.studentinstanceID;
     }

    this.paymentinvoiceservice.add(paymentinvoice).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.paymentinvoice_ID) {
          this.toastrservice.success("Success", "New Paymentinvoice Added");
          this.paymentinvoiceGetAll();
          this.setPaymentinvoice(response);
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  paymentinvoiceUpdate(paymentinvoice) {
    if(this.view == 5){
      paymentinvoice.payment_ID = this.payment.paymentID;
      paymentinvoice.studentinstance_ID = this.studentinstance.studentinstanceID;
     }else{
      paymentinvoice.payment_ID = this.editpayment.paymentID;
      paymentinvoice.studentinstance_ID = this.editstudentinstance.studentinstanceID;
     }

    if (paymentinvoice.isactive == true) {
      paymentinvoice.isactive = "Y";
    } else {
      paymentinvoice.isactive = "N";
    }
    this.paymentinvoiceservice.update(paymentinvoice, paymentinvoice.paymentinvoice_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.paymentinvoice_ID) {
          this.toastrservice.success("Success", " Paymentinvoice Updated");
          this.paymentinvoiceGetAll();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  paymentinvoiceSearch(str) {
    var search = {
      search: str
    }
    this.paymentinvoiceservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setPaymentinvoices(this.paymentinvoiceservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  paymentinvoiceSearchAll(str) {
    var search = {
      search: str
    }
    this.paymentinvoiceservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setPaymentinvoices(this.paymentinvoiceservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  paymentinvoiceAdvancedSearch(paymentID) {
    var search = {
      payment_ID: paymentID
    }
    this.paymentinvoiceservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setPaymentinvoices(this.paymentinvoiceservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  paymentinvoiceAdvancedSearchAll(paymentID) {
    var search = {
      payment_ID: paymentID
    }
    this.paymentinvoiceservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setPaymentinvoices(this.paymentinvoiceservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
