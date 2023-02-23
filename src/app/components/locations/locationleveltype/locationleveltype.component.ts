import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { OnFailService } from '../../../services/on-fail.service';
import { LocationleveltypeService } from './locationleveltype.service';

@Component({
  selector: 'app-locationleveltype',
  templateUrl: './locationleveltype.component.html',
  styleUrls: ['./locationleveltype.component.css']
})
export class LocationleveltypeComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  locationleveltypeID = null;

  locationleveltypes = [];

  constructor(
    private locationleveltypeservice: LocationleveltypeService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.locationleveltypes = JSON.parse(window.sessionStorage.getItem('locationleveltypes'));
    if (this.locationleveltypes == null) {
      this.locationleveltypeGet();
    }
    if (!this.locationleveltypeID && Number(window.sessionStorage.getItem('locationleveltype'))>0) {
      this.locationleveltypeID = Number(window.sessionStorage.getItem('locationleveltype'));
    }
    if (this.locationleveltypeID) {
      window.sessionStorage.setItem("locationleveltype", this.locationleveltypeID);
    }
  }

  setLocationType(response) {
    this.locationleveltypes = response;
    window.sessionStorage.setItem("locationleveltypes", JSON.stringify(this.locationleveltypes));
  }
  
  locationleveltypeGet(){
    this.locationleveltypeservice.lookup("LOCATIONLEVELTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLocationType(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
