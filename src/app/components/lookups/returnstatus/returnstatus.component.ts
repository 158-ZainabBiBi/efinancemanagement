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

  returnstatuss = [];
  returnstatussAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.returnstatuss = JSON.parse(window.sessionStorage.getItem('returnstatuss'));
    this.returnstatussAll = JSON.parse(window.sessionStorage.getItem('returnstatussAll'));
    if (this.disabled == false && this.returnstatuss == null) {
      this.returnstatusGet();
    } else if (this.disabled == true && this.returnstatussAll == null) {
      this.returnstatusGetAll();
    }
  }

  setReturnstatuss(response) {
    if (this.disabled == false) {
      this.returnstatuss = response;
      window.sessionStorage.setItem("returnstatuss", JSON.stringify(this.returnstatuss));
    } else {
      this.returnstatussAll = response;
      window.sessionStorage.setItem("returnstatussAll", JSON.stringify(this.returnstatussAll));
    }
  }

  returnstatusGet(){
    this.lookupservice.lookup("RETURNSTATUS").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setReturnstatuss(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  returnstatusGetAll(){
    this.lookupservice.lookupAll("RETURNSTATUS").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setReturnstatuss(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
