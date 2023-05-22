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

    if (this.currencies == null) {
      this.currencyGet();
    }

    if (this.currenciesAll == null) {
      this.currencyGetAll();
    }
  }

  currencyGet() {
    this.lookupservice.lookup("CURRENCY").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.currencies = response;
          window.sessionStorage.setItem("currencies", JSON.stringify(this.currencies));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  currencyGetAll() {
    this.lookupservice.lookupAll("CURRENCY").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.currenciesAll = response;
          window.sessionStorage.setItem("currenciesAll", JSON.stringify(this.currenciesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
