import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { OnFailService } from '../../../services/on-fail.service';
import { LookupService } from '../../../services/lookup.service';

@Component({
  selector: 'app-currencysymbolreplacement',
  templateUrl: './currencysymbolreplacement.component.html',
  styleUrls: ['./currencysymbolreplacement.component.css']
})
export class CurrencysymbolreplacementComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  currencysymbolreplacementID = null;

  currencysymbolreplacements = [];
  currencysymbolreplacementsAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.currencysymbolreplacements = JSON.parse(window.sessionStorage.getItem('currencysymbolreplacements'));
    this.currencysymbolreplacementsAll = JSON.parse(window.sessionStorage.getItem('currencysymbolreplacementsAll'));
    if (this.disabled == false && this.currencysymbolreplacements == null) {
      this.currencysymbolreplacementGet();
    } else if (this.disabled == true && this.currencysymbolreplacementsAll == null) {
      this.currencysymbolreplacementGetAll();
    }
  }

  setCurrencysymbolreplacements(response) {
    this.currencysymbolreplacements = response;
    window.sessionStorage.setItem("currencysymbolreplacements", JSON.stringify(this.currencysymbolreplacements));

    this.currencysymbolreplacementsAll = response;
    window.sessionStorage.setItem("currencysymbolreplacementsAll", JSON.stringify(this.currencysymbolreplacementsAll));
  }

  currencysymbolreplacementGet() {
    this.lookupservice.lookup("CURRENCYSYMBOLREPLACEMENT").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setCurrencysymbolreplacements(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  currencysymbolreplacementGetAll() {
    this.lookupservice.lookupAll("CURRENCYSYMBOLREPLACEMENT").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setCurrencysymbolreplacements(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
