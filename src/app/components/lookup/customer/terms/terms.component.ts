import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css']
})
export class TermsComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  termsID = null;

  termses = [];
  termsesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.termses = JSON.parse(window.sessionStorage.getItem('termses'));
    this.termsesAll = JSON.parse(window.sessionStorage.getItem('termsesAll'));
    if (this.disabled == false && this.termses == null) {
      this.termsGet();
    } else if (this.disabled == true && this.termsesAll == null) {
      this.termsGetAll();
    }
  }

  setTermss(response) {
      this.termses = response;
      window.sessionStorage.setItem("termses", JSON.stringify(this.termses));
  
      this.termsesAll = response;
      window.sessionStorage.setItem("termsesAll", JSON.stringify(this.termsesAll));
    }

  termsGet(){
    this.lookupservice.lookup("TERMS").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setTermss(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  termsGetAll(){
    this.lookupservice.lookupAll("TERMS").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setTermss(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}