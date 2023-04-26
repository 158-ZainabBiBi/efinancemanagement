import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { TaxcodeService } from './taxcode.service';

@Component({
  selector: 'app-taxcode',
  templateUrl: './taxcode.component.html',
  styleUrls: ['./taxcode.component.css']
})
export class TaxcodeComponent implements OnInit {

  @Input()
  view: number = 1;
  @Input()
  iscompulsory: boolean = false;
  @Input()
  isreload: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  taxcodeID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onTaxCodeChange = new EventEmitter();

  taxcodes = [];
  taxcodesAll = [];
  taxcode = {
    taxcode_ID: 0,
    quickbook_ID: null,
    taxcode_TITLE: null,
    taxcode_DESC: null,
    taxcode_PERCENTAGE: null,
    taxcode_CODE: null,
    isactive: true,
  }

  constructor(
    private taxcodeservice: TaxcodeService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload): void {
    if (window.sessionStorage.getItem('taxcodes') != null) {
      this.taxcodes = JSON.parse(window.sessionStorage.getItem('taxcodes'));
    }
    if (window.sessionStorage.getItem('taxcodesAll') != null) {
      this.taxcodesAll = JSON.parse(window.sessionStorage.getItem('taxcodesAll'));
    }
    if (this.taxcodeID != 0 && !this.taxcodeID && Number(window.sessionStorage.getItem('taxcode')) > 0) {
      this.taxcodeID = Number(window.sessionStorage.getItem('taxcode'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.taxcodes == null || this.taxcodes.length == 0 || reload == true)) {
      this.taxcodes == null;
      this.taxcodeGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.taxcodesAll == null || this.taxcodesAll.length == 0 || reload == true)) {
      this.taxcodesAll == null;
      this.taxcodeGetAll();
    }

    var search = {

    }

    if (this.view >= 5 && this.view <= 6 && this.taxcodeID) {
      window.sessionStorage.setItem("taxcode", this.taxcodeID);
      this.taxcodeGetOne(this.taxcodeID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.taxcodes == null || this.taxcodes.length == 0 || reload == true)) {
      this.taxcodes == null;
      this.taxcodeAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.taxcodesAll == null || this.taxcodesAll.length == 0 || reload == true)) {
      this.taxcodesAll == null;
      this.taxcodeAdvancedSearchAll(search);
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
          onClick: this.load.bind(this, true),
        },
      }
    );
  }

  add() {
    this.taxcode = {
      taxcode_ID: 0,
      quickbook_ID: null,
      taxcode_TITLE: null,
      taxcode_DESC: null,
      taxcode_PERCENTAGE: null,
      taxcode_CODE: null,
      isactive: true,
    };
  }

  update(row) {
    this.edit.next(row);
  }

  editView() {
    this.disabled = false;
  }

  showView(row) {
    this.show.next(row);
  }

  cancelView() {
    this.cancel.next();
  }

  taxcodeEdit() {
    this.disabled = false;
  }

  taxcodeCancel() {
    this.disabled = true;
    if (this.taxcode.taxcode_ID == 0) {
      this.router.navigate(["/home/taxcode "], {});
    }
  }

  onChange(taxcodeID) {
    for (var i = 0; i < this.taxcodes.length; i++) {
      if (this.taxcodes[i].taxcode_ID == taxcodeID) {
        this.onTaxCodeChange.next(this.taxcodes[i]);
        break;
      }
    }
  }

  setTaxcode(response) {
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.taxcode = response;
  }

  setTaxcodes(response) {
    this.cancel.next();
    return response;
  }

  taxcodeGet() {
    this.taxcodeservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.taxcodes = this.setTaxcodes(this.taxcodeservice.getAllDetail(response));
          window.sessionStorage.setItem("taxcodes", JSON.stringify(this.taxcodes));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  taxcodeGetAll() {
    this.taxcodeservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.taxcodesAll = this.setTaxcodes(this.taxcodeservice.getAllDetail(response));
          window.sessionStorage.setItem("taxcodesAll", JSON.stringify(this.taxcodesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  taxcodeGetOne(id) {
    this.disabled = true;
    this.taxcodeservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setTaxcode(this.taxcodeservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  taxcodeAdd(taxcode) {

    taxcode.isactive = "Y";

    this.taxcodeservice.add(taxcode).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.taxcode_ID) {
          this.toastrservice.success("Success", "New Taxcode Added");
          this.refresh.next();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  taxcodeUpdate(taxcode) {

    if (taxcode.isactive == true) {
      taxcode.isactive = "Y";
    } else {
      taxcode.isactive = "N";
    }
    this.taxcodeservice.update(taxcode, taxcode.taxcode_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.taxcode_ID) {
          this.toastrservice.success("Success", "Taxcode Updated");
          this.refresh.next();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  taxcodeUpdateAll(taxcodes) {
    this.taxcodeservice.updateAll(taxcodes).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Taxcodes Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  taxcodeSearch(str) {
    var search = {
      search: str
    }
    this.taxcodeservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.taxcodes = this.setTaxcodes(this.taxcodeservice.getAllDetail(response));
          window.sessionStorage.setItem("taxcodes", JSON.stringify(this.taxcodes));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  taxcodeSearchAll(str) {
    var search = {
      search: str
    }
    this.taxcodeservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.taxcodesAll = this.setTaxcodes(this.taxcodeservice.getAllDetail(response));
          window.sessionStorage.setItem("taxcodesAll", JSON.stringify(this.taxcodesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  taxcodeAdvancedSearch(search) {


    this.taxcodeservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.taxcodes = this.setTaxcodes(this.taxcodeservice.getAllDetail(response));
          window.sessionStorage.setItem("taxcodes", JSON.stringify(this.taxcodes));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  taxcodeAdvancedSearchAll(search) {

    this.taxcodeservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.taxcodesAll = this.setTaxcodes(this.taxcodeservice.getAllDetail(response));
          window.sessionStorage.setItem("taxcodesAll", JSON.stringify(this.taxcodesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
