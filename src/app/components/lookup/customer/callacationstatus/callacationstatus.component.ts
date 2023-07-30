
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-callacationstatus',
  templateUrl: './callacationstatus.component.html',
  styleUrls: ['./callacationstatus.component.css']
})
export class CallacationstatusComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  callacationstatusID = null;

  callacationstatuses = [];
  callacationstatusesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.callacationstatuses = JSON.parse(window.sessionStorage.getItem('callacationstatuses'));
    this.callacationstatusesAll = JSON.parse(window.sessionStorage.getItem('callacationstatusesAll'));
    if (this.disabled == false && this.callacationstatuses == null) {
      this.callacationstatusGet();
    } else if (this.disabled == true && this.callacationstatusesAll == null) {
      this.callacationstatusGetAll();
    }
  }

  setCallacationstatuses(response) {
    if (this.disabled == false) {
      this.callacationstatuses = response;
      window.sessionStorage.setItem("callacationstatuses", JSON.stringify(this.callacationstatuses));
    } else {
      this.callacationstatusesAll = response;
      window.sessionStorage.setItem("callacationstatusesAll", JSON.stringify(this.callacationstatusesAll));
    }
  }

  callacationstatusGet() {
    this.lookupservice.lookup("CALLACATIONSTATUS").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setCallacationstatuses(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  callacationstatusGetAll() {
    this.lookupservice.lookupAll("CALLACATIONSTATUS").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setCallacationstatuses(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}