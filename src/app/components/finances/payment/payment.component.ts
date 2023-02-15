
import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { PaymentmethodComponent } from '../../lookups/paymentmethod/paymentmethod.component';
import { StudentinstanceComponent } from '../../students/studentinstance/studentinstance.component';
import { AccountComponent } from '../account/account.component';
import { PaymentstatusComponent } from '../../lookups/paymentstatus/paymentstatus.component';
import { PaymentService } from './payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  @ViewChild("studentinstance") studentinstance: StudentinstanceComponent;
  @ViewChild("addstudentinstance") addstudentinstance: StudentinstanceComponent;
  @ViewChild("editstudentinstance") editstudentinstance: StudentinstanceComponent;

  @ViewChild("account") account: AccountComponent;
  @ViewChild("addaccount") addaccount: AccountComponent;
  @ViewChild("editaccount") editaccount: AccountComponent;

  @ViewChild("paymentstatus") paymentstatus: PaymentstatusComponent;
  @ViewChild("addpaymentstatus") addpaymentstatus: PaymentstatusComponent;
  @ViewChild("editpaymentstatus") editpaymentstatus: PaymentstatusComponent;

  @ViewChild("paymentmethod") paymentmethod: PaymentmethodComponent;
  @ViewChild("addpaymentmethod") addpaymentmethod: PaymentmethodComponent;
  @ViewChild("editpaymentmethod") editpaymentmethod: PaymentmethodComponent;

  @Input()
  view: number = 1;
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  paymentID = null;
  @Input()
  studentinstanceID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() recievedPayment = new EventEmitter();

  payments = [];
  paymentsAll = [];
  payment = {
    payment_ID: 0,
    studentinstance_ID: null,
    payment_NUMBER: "",
    payment_DATE: "",
    payment_AMOUNT: 0.0,
    account_ID: null,
    paymentmethod_ID: null,
    paymentstatus_ID: null,
    isactive: true
  }

  saleorderinvoicepayment = {
    account_ID: null,
    paymentmethod_ID: null,
    payment_DATE: null,
    payment_AMOUNT: 0.0,
    saleorderinvoices: []
  }

  studentinstancefeepayment = {
    account_ID: null,
    paymentmethod_ID: null,
    payment_DATE: null,
    payment_AMOUNT: 0.0,
    studentinstancefees: []
  }


  constructor(
    private paymentservice: PaymentService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.payments = JSON.parse(window.sessionStorage.getItem('payments'));
    this.paymentsAll = JSON.parse(window.sessionStorage.getItem('paymentsAll'));
    if (this.view == 1 && this.disabled == false && this.payments == null) {
      this.paymentGet();
    } else if (this.view == 1 && this.disabled == true && this.paymentsAll == null) {
      this.paymentGetAll();
    } else if (this.view == 2 && this.paymentsAll == null) {
      this.paymentGetAll();
    }

    if (this.paymentID != 0 && !this.paymentID && Number(window.sessionStorage.getItem('payment')) > 0) {
      this.paymentID = Number(window.sessionStorage.getItem('payment'));
    }

    if (this.view == 5 && this.paymentID) {
      window.sessionStorage.setItem("payment", this.paymentID);
      this.paymentGetOne(this.paymentID);
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
          onClick: this.paymentGetAll.bind(this),
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
          onClick: this.paymentAdvancedSearchAll.bind(this, this.studentinstanceID),
        },
      }
    );
  }

  add() {
    this.payment = {
      payment_ID: 0,
      studentinstance_ID: null,
      payment_NUMBER: "",
      payment_DATE: "",
      payment_AMOUNT: 0.0,
      account_ID: null,
      paymentmethod_ID: null,
      paymentstatus_ID: null,
      isactive: true
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

  paymentEdit() {
    this.disabled = false;
  }

  paymentCancel() {
    this.disabled = true;
    if (this.payment.payment_ID == 0) {
      this.router.navigate(["/home/payment"], {});
    }
  }

  paymentRecieved(payment) {
    if (payment.payment_DATE == "") {
      this.toastrservice.warning("Message", "Select the Payment Date!");
    } else if (this.paymentmethod.paymentmethodID == null) {
      this.toastrservice.warning("Message", "Select the Payment Method!");
    } else if (this.account.accountID == null) {
      this.toastrservice.warning("Message", "Select the Payment Account!");
    } else {
      payment.account_ID = this.account.accountID;
      payment.paymentmethod_ID = this.paymentmethod.paymentmethodID;
      this.recievedPayment.next();
    }
  }

  setPayment(response) {
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.payment = response;
  }

  setPayments(response) {
    if ((this.view == 1 || this.view == 11) && this.disabled == false) {
      this.payments = response;
      window.sessionStorage.setItem("payments", JSON.stringify(this.payments));
    } else {
      this.paymentsAll = response;
      window.sessionStorage.setItem("paymentsAll", JSON.stringify(this.paymentsAll));
    }
    this.cancel.next();
  }

  paymentGet() {
    this.paymentservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setPayments(this.paymentservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  paymentGetAll() {
    this.paymentservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setPayments(this.paymentservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  paymentGetOne(id) {
    this.disabled = true;
    this.paymentservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setPayment(this.paymentservice.getDetail(response));

        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  paymentAdd(payment) {
    payment.isactive = "Y";
    if (this.view == 5) {
      payment.account_ID = this.account.accountID;
      payment.paymentstatus_ID = this.paymentstatus.paymentstatusID;
      payment.studentinstance_ID = this.studentinstance.studentinstanceID;
      payment.paymentmethod_ID = this.paymentmethod.paymentmethodID;
    } else {
      payment.account_ID = this.addaccount.accountID;
      payment.paymentstatus_ID = this.addpaymentstatus.paymentstatusID;
      payment.studentinstance_ID = this.addstudentinstance.studentinstanceID;
      payment.paymentmethod_ID = this.addpaymentmethod.paymentmethodID;
    }
    this.paymentservice.add(payment).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.payment_ID) {
          this.toastrservice.success("Success", "New Payment Added");
          this.paymentGetAll();
          this.setPayment(this.paymentservice.getDetail(response));
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  paymentUpdate(payment) {
    if (this.view == 5) {
      payment.account_ID = this.account.accountID;
      payment.paymentstatus_ID = this.paymentstatus.paymentstatusID;
      payment.studentinstance_ID = this.studentinstance.studentinstanceID;
      payment.paymentmethod_ID = this.paymentmethod.paymentmethodID;
    } else {
      payment.account_ID = this.editaccount.accountID;
      payment.paymentstatus_ID = this.editpaymentstatus.paymentstatusID;
      payment.studentinstance_ID = this.editstudentinstance.studentinstanceID;
      payment.paymentmethod_ID = this.editpaymentmethod.paymentmethodID;
    }
    if (payment.isactive == true) {
      payment.isactive = "Y";
    } else {
      payment.isactive = "N";
    }
    this.paymentservice.update(payment, payment.payment_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.payment_ID) {
          this.toastrservice.success("Success", " Payment Updated");
          if (this.disabled == true) {
            this.setPayment(this.paymentservice.getDetail(response));
            this.paymentGetAll();
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

  paymentSearch(str) {
    var search = {
      search: str
    }
    this.paymentservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setPayments(this.paymentservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  paymentSearchAll(str) {
    var search = {
      search: str
    }
    this.paymentservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setPayments(this.paymentservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  paymentAdvancedSearch(studentinstanceID) {
    var search = {
      studentinstance_ID: studentinstanceID
    }
    this.paymentservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setPayments(this.paymentservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  paymentAdvancedSearchAll(studentinstanceID) {
    var search = {
      studentinstance_ID: studentinstanceID
    }
    this.paymentservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setPayments(this.paymentservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  paymentReceivedStudent(studentinstancefees) {
    var studentinstancefeeInvoices = [];

    this.studentinstancefeepayment.payment_DATE = this.payment.payment_DATE;
    this.studentinstancefeepayment.account_ID = this.account.accountID;
    this.studentinstancefeepayment.paymentmethod_ID = this.paymentmethod.paymentmethodID;
    for (var i = 0; i < studentinstancefees.length; i++) {
      var studentinstancefee = {
        studentinstance_ID: studentinstancefees[i].studentinstance_ID,
        studentinstancefee_ID: studentinstancefees[i].studentinstancefee_ID,
        paymentinvoice_AMOUNT: studentinstancefees[i].payment,
        amount_DUE: studentinstancefees[i].amount_DUE - studentinstancefees[i].payment
      }
      studentinstancefeeInvoices.push(studentinstancefee)
    }

    this.studentinstancefeepayment.studentinstancefees = studentinstancefeeInvoices;

    this.paymentservice.receivedPaymentStudent(this.studentinstancefeepayment).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.toastrservice.success("Success", " Payment Updated");
          if (this.disabled == true) {
            this.setPayment(this.paymentservice.getDetail(response));
            this.paymentGetAll();
          } else {
            this.disabled = true;
          }
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
