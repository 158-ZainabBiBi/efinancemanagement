
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-creditterms',
  templateUrl: './creditterms.component.html',
  styleUrls: ['./creditterms.component.css']
})
export class CredittermsComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  credittermsID = null;

  credittermses = [];
  credittermsesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.credittermses = JSON.parse(window.sessionStorage.getItem('credittermses'));
    this.credittermsesAll = JSON.parse(window.sessionStorage.getItem('credittermsesAll'));
    if (this.disabled == false && this.credittermses == null) {
      this.credittermsGet();
    } else if (this.disabled == true && this.credittermsesAll == null) {
      this.credittermsGetAll();
    }
  }

  setCredittermses(response) {
    if (this.disabled == false) {
      this.credittermses = response;
      window.sessionStorage.setItem("credittermses", JSON.stringify(this.credittermses));
    } else {
      this.credittermsesAll = response;
      window.sessionStorage.setItem("credittermsesAll", JSON.stringify(this.credittermsesAll));
    }
  }

  credittermsGet(){
    this.lookupservice.lookup("CREDITTERMS").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setCredittermses(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  credittermsGetAll(){
    this.lookupservice.lookupAll("CREDITTERMS").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setCredittermses(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}