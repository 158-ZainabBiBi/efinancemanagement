import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-cashflowratetype',
  templateUrl: './cashflowratetype.component.html',
  styleUrls: ['./cashflowratetype.component.css']
})
export class CashflowratetypeComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  cashflowratetypeID = null;

  cashflowratetypes = [];
  cashflowratetypesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.cashflowratetypes = JSON.parse(window.sessionStorage.getItem('cashflowratetypes'));
    this.cashflowratetypesAll = JSON.parse(window.sessionStorage.getItem('cashflowratetypesAll'));
    if (this.disabled == false && this.cashflowratetypes == null) {
      this.cashflowratetypeGet();
    } else if (this.disabled == true && this.cashflowratetypesAll == null) {
      this.cashflowratetypeGetAll();
    }
  }

  setCashflowratetypes(response) {
    this.cashflowratetypes = response;
    window.sessionStorage.setItem("cashflowratetypes", JSON.stringify(this.cashflowratetypes));

    this.cashflowratetypesAll = response;
    window.sessionStorage.setItem("cashflowratetypesAll", JSON.stringify(this.cashflowratetypesAll));
  }

  cashflowratetypeGet() {
    this.lookupservice.lookup("CASHFLOWRATETYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setCashflowratetypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  cashflowratetypeGetAll() {
    this.lookupservice.lookupAll("CASHFLOWRATETYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setCashflowratetypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
