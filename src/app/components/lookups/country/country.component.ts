import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { OnFailService } from '../../../services/on-fail.service';
import { LookupService } from '../../../services/lookup.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  countryID = null;

  countries = [];
  countriesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.countries = JSON.parse(window.sessionStorage.getItem('countries'));
    this.countriesAll = JSON.parse(window.sessionStorage.getItem('countriesAll'));
    if (this.disabled == false && this.countries == null) {
      this.countryGet();
    } else if (this.disabled == true && this.countriesAll == null) {
      this.countryGetAll();
    }
  }

  setCountrys(response) {
    if (this.disabled == false) {
      this.countries = response;
      window.sessionStorage.setItem("countries", JSON.stringify(this.countries));
    } else {
      this.countriesAll = response;
      window.sessionStorage.setItem("countriesAll", JSON.stringify(this.countriesAll));
    }
  }

  countryGet(){
    this.lookupservice.lookup("COUNTRY").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setCountrys(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  countryGetAll(){
    this.lookupservice.lookupAll("COUNTRY").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setCountrys(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
