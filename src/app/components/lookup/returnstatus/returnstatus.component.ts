import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { OnFailService } from '../../../services/on-fail.service';
import { LookupService } from '../../../services/lookup.service';

@Component({
  selector: 'app-returnstatus',
  templateUrl: './returnstatus.component.html',
  styleUrls: ['./returnstatus.component.css']
})
export class ReturnstatusComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  returnstatusID = null;

  returnstatuses = [];
  returnstatusesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.returnstatuses = JSON.parse(window.sessionStorage.getItem('returnstatuses'));
    this.returnstatusesAll = JSON.parse(window.sessionStorage.getItem('returnstatusesAll'));
    if (this.disabled == false && this.returnstatuses == null) {
      this.returnstatusGet();
    } else if (this.disabled == true && this.returnstatusesAll == null) {
      this.returnstatusGetAll();
    }
  }

  setReturnstatuss(response) {
    this.returnstatuses = response;
    window.sessionStorage.setItem("returnstatuses", JSON.stringify(this.returnstatuses));

    this.returnstatusesAll = response;
    window.sessionStorage.setItem("returnstatusesAll", JSON.stringify(this.returnstatusesAll));
  }

  returnstatusGet() {
    this.lookupservice.lookup("RETURNSTATUS").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setReturnstatuss(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  returnstatusGetAll() {
    this.lookupservice.lookupAll("RETURNSTATUS").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setReturnstatuss(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
