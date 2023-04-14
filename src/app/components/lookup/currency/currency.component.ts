
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css']
})
export class CurrencyComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  currencyID = null;

  currencies = [];
  currenciesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.currencies = JSON.parse(window.sessionStorage.getItem('currencies'));
    this.currenciesAll = JSON.parse(window.sessionStorage.getItem('currenciesAll'));
    if (this.disabled == false && this.currencies == null) {
      this.currencyGet();
    } else if (this.disabled == true && this.currenciesAll == null) {
      this.currencyGetAll();
    }
  }

  setCurrencies(response) {
    if (this.disabled == false) {
      this.currencies = response;
      window.sessionStorage.setItem("currencies", JSON.stringify(this.currencies));
    } else {
      this.currenciesAll = response;
      window.sessionStorage.setItem("currenciesAll", JSON.stringify(this.currenciesAll));
    }
  }

  currencyGet(){
    this.lookupservice.lookup("CURRENCY").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setCurrencies(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  currencyGetAll(){
    this.lookupservice.lookupAll("CURRENCY").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setCurrencies(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}