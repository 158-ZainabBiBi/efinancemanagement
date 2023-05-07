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

    if (this.transactiontypes == null) {
      this.transactiontypeGet();
    }

    if (this.transactiontypesAll == null) {
      this.transactiontypeGetAll();
    }
  }

  transactiontypeGet() {
    this.lookupservice.lookup("TRANSACTIONTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.transactiontypes = response;
          window.sessionStorage.setItem("transactiontypes", JSON.stringify(this.transactiontypes));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  transactiontypeGetAll() {
    this.lookupservice.lookupAll("TRANSACTIONTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.transactiontypesAll = response;
          window.sessionStorage.setItem("transactiontypesAll", JSON.stringify(this.transactiontypesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
