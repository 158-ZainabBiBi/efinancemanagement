
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-businesstype',
  templateUrl: './businesstype.component.html',
  styleUrls: ['./businesstype.component.css']
})
export class BusinesstypeComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  businesstypeID = null;

  businesstypes = [];
  businesstypesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.businesstypes = JSON.parse(window.sessionStorage.getItem('businesstypes'));
    this.businesstypesAll = JSON.parse(window.sessionStorage.getItem('businesstypesAll'));
    if (this.disabled == false && this.businesstypes == null) {
      this.businesstypeGet();
    } else if (this.disabled == true && this.businesstypesAll == null) {
      this.businesstypeGetAll();
    }
  }

  setBusinesstypes(response) {
    if (this.disabled == false) {
      this.businesstypes = response;
      window.sessionStorage.setItem("businesstypes", JSON.stringify(this.businesstypes));
    } else {
      this.businesstypesAll = response;
      window.sessionStorage.setItem("businesstypesAll", JSON.stringify(this.businesstypesAll));
    }
  }

  businesstypeGet(){
    this.lookupservice.lookup("BUSINESSTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setBusinesstypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  businesstypeGetAll(){
    this.lookupservice.lookupAll("BUSINESSTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setBusinesstypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}