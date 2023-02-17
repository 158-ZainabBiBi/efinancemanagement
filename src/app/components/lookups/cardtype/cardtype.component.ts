import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { OnFailService } from '../../../services/on-fail.service';
import { LookupService } from '../../../services/lookup.service';

@Component({
  selector: 'app-cardtype',
  templateUrl: './cardtype.component.html',
  styleUrls: ['./cardtype.component.css']
})
export class CardtypeComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  cardtypeID = null;

  cardtypes = [];
  cardtypesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.cardtypes = JSON.parse(window.sessionStorage.getItem('cardtypes'));
    this.cardtypesAll = JSON.parse(window.sessionStorage.getItem('cardtypesAll'));
    if (this.disabled == false && this.cardtypes == null) {
      this.cardtypeGet();
    } else if (this.disabled == true && this.cardtypesAll == null) {
      this.cardtypeGetAll();
    }
  }

  setCardtypes(response) {
    if (this.disabled == false) {
      this.cardtypes = response;
      window.sessionStorage.setItem("cardtypes", JSON.stringify(this.cardtypes));
    } else {
      this.cardtypesAll = response;
      window.sessionStorage.setItem("cardtypesAll", JSON.stringify(this.cardtypesAll));
    }
  }

  cardtypeGet(){
    this.lookupservice.lookup("CARDTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setCardtypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  cardtypeGetAll(){
    this.lookupservice.lookupAll("CARDTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setCardtypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
