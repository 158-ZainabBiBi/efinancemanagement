import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

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

    if (this.accounttypes == null) {
      this.accounttypeGet();
    }

    if (this.accounttypesAll == null) {
      this.accounttypeGetAll();
    }
  }

  accounttypeGet() {
    this.lookupservice.lookup("ACCOUNTTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.accounttypes = response;
          window.sessionStorage.setItem("accounttypes", JSON.stringify(this.accounttypes));
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
          this.accounttypesAll = response;
          window.sessionStorage.setItem("accounttypesAll", JSON.stringify(this.accounttypesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
