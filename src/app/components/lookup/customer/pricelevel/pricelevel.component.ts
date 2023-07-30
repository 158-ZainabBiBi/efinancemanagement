import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-pricelevel',
  templateUrl: './pricelevel.component.html',
  styleUrls: ['./pricelevel.component.css']
})
export class PricelevelComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  pricelevelID = null;

  pricelevels = [];
  pricelevelsAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.pricelevels = JSON.parse(window.sessionStorage.getItem('pricelevels'));
    this.pricelevelsAll = JSON.parse(window.sessionStorage.getItem('pricelevelsAll'));
    if (this.disabled == false && this.pricelevels == null) {
      this.pricelevelGet();
    } else if (this.disabled == true && this.pricelevelsAll == null) {
      this.pricelevelGetAll();
    }
  }

  setPricelevels(response) {
      this.pricelevels = response;
      window.sessionStorage.setItem("pricelevels", JSON.stringify(this.pricelevels));
 
      this.pricelevelsAll = response;
      window.sessionStorage.setItem("pricelevelsAll", JSON.stringify(this.pricelevelsAll));
    }

  pricelevelGet(){
    this.lookupservice.lookup("PRICELEVEL").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setPricelevels(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  pricelevelGetAll(){
    this.lookupservice.lookupAll("PRICELEVEL").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setPricelevels(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}