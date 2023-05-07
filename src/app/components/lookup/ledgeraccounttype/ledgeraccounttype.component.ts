import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-ledgeraccounttype',
  templateUrl: './ledgeraccounttype.component.html',
  styleUrls: ['./ledgeraccounttype.component.css']
})
export class LedgeraccounttypeComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  ledgeraccounttypeID = null;

  ledgeraccounttypes = [];
  ledgeraccounttypesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.ledgeraccounttypes = JSON.parse(window.sessionStorage.getItem('ledgeraccounttypes'));
    this.ledgeraccounttypesAll = JSON.parse(window.sessionStorage.getItem('ledgeraccounttypesAll'));

    if (this.ledgeraccounttypes == null) {
      this.ledgeraccounttypeGet();
    }

    if (this.ledgeraccounttypesAll == null) {
      this.ledgeraccounttypeGetAll();
    }
  }

  ledgeraccounttypeGet() {
    this.lookupservice.lookup("LEDGERACCOUNTTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.ledgeraccounttypes = response;
          window.sessionStorage.setItem("ledgeraccounttypes", JSON.stringify(this.ledgeraccounttypes));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgeraccounttypeGetAll() {
    this.lookupservice.lookupAll("LEDGERACCOUNTTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.ledgeraccounttypesAll = response;
          window.sessionStorage.setItem("ledgeraccounttypesAll", JSON.stringify(this.ledgeraccounttypesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
