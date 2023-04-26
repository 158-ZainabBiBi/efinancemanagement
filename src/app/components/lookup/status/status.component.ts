import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  statusID = null;

  statuses = [];
  statusesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.statuses = JSON.parse(window.sessionStorage.getItem('statuses'));
    this.statusesAll = JSON.parse(window.sessionStorage.getItem('statusesAll'));
    if (this.disabled == false && this.statuses == null) {
      this.statusGet();
    } else if (this.disabled == true && this.statusesAll == null) {
      this.statusGetAll();
    }
  }

  setStatuses(response) {
      this.statuses = response;
      window.sessionStorage.setItem("statuses", JSON.stringify(this.statuses));
    
      this.statusesAll = response;
      window.sessionStorage.setItem("statusesAll", JSON.stringify(this.statusesAll));
    }

  statusGet(){
    this.lookupservice.lookup("PAYMENTSTATUS").subscribe(response => {
      if (response) {
        if (response.error && response.tutortype) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setStatuses(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  statusGetAll(){
    this.lookupservice.lookupAll("PAYMENTSTATUS").subscribe(response => {
      if (response) {
        if (response.error && response.tutortype) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setStatuses(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
