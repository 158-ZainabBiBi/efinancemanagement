
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-customercategory',
  templateUrl: './customercategory.component.html',
  styleUrls: ['./customercategory.component.css']
})
export class CustomercategoryComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  customercategoryID = null;

  customercategories = [];
  customercategoriesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.customercategories = JSON.parse(window.sessionStorage.getItem('customercategories'));
    this.customercategoriesAll = JSON.parse(window.sessionStorage.getItem('customercategoriesAll'));
    if (this.disabled == false && this.customercategories == null) {
      this.customercategoryGet();
    } else if (this.disabled == true && this.customercategoriesAll == null) {
      this.customercategoryGetAll();
    }
  }

  setCustomercategories(response) {
    if (this.disabled == false) {
      this.customercategories = response;
      window.sessionStorage.setItem("customercategories", JSON.stringify(this.customercategories));
    } else {
      this.customercategoriesAll = response;
      window.sessionStorage.setItem("customercategoriesAll", JSON.stringify(this.customercategoriesAll));
    }
  }

  customercategoryGet(){
    this.lookupservice.lookup("CUSTOMERCATEGORY").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setCustomercategories(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  customercategoryGetAll(){
    this.lookupservice.lookupAll("CUSTOMERCATEGORY").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setCustomercategories(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}