
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-businessmarketniche',
  templateUrl: './businessmarketniche.component.html',
  styleUrls: ['./businessmarketniche.component.css']
})
export class BusinessmarketnicheComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  businessmarketnicheID = null;

  businessmarketniches = [];
  businessmarketnichesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.businessmarketniches = JSON.parse(window.sessionStorage.getItem('businessmarketniches'));
    this.businessmarketnichesAll = JSON.parse(window.sessionStorage.getItem('businessmarketnichesAll'));
    if (this.disabled == false && this.businessmarketniches == null) {
      this.businessmarketnicheGet();
    } else if (this.disabled == true && this.businessmarketnichesAll == null) {
      this.businessmarketnicheGetAll();
    }
  }

  setBusinessmarketniches(response) {
    if (this.disabled == false) {
      this.businessmarketniches = response;
      window.sessionStorage.setItem("businessmarketniches", JSON.stringify(this.businessmarketniches));
    } else {
      this.businessmarketnichesAll = response;
      window.sessionStorage.setItem("businessmarketnichesAll", JSON.stringify(this.businessmarketnichesAll));
    }
  }

  businessmarketnicheGet(){
    this.lookupservice.lookup("BUSINESSMARKETNICHE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setBusinessmarketniches(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  businessmarketnicheGetAll(){
    this.lookupservice.lookupAll("BUSINESSMARKETNICHE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setBusinessmarketniches(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}