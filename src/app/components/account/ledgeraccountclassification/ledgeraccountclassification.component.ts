import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { LedgeraccountclassificationService } from './ledgeraccountclassification.service';
import { LedgeraccounttypeComponent } from '../../lookup/ledgeraccounttype/ledgeraccounttype.component';

@Component({
  selector: 'app-ledgeraccountclassification',
  templateUrl: './ledgeraccountclassification.component.html',
  styleUrls: ['./ledgeraccountclassification.component.css']
})
export class LedgeraccountclassificationComponent implements OnInit {
  @ViewChild("ledgeraccounttype") ledgeraccounttype: LedgeraccounttypeComponent;

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
  ledgeraccountclassificationID = null;
  @Input()
  ledgeraccounttypeID = null;
  @Input()
  ledgeraccounttypeCode = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onLedgerAccountClassificationChange = new EventEmitter();

  ledgeraccountclassifications = [];
  ledgeraccountclassificationsAll = [
    { ledgeraccountclassification_ID: 1, ledgeraccountclassification_CODE: '001', ledgeraccountclassification_NAME: 'Account 1', ledgeraccounttype: { description: 'Type 1' }, ledgeraccountclassification_DESC: 'Description 1', isactive: true },
    { ledgeraccountclassification_ID: 2, ledgeraccountclassification_CODE: '002', ledgeraccountclassification_NAME: 'Account 2', ledgeraccounttype: { description: 'Type 2' }, ledgeraccountclassification_DESC: 'Description 2', isactive: true },
    { ledgeraccountclassification_ID: 3, ledgeraccountclassification_CODE: '003', ledgeraccountclassification_NAME: 'Account 3', ledgeraccounttype: { description: 'Type 3' }, ledgeraccountclassification_DESC: 'Description 3', isactive: false },
    { ledgeraccountclassification_ID: 4, ledgeraccountclassification_CODE: '004', ledgeraccountclassification_NAME: 'Account 4', ledgeraccounttype: { description: 'Type 4' }, ledgeraccountclassification_DESC: 'Description 4', isactive: true },
    { ledgeraccountclassification_ID: 5, ledgeraccountclassification_CODE: '005', ledgeraccountclassification_NAME: 'Account 5', ledgeraccounttype: { description: 'Type 5' }, ledgeraccountclassification_DESC: 'Description 5', isactive: false },
  ];
  ledgeraccountclassification = {
    ledgeraccountclassification_ID: 0,
    ledgeraccounttype_ID: null,

    ledgeraccountclassification_CODE: null,
    ledgeraccountclassification_NAME: null,
    ledgeraccountclassification_DESC: null,

    isactive: true,
  }

  constructor(
    private ledgeraccountclassificationservice: LedgeraccountclassificationService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload) {
    if (window.sessionStorage.getItem('ledgeraccountclassifications') != null) {
      this.ledgeraccountclassifications = JSON.parse(window.sessionStorage.getItem('ledgeraccountclassifications'));
    }
    if (window.sessionStorage.getItem('ledgeraccountclassificationsAll') != null) {
      this.ledgeraccountclassificationsAll = JSON.parse(window.sessionStorage.getItem('ledgeraccountclassificationsAll'));
    }
    if (this.ledgeraccountclassificationID != 0 && !this.ledgeraccountclassificationID && Number(window.sessionStorage.getItem('ledgeraccountclassification')) > 0) {
      this.ledgeraccountclassificationID = Number(window.sessionStorage.getItem('ledgeraccountclassification'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.ledgeraccountclassifications == null || this.ledgeraccountclassifications.length == 0 || reload == true)) {
      this.ledgeraccountclassifications == null;
      this.ledgeraccountclassificationGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.ledgeraccountclassificationsAll == null || this.ledgeraccountclassificationsAll.length == 0 || reload == true)) {
      this.ledgeraccountclassificationsAll == null;
      this.ledgeraccountclassificationGetAll();
    }

    var search = {
      ledgeraccounttype_ID: this.ledgeraccounttypeID,
      ledgeraccounttype_CODE: this.ledgeraccounttypeCode
    }

    if (this.view >= 5 && this.view <= 6 && this.ledgeraccountclassificationID) {
      window.sessionStorage.setItem("ledgeraccountclassification", this.ledgeraccountclassificationID);
      this.ledgeraccountclassificationGetOne(this.ledgeraccountclassificationID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.ledgeraccountclassifications == null || this.ledgeraccountclassifications.length == 0 || reload == true)) {
      this.ledgeraccountclassifications == null;
      this.ledgeraccountclassificationAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.ledgeraccountclassificationsAll == null || this.ledgeraccountclassificationsAll.length == 0 || reload == true)) {
      this.ledgeraccountclassificationsAll == null;
      this.ledgeraccountclassificationAdvancedSearchAll(search);
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
    this.ledgeraccountclassification = {
      ledgeraccountclassification_ID: 0,
      ledgeraccounttype_ID: null,

      ledgeraccountclassification_CODE: null,
      ledgeraccountclassification_NAME: null,
      ledgeraccountclassification_DESC: null,

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

  ledgeraccountclassificationEdit() {
    this.disabled = false;
  }

  ledgeraccountclassificationCancel() {
    this.disabled = true;
    if (this.ledgeraccountclassification.ledgeraccountclassification_ID == 0) {
      this.router.navigate(["/home/ledgeraccountclassifications "], {});
    }
  }

  onChange(ledgeraccountclassificationID) {
    for (var i = 0; i < this.ledgeraccountclassificationsAll.length; i++) {
      if (this.ledgeraccountclassificationsAll[i].ledgeraccountclassification_ID == ledgeraccountclassificationID) {
        this.onLedgerAccountClassificationChange.next(this.ledgeraccountclassificationsAll[i]);
        break;
      }
    }
  }

  setLedgeraccountclassification(response) {
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.ledgeraccountclassification = response;
  }

  setLedgeraccountclassifications(response) {
    this.cancel.next();
    return response;
  }

  ledgeraccountclassificationGet() {
    this.ledgeraccountclassificationservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.ledgeraccountclassifications = this.setLedgeraccountclassifications(this.ledgeraccountclassificationservice.getAllDetail(response));
          window.sessionStorage.setItem("ledgeraccountclassifications", JSON.stringify(this.ledgeraccountclassifications));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgeraccountclassificationGetAll() {
    this.ledgeraccountclassificationservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.ledgeraccountclassificationsAll = this.setLedgeraccountclassifications(this.ledgeraccountclassificationservice.getAllDetail(response));
          window.sessionStorage.setItem("ledgeraccountclassificationsAll", JSON.stringify(this.ledgeraccountclassificationsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgeraccountclassificationGetOne(id) {
    this.disabled = true;
    this.ledgeraccountclassificationservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setLedgeraccountclassification(this.ledgeraccountclassificationservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgeraccountclassificationAdd(ledgeraccountclassification) {
    ledgeraccountclassification.isactive = "Y";
    ledgeraccountclassification.ledgeraccounttype_ID = this.ledgeraccounttype.ledgeraccounttypeID;

    this.ledgeraccountclassificationservice.add(ledgeraccountclassification).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.ledgeraccountclassification_ID) {
          this.toastrservice.success("Success", "New Ledger Account Classification Added");
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

  ledgeraccountclassificationUpdate(ledgeraccountclassification) {

    ledgeraccountclassification.ledgeraccounttype_ID = this.ledgeraccounttype.ledgeraccounttypeID;

    if (ledgeraccountclassification.isactive == true) {
      ledgeraccountclassification.isactive = "Y";
    } else {
      ledgeraccountclassification.isactive = "N";
    }
    this.ledgeraccountclassificationservice.update(ledgeraccountclassification, ledgeraccountclassification.ledgeraccountclassification_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.ledgeraccountclassification_ID) {
          this.toastrservice.success("Success", "Ledger Account Classification Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgeraccountclassificationUpdateAll(ledgeraccountclassifications) {
    this.ledgeraccountclassificationservice.updateAll(ledgeraccountclassifications).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Ledger Account Classifications Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgeraccountclassificationSearch(str) {
    var search = {
      search: str
    }
    this.ledgeraccountclassificationservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.ledgeraccountclassifications = this.setLedgeraccountclassifications(this.ledgeraccountclassificationservice.getAllDetail(response));
          window.sessionStorage.setItem("ledgeraccountclassifications", JSON.stringify(this.ledgeraccountclassifications));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgeraccountclassificationSearchAll(str) {
    var search = {
      search: str
    }
    this.ledgeraccountclassificationservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.ledgeraccountclassificationsAll = this.setLedgeraccountclassifications(this.ledgeraccountclassificationservice.getAllDetail(response));
          window.sessionStorage.setItem("ledgeraccountclassificationsAll", JSON.stringify(this.ledgeraccountclassificationsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgeraccountclassificationAdvancedSearch(search) {
    this.ledgeraccounttypeID = search.ledgeraccounttype_ID;
    this.ledgeraccounttypeCode = search.ledgeraccounttype_CODE;

    this.ledgeraccountclassificationservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.ledgeraccountclassifications = this.setLedgeraccountclassifications(this.ledgeraccountclassificationservice.getAllDetail(response));
          window.sessionStorage.setItem("ledgeraccountclassifications", JSON.stringify(this.ledgeraccountclassifications));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgeraccountclassificationAdvancedSearchAll(search) {
    this.ledgeraccounttypeID = search.ledgeraccounttype_ID;
    this.ledgeraccounttypeCode = search.ledgeraccounttype_CODE;

    this.ledgeraccountclassificationservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.ledgeraccountclassificationsAll = this.setLedgeraccountclassifications(this.ledgeraccountclassificationservice.getAllDetail(response));
          window.sessionStorage.setItem("ledgeraccountclassificationsAll", JSON.stringify(this.ledgeraccountclassificationsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
