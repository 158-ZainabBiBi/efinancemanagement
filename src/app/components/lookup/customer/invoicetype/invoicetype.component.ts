import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-invoicetype',
  templateUrl: './invoicetype.component.html',
  styleUrls: ['./invoicetype.component.css']
})
export class InvoicetypeComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  invoicetypeID = null;

  invoicetypes = [];
  invoicetypesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.invoicetypes = JSON.parse(window.sessionStorage.getItem('invoicetypes'));
    this.invoicetypesAll = JSON.parse(window.sessionStorage.getItem('invoicetypesAll'));
    if (this.disabled == false && this.invoicetypes == null) {
      this.invoicetypeGet();
    } else if (this.disabled == true && this.invoicetypesAll == null) {
      this.invoicetypeGetAll();
    }
  }

  setInvoicetypes(response) {
      this.invoicetypes = response;
      window.sessionStorage.setItem("invoicetypes", JSON.stringify(this.invoicetypes));
    
      this.invoicetypesAll = response;
      window.sessionStorage.setItem("invoicetypesAll", JSON.stringify(this.invoicetypesAll));
    }

  invoicetypeGet(){
    this.lookupservice.lookup("INVOICETYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setInvoicetypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  invoicetypeGetAll(){
    this.lookupservice.lookupAll("INVOICETYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setInvoicetypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}