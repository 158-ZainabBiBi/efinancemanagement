import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-saleordertype',
  templateUrl: './saleordertype.component.html',
  styleUrls: ['./saleordertype.component.css']
})
export class SaleordertypeComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  saleordertypeID = null;

  saleordertypes = [];
  saleordertypesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.saleordertypes = JSON.parse(window.sessionStorage.getItem('saleordertypes'));
    this.saleordertypesAll = JSON.parse(window.sessionStorage.getItem('saleordertypesAll'));
    if (this.disabled == false && this.saleordertypes == null) {
      this.saleordertypeGet();
    } else if (this.disabled == true && this.saleordertypesAll == null) {
      this.saleordertypeGetAll();
    }
  }

  setSaleordertypes(response) {
    this.saleordertypes = response;
    window.sessionStorage.setItem("saleordertypes", JSON.stringify(this.saleordertypes));

    this.saleordertypesAll = response;
    window.sessionStorage.setItem("saleordertypesAll", JSON.stringify(this.saleordertypesAll));
  }

  saleordertypeGet() {
    this.lookupservice.lookup("SALEORDERTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setSaleordertypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  saleordertypeGetAll() {
    this.lookupservice.lookupAll("SALEORDERTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setSaleordertypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
