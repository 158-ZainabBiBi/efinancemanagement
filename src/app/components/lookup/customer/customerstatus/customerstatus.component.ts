
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-customerstatus',
  templateUrl: './customerstatus.component.html',
  styleUrls: ['./customerstatus.component.css']
})
export class CustomerstatusComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  customerstatusID = null;

  customerstatuses = [];
  customerstatusesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.customerstatuses = JSON.parse(window.sessionStorage.getItem('customerstatuses'));
    this.customerstatusesAll = JSON.parse(window.sessionStorage.getItem('customerstatusesAll'));
    if (this.disabled == false && this.customerstatuses == null) {
      this.customerstatusGet();
    } else if (this.disabled == true && this.customerstatusesAll == null) {
      this.customerstatusGetAll();
    }
  }

  setCustomerstatuses(response) {
    if (this.disabled == false) {
      this.customerstatuses = response;
      window.sessionStorage.setItem("customerstatuses", JSON.stringify(this.customerstatuses));
    } else {
      this.customerstatusesAll = response;
      window.sessionStorage.setItem("customerstatusesAll", JSON.stringify(this.customerstatusesAll));
    }
  }

  customerstatusGet(){
    this.lookupservice.lookup("CUSTOMERSTATUS").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setCustomerstatuses(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  customerstatusGetAll(){
    this.lookupservice.lookupAll("CUSTOMERSTATUS").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setCustomerstatuses(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}