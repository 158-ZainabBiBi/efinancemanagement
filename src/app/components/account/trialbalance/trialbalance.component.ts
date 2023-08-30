import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { LedgerComponent } from '../ledger/ledger.component';
import { TrialbalanceService } from './trialbalance.service';

declare var jsPDF: any;
declare var $: any;

@Component({
  selector: 'app-trialbalance',
  templateUrl: './trialbalance.component.html',
  styleUrls: ['./trialbalance.component.css']
})
export class TrialbalanceComponent implements OnInit, AfterViewInit {
  @ViewChild("ledger") ledger: LedgerComponent;
  @ViewChild("addledger") addledger: LedgerComponent;
  @ViewChild("editledger") editledger: LedgerComponent;

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
  trialbalanceID = null;
  @Input()
  ledgerID = null;
  @Input()
  totalcredit: number = 0;
  @Input()
  totaldebit: number = 0;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onTrialBalanceChange = new EventEmitter();

  trialbalances = [];
  trialbalancesAll = [];
  trialbalance = {
    trialbalance_ID: 0,
    trialbalance_CODE: null,
    trialbalance_NAME: null,
    ledger_ID: null,
    isactive: true
  }

  constructor(
    private trialbalanceservice: TrialbalanceService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  ngAfterViewInit(): void {
    this.totalcredit = this.getTotalCredit();
    this.totaldebit = this.getTotalDebit();
    this.cdr.detectChanges();
  }

  load(reload) {
    if (window.sessionStorage.getItem('trialbalances') != null) {
      this.trialbalances = JSON.parse(window.sessionStorage.getItem('trialbalances'));
    }
    if (window.sessionStorage.getItem('trialbalancesAll') != null) {
      this.trialbalancesAll = JSON.parse(window.sessionStorage.getItem('trialbalancesAll'));
    }
    if (this.trialbalanceID != 0 && !this.trialbalanceID && Number(window.sessionStorage.getItem('trialbalance')) > 0) {
      this.trialbalanceID = Number(window.sessionStorage.getItem('trialbalance'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.trialbalances == null || this.trialbalances.length == 0 || reload == true)) {
      this.trialbalances == null;
      this.trialbalanceGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.trialbalancesAll == null || this.trialbalancesAll.length == 0 || reload == true)) {
      this.trialbalancesAll == null;
      this.trialbalanceGetAll();
    }

    var search = {
      ledger_ID: this.ledgerID
    }

    if (this.view >= 5 && this.view <= 6 && this.trialbalanceID) {
      window.sessionStorage.setItem("trialbalance", this.trialbalanceID);
      this.trialbalanceGetOne(this.trialbalanceID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.trialbalances == null || this.trialbalances.length == 0 || reload == true)) {
      this.trialbalances == null;
      this.trialbalanceAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.trialbalancesAll == null || this.trialbalancesAll.length == 0 || reload == true)) {
      this.trialbalancesAll == null;
      this.trialbalanceAdvancedSearchAll(search);
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
      },
    );
  }

  getTotalCredit() {
    let total = 0;
    if (this.trialbalancesAll) {
      this.trialbalancesAll.forEach(totals => {
        const credit = Number(totals.ledger.ledger_CREDIT);
        if (!isNaN(credit)) {
          total += credit;
        }
      });
    }
    return total;
  }

  getTotalDebit() {
    let total = 0;
    if (this.trialbalancesAll) {
      this.trialbalancesAll.forEach(totals => {
        const debit = Number(totals.ledger.ledger_DEBIT);
        if (!isNaN(debit)) {
          total += debit;
        }
      });
    }
    return total;
  }

  add() {
    this.trialbalance = {
      trialbalance_ID: 0,
      trialbalance_CODE: null,
      trialbalance_NAME: null,
      ledger_ID: null,
      isactive: true
    };
  }

  ledgerAddNew() {
    this.addledger.add();
    $("#addledger").modal("show");
  }

  ledgerrefresh() {
    this.ledger.load(true);
    this.ledgerCancel();
  }

  ledgerCancel() {
    $("#addledger").modal("hide");
    $("#editledger").modal("hide");
    this.ledger.ledgers = this.addledger.ledgers;
  }

  onLedgerChange(ledger) {
    this.trialbalance.trialbalance_NAME = ledger.ledger_NAME;
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

  trialbalanceEdit() {
    this.disabled = false;
  }

  trialbalanceCancel() {
    this.disabled = true;
    if (this.trialbalance.trialbalance_ID == 0) {
      this.router.navigate(["/home/trialbalances"], {});
    }
  }

  onChange(trialbalanceID) {
    for (var i = 0; i < this.trialbalancesAll.length; i++) {
      if (this.trialbalancesAll[i].trialbalance_ID == trialbalanceID) {
        this.onTrialBalanceChange.next(this.trialbalancesAll[i]);
        break;
      }
    }
  }

  setTrialbalance(response) {
    this.ledgerID = response.ledger_ID;
    this.trialbalanceID = response.trialbalance_ID;

    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.trialbalance = response;
  }

  setTrialbalances(response) {
    this.cancel.next();
    return response;
  }

  trialbalanceGet() {
    this.trialbalanceservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.trialbalances = this.setTrialbalances(this.trialbalanceservice.getAllDetail(response));
          window.sessionStorage.setItem("trialbalances", JSON.stringify(this.trialbalances));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  trialbalanceGetAll() {
    this.trialbalanceservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.trialbalancesAll = this.setTrialbalances(this.trialbalanceservice.getAllDetail(response));
          window.sessionStorage.setItem("trialbalancesAll", JSON.stringify(this.trialbalancesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  trialbalanceGetOne(id) {
    this.disabled = true;
    this.trialbalanceservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setTrialbalance(this.trialbalanceservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  trialbalanceAdd(trialbalance) {
    trialbalance.ledger_ID = this.ledger.ledgerID;

    trialbalance.isactive = "Y";
    this.trialbalanceservice.add(trialbalance).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.trialbalance_ID) {
          this.toastrservice.success("Success", "New Trial Balance Added");
          this.setTrialbalance(this.trialbalanceservice.getDetail(response));
          this.refresh.next();
          this.disabled = true;
          this.trialbalanceGetAll();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  trialbalanceUpdate(trialbalance) {

    trialbalance.ledger_ID = this.ledger.ledgerID;

    if (trialbalance.isactive == true) {
      trialbalance.isactive = "Y";
    } else {
      trialbalance.isactive = "N";
    }
    this.trialbalanceservice.update(trialbalance, trialbalance.trialbalance_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.trialbalance_ID) {
          this.toastrservice.success("Success", "Trial Balance Updated");
          this.setTrialbalance(this.trialbalanceservice.getDetail(response));
          this.refresh.next();
          this.disabled = true;
          this.trialbalanceGetAll();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  trialbalanceUpdateAll(trialbalances) {
    this.trialbalanceservice.updateAll(trialbalances).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Trial Balances Updated");
          this.setTrialbalance(this.trialbalanceservice.getDetail(response));
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  trialbalanceSearch(str) {
    var search = {
      search: str
    }
    this.trialbalanceservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.trialbalances = this.setTrialbalances(this.trialbalanceservice.getAllDetail(response));
          window.sessionStorage.setItem("trialbalances", JSON.stringify(this.trialbalances));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  trialbalanceSearchAll(str) {
    var search = {
      search: str
    }
    this.trialbalanceservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.trialbalancesAll = this.setTrialbalances(this.trialbalanceservice.getAllDetail(response));
          window.sessionStorage.setItem("trialbalancesAll", JSON.stringify(this.trialbalancesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  trialbalanceAdvancedSearch(search) {
    this.ledgerID = search.ledger_ID;

    this.trialbalanceservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.trialbalances = this.setTrialbalances(this.trialbalanceservice.getAllDetail(response));
          window.sessionStorage.setItem("trialbalances", JSON.stringify(this.trialbalances));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  trialbalanceAdvancedSearchAll(search) {
    this.ledgerID = search.ledger_ID;

    this.trialbalanceservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.trialbalancesAll = this.setTrialbalances(this.trialbalanceservice.getAllDetail(response));
          window.sessionStorage.setItem("trialbalancesAll", JSON.stringify(this.trialbalancesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  TrialbalanceReport(trialbalances) {
    let col = ['Code', 'Date', 'Name', 'Debit', 'Credit'];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let title = "Trialbalance";

    let currentdate = new Date();
    let pdf = new jsPDF('l', 'pt', 'A4');
    var startrow = 20, startleft = 25;
    var totalDebit = this.getTotalDebit();
    var totalCredit = this.getTotalCredit();

    let row: any[] = []
    let rowD: any[] = []
    trialbalances.forEach(obj => {
      var code = obj.trialbalance_CODE;
      var transactiondate = obj.ledger_DETAIL;
      var name = obj.trialbalance_NAME;
      var debit = obj.ledger.ledger_DEBIT;
      var credit = obj.ledger.ledger_CREDIT;
      row.push(code);
      row.push(transactiondate);
      row.push(name);
      row.push(debit);
      row.push(credit);
      rowD.push(row);
      row = [];
    })

    var pageContent = function (data) {
      var pageHeight = pdf.internal.pageSize.height || pdf.internal.pageSize.getHeight();
      // HEADER
      var img = new Image();
      img.src = 'assets/images/mylogo.jpeg';
      img.style.width = '200px';
      img.style.height = '44px';
      pdf.addImage(img, startleft, startrow, 80, startrow + 20);
      pdf.setFontSize(12);
      pdf.text("Total Debit: " + totalDebit + "      Total Credit: " + totalCredit, startleft + 500, startrow + 30);
    };

    pdf.autoTable(col, rowD,
      {
        addPageContent: pageContent,
        margin: {
          top: startrow + 50,
          left: 20,
          bottom: startrow,
          down: startrow + 790
        },
        styles: {
          fontSize: 10,
          valign: 'middle',
          fontStyle: 'bold',
          halign: 'center',
          align: 'center'
        },
        pageBreak: 'always',
        columnStyles: {
          0: { columnWidth: 100, fontSize: 10 },
          1: { columnWidth: 150, fontSize: 10 },
          2: { columnWidth: 250, fontSize: 10, halign: 'left' },
          3: { columnWidth: 150, fontSize: 10 },
          4: { columnWidth: 150, fontSize: 10 },
        }
      });
    pdf.save(title + '.pdf');

    return pdf;
  }

  exportToPDF() {
    this.TrialbalanceReport(this.trialbalances); // Call the PDF export function with trialbalances data
  }

  emailPDF() { }

}
