import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-transactiontype',
  templateUrl: './transactiontype.component.html',
  styleUrls: ['./transactiontype.component.css']
})
export class TransactiontypeComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  transactiontypeID = null;

  transactiontypes = [];
  transactiontypesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.transactiontypes = JSON.parse(window.sessionStorage.getItem('transactiontypes'));
    this.transactiontypesAll = JSON.parse(window.sessionStorage.getItem('transactiontypesAll'));
    if (this.disabled == false && this.transactiontypes == null) {
      this.transactiontypeGet();
    } else if (this.disabled == true && this.transactiontypesAll == null) {
      this.transactiontypeGetAll();
    }
  }

  setTransactiontypes(response) {
    this.transactiontypes = response;
    window.sessionStorage.setItem("transactiontypes", JSON.stringify(this.transactiontypes));

    this.transactiontypesAll = response;
    window.sessionStorage.setItem("transactiontypesAll", JSON.stringify(this.transactiontypesAll));
  }

  transactiontypeGet() {
    this.lookupservice.lookup("WEEKDAY").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setTransactiontypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  transactiontypeGetAll() {
    this.lookupservice.lookupAll("WEEKDAY").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setTransactiontypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}