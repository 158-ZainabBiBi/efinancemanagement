import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { OnFailService } from 'src/app/services/on-fail.service';
import { LookupService } from 'src/app/services/lookup.service';

@Component({
  selector: 'app-hold',
  templateUrl: './hold.component.html',
  styleUrls: ['./hold.component.css']
})
export class HoldComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  holdID = null;

  holds = [];
  holdsAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.holds = JSON.parse(window.sessionStorage.getItem('holds'));
    this.holdsAll = JSON.parse(window.sessionStorage.getItem('holdsAll'));

    if (this.holds == null) {
      this.holdGet();
    } 
    
    if (this.holdsAll == null) {
      this.holdGetAll();
    }
  }

  holdGet(){
    this.lookupservice.lookup("HOLD").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.holds = response;
          window.sessionStorage.setItem("holds", JSON.stringify(this.holds));
            }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  holdGetAll(){
    this.lookupservice.lookupAll("HOLD").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.holdsAll = response;
          window.sessionStorage.setItem("holdsAll", JSON.stringify(this.holdsAll));
            }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}