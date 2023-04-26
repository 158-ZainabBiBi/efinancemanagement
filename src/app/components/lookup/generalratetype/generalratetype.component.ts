import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-generalratetype',
  templateUrl: './generalratetype.component.html',
  styleUrls: ['./generalratetype.component.css']
})
export class GeneralratetypeComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  generalratetypeID = null;

  generalratetypes = [];
  generalratetypesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.generalratetypes = JSON.parse(window.sessionStorage.getItem('generalratetypes'));
    this.generalratetypesAll = JSON.parse(window.sessionStorage.getItem('generalratetypesAll'));
    if (this.disabled == false && this.generalratetypes == null) {
      this.generalratetypeGet();
    } else if (this.disabled == true && this.generalratetypesAll == null) {
      this.generalratetypeGetAll();
    }
  }

  setGeneralratetypes(response) {
    this.generalratetypes = response;
    window.sessionStorage.setItem("generalratetypes", JSON.stringify(this.generalratetypes));

    this.generalratetypesAll = response;
    window.sessionStorage.setItem("generalratetypesAll", JSON.stringify(this.generalratetypesAll));
  }

  generalratetypeGet() {
    this.lookupservice.lookup("GENERALRATETYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setGeneralratetypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  generalratetypeGetAll() {
    this.lookupservice.lookupAll("GENERALRATETYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setGeneralratetypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
