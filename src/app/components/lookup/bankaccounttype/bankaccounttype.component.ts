import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-bankaccounttype',
  templateUrl: './bankaccounttype.component.html',
  styleUrls: ['./bankaccounttype.component.css']
})
export class BankaccounttypeComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  bankaccounttypeID = null;

  bankaccounttypes = [];
  bankaccounttypesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.bankaccounttypes = JSON.parse(window.sessionStorage.getItem('bankaccounttypes'));
    this.bankaccounttypesAll = JSON.parse(window.sessionStorage.getItem('bankaccounttypesAll'));
    if (this.disabled == false && this.bankaccounttypes == null) {
      this.bankaccounttypeGet();
    } else if (this.disabled == true && this.bankaccounttypesAll == null) {
      this.bankaccounttypeGetAll();
    }
  }

  setBankaccounttypes(response) {
    this.bankaccounttypes = response;
    window.sessionStorage.setItem("bankaccounttypes", JSON.stringify(this.bankaccounttypes));

    this.bankaccounttypesAll = response;
    window.sessionStorage.setItem("bankaccounttypesAll", JSON.stringify(this.bankaccounttypesAll));
  }

  bankaccounttypeGet() {
    this.lookupservice.lookup("BANKACCOUNTTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setBankaccounttypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  bankaccounttypeGetAll() {
    this.lookupservice.lookupAll("BANKACCOUNTTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setBankaccounttypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
