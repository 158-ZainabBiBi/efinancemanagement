import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { Router } from '@angular/router';

import { LocationComponent } from '../../locations/location/location.component';
import { CurrencyService } from './currency.service';
import { CurrencysymbolreplacementComponent } from '../../lookups/currencysymbolreplacement/currencysymbolreplacement.component';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css']
})
export class CurrencyComponent implements OnInit {
  @ViewChild("location") location: LocationComponent;
  @ViewChild("addlocation") addlocation: LocationComponent;
  @ViewChild("editlocation") editlocation:LocationComponent;

  @ViewChild("currencysymbolreplacement") currencysymbolreplacement: CurrencysymbolreplacementComponent;
  @ViewChild("addcurrencysymbolreplacement") addcurrencysymbolreplacement: CurrencysymbolreplacementComponent;
  @ViewChild("editcurrencysymbolreplacement") editcurrencysymbolreplacement: CurrencysymbolreplacementComponent;

  @Input()
  view: number = 1;
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  currencyID = null;
  @Input()
  locationID = null;

  @Output() show = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();

  currencies = [];
  currenciesAll = [];
  currency = {
    currency_ID: 0,
    location_ID: 0,
    currencysymbolreplacement_ID: 0,
    iso_CODE: "",
    exchange_RATE: null,
    currency_FORMAT: "",
    currency_SYMBOL: "",
    isactive: true,
  }

  constructor(
    private currencyservice: CurrencyService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router : Router,
  ) { }

  ngOnInit(): void {
    this.currencies = JSON.parse(window.sessionStorage.getItem('currencies'));
    this.currenciesAll = JSON.parse(window.sessionStorage.getItem('currenciesAll'));
    if (this.view == 1 && this.currencies == null) {
      this.currencyGet();
    }else if (this.view == 1 && this.disabled == true && this.currenciesAll == null) {
        this.currencyGetAll();
    } else if (this. view == 2 && this.currenciesAll == null) {
      this.currencyGetAll();
    } else if (this. view == 22 && (this.locationID != null )) {
      this.currencyAdvancedSearchAll(this.locationID);
    }

    if (this.currencyID != 0 && !this.currencyID && Number(window.sessionStorage.getItem('currency'))>0) {
      this.currencyID = Number(window.sessionStorage.getItem('currency'));
    }
    if (this.view == 5 && this.currencyID) {
      window.sessionStorage.setItem("currency", this.currencyID);
      this.currencyGetOne(this.currencyID);
    } if (this.view == 11 && this.locationID && this.disabled == false) {
      this.currencyAdvancedSearch(this.locationID);
    } else if (this.view == 11 && this.locationID && this.disabled == true) {
      this.currencyAdvancedSearchAll(this.locationID);

    } else if (this.view == 11 || this.view == 1 ) {
      this.currencyID = null;
      this.currenciesAll = null;
      this.currencies = null;
    }

    if (this.currencyID == 0) {
      this.currencyID = null;
    }
  }

  showView(row) {
    this.show.next(row);
  }

  editView() {
    this.disabled = false;
  }

  cancelView() {
    this.cancel.next();
  }

  currencyCancel() {
    console.log(this.currency);
    this.disabled = true;
    if (this.currency.currency_ID == 0) {
      this.router.navigate(["/home/currencies"], {});
    }
  }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          width: 136,
          text: 'Refresh',
          onClick: this.currencyGetAll.bind(this),
        },
      }
    );
  }

  onToolbarPreparingAdvanced(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          width: 136,
          text: 'Refresh',
          onClick: this.currencyAdvancedSearchAll.bind(this, this.locationID),
        },
      }
    );
  }

  add() {
    this.currency = {
      currency_ID: 0,
      location_ID: 0,
      currencysymbolreplacement_ID: 0,
      iso_CODE: "",
      exchange_RATE: null,
      currency_FORMAT: "",
      currency_SYMBOL: "",
      isactive: true,
    };
  }
  setcurrency(response){
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.currency = response;
    this.disabled = true;
  }

  update(row) {
    this.edit.next(row);
  }

  setcurrencies(response) {
    if ((this.view == 1 || this.view == 11)  && this.disabled == false) {
      this.currencies = response;
      window.sessionStorage.setItem("currencies", JSON.stringify(this.currencies));
    } else {
      this.currenciesAll = response;
      window.sessionStorage.setItem("currenciesAll", JSON.stringify(this.currenciesAll));
    }
    this.cancel.next();
  }

  currencyGet() {
      this.currencyservice.get().subscribe(response => {
        if (response) {
          if (response.error && response.status) {
            this.toastrservice.warning("Message", " " + response.message);
          } else{
            this.setcurrencies(this.currencyservice.getAllDetail(response));
          }
        }
      }, error => {
        this.onfailservice.onFail(error);
      })
  }


  currencyGetAll() {
    this.currencyservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setcurrencies(this.currencyservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }
  currencyGetOne(id) {
    this.currencyservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setcurrency(this.currencyservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }
  currencyAdd(currency) {
    currency.isactive = "Y";
    if(this.view == 5){
      currency.location_ID = this.location.locationID;
      currency.currencysymbolreplacement_ID = this.currencysymbolreplacement.currencysymbolreplacementID;

    } else {
       currency.location_ID = this.addlocation.locationID;
      currency.currencysymbolreplacement_ID = this.addcurrencysymbolreplacement.currencysymbolreplacementID;
    }
    this.currencyservice.add(currency).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.currency_ID) {
          this.toastrservice.success("Success", "New currency Added");
          this.currencyGetAll();
          this.setcurrency(this.currencyservice.getDetail(response));
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  currencyUpdate(currency) {
    if(this.view == 5){
      currency.location_ID = this.location.locationID;
       currency.currencysymbolreplacement_ID = this.currencysymbolreplacement.currencysymbolreplacementID;
    } else {
      currency.location_ID = this.editlocation.locationID;
       currency.currencysymbolreplacement_ID = this.editcurrencysymbolreplacement.currencysymbolreplacementID;
    }

    if (currency.isactive == true) {
      currency.isactive = "Y";
    } else {
      currency.isactive = "N";
    }
    this.currencyservice.update(currency, currency.currency_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.currency_ID) {
          this.toastrservice.success("Success", "currency Updated");
          if (this.disabled == true) {
            this.setcurrency(this.currencyservice.getDetail(response));
          } else {
            this.disabled = true;
          }
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  currencySearch(str) {
    var search = {
      search: str
    }
    this.currencyservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setcurrencies(this.currencyservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  currencySearchAll(str) {
    var search = {
      search: str
    }
    this.currencyservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setcurrencies(this.currencyservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  currencyAdvancedSearch(locationID) {
    this.locationID = locationID;
    var search = {
      location_ID: locationID
    }
    this.currencyservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setcurrencies(this.currencyservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  currencyAdvancedSearchAll(locationID) {
    this.locationID = locationID;
    var search = {
      location_ID: locationID
    }
    this.currencyservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setcurrencies(this.currencyservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
