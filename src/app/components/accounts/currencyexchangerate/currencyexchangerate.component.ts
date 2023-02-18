import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { OnFailService } from '../../../services/on-fail.service';
import { Router } from '@angular/router';
import { CurrencyComponent } from '../currency/currency.component';
import { CurrencyexchangerateService } from './currencyexchangerate.service';


@Component({
  selector: 'app-currencyexchangerate',
  templateUrl: './currencyexchangerate.component.html',
  styleUrls: ['./currencyexchangerate.component.css']
})
export class CurrencyexchangerateComponent implements OnInit {
  @ViewChild("currency") currency: CurrencyComponent;
  @ViewChild("addcurrency") addcurrency: CurrencyComponent;
  @ViewChild("editcurrency") editcurrency:CurrencyComponent;

  @Input()
  view: number = 1;
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  currencyexchangerateID = null;
  @Input()
  currencyID = null;

  @Output() show = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();

  currencyexchangerates = [];
  currencyexchangeratesAll = [];
  currencyexchangerate = {
    currencyexchangerate_ID: 0,
    currency_ID: 0,
    effective_DATE: "",
    isactive: true,
  }

  constructor(
    private currencyexchangerateservice: CurrencyexchangerateService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router : Router,
  ) { }

  ngOnInit(): void {
    this.currencyexchangerates = JSON.parse(window.sessionStorage.getItem('currencyexchangerates'));
    this.currencyexchangeratesAll = JSON.parse(window.sessionStorage.getItem('currencyexchangeratesAll'));
    if (this.view == 1 && this.currencyexchangerates == null) {
      this.currencyexchangerateGet();
    }else if (this.view == 1 && this.disabled == true && this.currencyexchangeratesAll == null) {
        this.currencyexchangerateGetAll();
    } else if (this. view == 2 && this.currencyexchangeratesAll == null) {
      this.currencyexchangerateGetAll();
    } else if (this. view == 22 && (this.currencyID != null )) {
      this.currencyexchangerateAdvancedSearchAll(this.currencyID);
    }

    if (this.currencyexchangerateID != 0 && !this.currencyexchangerateID && Number(window.sessionStorage.getItem('currencyexchangerate'))>0) {
      this.currencyexchangerateID = Number(window.sessionStorage.getItem('currencyexchangerate'));
    }
    if (this.view == 5 && this.currencyexchangerateID) {
      window.sessionStorage.setItem("currencyexchangerate", this.currencyexchangerateID);
      this.currencyexchangerateGetOne(this.currencyexchangerateID);
    } if (this.view == 11 && this.currencyID && this.disabled == false) {
      this.currencyexchangerateAdvancedSearch(this.currencyID);
    } else if (this.view == 11 && this.currencyID && this.disabled == true) {
      this.currencyexchangerateAdvancedSearchAll(this.currencyID);
      
    } else if (this.view == 11 || this.view == 1 ) {
      this.currencyexchangerateID = null;
      this.currencyexchangeratesAll = null;
      this.currencyexchangerates = null;
    }

    if (this.currencyexchangerateID == 0) {
      this.currencyexchangerateID = null;
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

  currencyexchangerateCancel() {
    console.log(this.currencyexchangerate);
    this.disabled = true;
    if (this.currencyexchangerate.currencyexchangerate_ID == 0) {
      this.router.navigate(["/home/currencyexchangerates"], {});
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
          onClick: this.currencyexchangerateGetAll.bind(this),
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
          onClick: this.currencyexchangerateAdvancedSearchAll.bind(this, this.currencyID),
        },
      }
    );
  }

  add() {
    this.currencyexchangerate = {
      currencyexchangerate_ID: 0,
      currency_ID: 0,
      effective_DATE: "",
      isactive: true,
    };
  }
  setcurrencyexchangerate(response){
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.currencyexchangerate = response;
    this.disabled = true;
  }

  update(row) {
    this.edit.next(row);
  }

  setcurrencyexchangerates(response) {
    if ((this.view == 1 || this.view == 11)  && this.disabled == false) {
      this.currencyexchangerates = response;
      window.sessionStorage.setItem("currencyexchangerates", JSON.stringify(this.currencyexchangerates));
    } else {
      this.currencyexchangeratesAll = response;
      window.sessionStorage.setItem("currencyexchangeratesAll", JSON.stringify(this.currencyexchangeratesAll));
    }
    this.cancel.next();
  }

  currencyexchangerateGet() {
      this.currencyexchangerateservice.get().subscribe(response => {
        if (response) {
          if (response.error && response.status) {
            this.toastrservice.warning("Message", " " + response.message);
          } else{
            this.setcurrencyexchangerates(this.currencyexchangerateservice.getAllDetail(response));
          }
        }
      }, error => {
        this.onfailservice.onFail(error);
      })
  }


  currencyexchangerateGetAll() {
    this.currencyexchangerateservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setcurrencyexchangerates(this.currencyexchangerateservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }
  currencyexchangerateGetOne(id) {
    this.currencyexchangerateservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setcurrencyexchangerate(this.currencyexchangerateservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }
  currencyexchangerateAdd(currencyexchangerate) {
    currencyexchangerate.isactive = "Y";
    if(this.view == 5){
       currencyexchangerate.currency_ID = this.currency.currencyID;
     
    } else { 
       currencyexchangerate.currency_ID = this.addcurrency.currencyID;
    }
    this.currencyexchangerateservice.add(currencyexchangerate).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.currencyexchangerate_ID) {
          this.toastrservice.success("Success", "New currencyexchangerate Added");
          this.currencyexchangerateGetAll();
          this.setcurrencyexchangerate(this.currencyexchangerateservice.getDetail(response));
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  currencyexchangerateUpdate(currencyexchangerate) {
    if(this.view == 5){
       currencyexchangerate.currency_ID = this.currency.currencyID;
    } else { 
       currencyexchangerate.currency_ID = this.editcurrency.currencyID;
    }
    
    if (currencyexchangerate.isactive == true) {
      currencyexchangerate.isactive = "Y";
    } else {
      currencyexchangerate.isactive = "N";
    }
    this.currencyexchangerateservice.update(currencyexchangerate, currencyexchangerate.currencyexchangerate_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.currencyexchangerate_ID) {
          this.toastrservice.success("Success", "currencyexchangerate Updated");
          if (this.disabled == true) {
            this.setcurrencyexchangerate(this.currencyexchangerateservice.getDetail(response));
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

  currencyexchangerateSearch(str) {
    var search = {
      search: str
    }
    this.currencyexchangerateservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setcurrencyexchangerates(this.currencyexchangerateservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  currencyexchangerateSearchAll(str) {
    var search = {
      search: str
    }
    this.currencyexchangerateservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setcurrencyexchangerates(this.currencyexchangerateservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  currencyexchangerateAdvancedSearch(currencyID) {
    this.currencyID = currencyID;
    var search = {
      currency_ID: currencyID
    }
    this.currencyexchangerateservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setcurrencyexchangerates(this.currencyexchangerateservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  currencyexchangerateAdvancedSearchAll(currencyID) {
    this.currencyID = currencyID;
    var search = {
      currency_ID: currencyID
    }
    this.currencyexchangerateservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setcurrencyexchangerates(this.currencyexchangerateservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
