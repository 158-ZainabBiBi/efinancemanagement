import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { OnFailService } from '../../../services/on-fail.service';
import { LookupService } from '../../../services/lookup.service';

@Component({
  selector: 'app-accounttype',
  templateUrl: './accounttype.component.html',
  styleUrls: ['./accounttype.component.css']
})
export class AccounttypeComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  accounttypeID = null;

  accounttypes = [];
  accounttypesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.accounttypes = JSON.parse(window.sessionStorage.getItem('accounttypes'));
    this.accounttypesAll = JSON.parse(window.sessionStorage.getItem('accounttypesAll'));
    if (this.disabled == false && this.accounttypes == null) {
      this.accounttypeGet();
    } else if (this.disabled == true && this.accounttypesAll == null) {
      this.accounttypeGetAll();
    }
  }

  setAccounttypes(response) {
    this.accounttypes = response;
    window.sessionStorage.setItem("accounttypes", JSON.stringify(this.accounttypes));

    this.accounttypesAll = response;
    window.sessionStorage.setItem("accounttypesAll", JSON.stringify(this.accounttypesAll));
  }

  accounttypeGet() {
    this.lookupservice.lookup("ACCOUNTTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setAccounttypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  accounttypeGetAll() {
    this.lookupservice.lookupAll("ACCOUNTTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setAccounttypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
