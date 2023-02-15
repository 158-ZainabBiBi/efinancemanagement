
import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { TaxcodeService } from '../taxcode/taxcode.service';

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
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  taxcodeID = null;
  
  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();

  taxcodes = [];
  taxcodesAll = [];
  taxcode = {
      taxcode_ID: 0,
      quickbook_ID: null,
      taxcode_TITLE: "",
      taxcode_DESC: null,
      taxcode_PERCENTAGE: "",
      taxcode_CODE: "",
      isactive:true,
  }
 
  constructor(
    private taxcodeservice: TaxcodeService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router : Router,
  ) { }

  ngOnInit(): void {
    this.taxcodes = JSON.parse(window.sessionStorage.getItem('taxcodes'));
    this.taxcodesAll = JSON.parse(window.sessionStorage.getItem('taxcodesAll'));
    if (this.view == 1 && this.disabled == false && this.taxcodes == null) {
      this.taxcodeGet();
    } else if (this.view == 1 && this.disabled == true && this.taxcodesAll == null) {
      this.taxcodeGetAll();
    } else if (this. view == 2 && this.taxcodesAll == null) {
      this.taxcodeGetAll();
    }

    if (this.taxcodeID != 0 && !this.taxcodeID && Number(window.sessionStorage.getItem('taxcode'))>0) {
      this.taxcodeID = Number(window.sessionStorage.getItem('taxcode'));
    }  
    
    if (this.view == 5 && this.taxcodeID) {
      window.sessionStorage.setItem("taxcode", this.taxcodeID);
      this.taxcodeGetOne(this.taxcodeID);
    }
    // if (this.taxcodeID == 0) {
    //   this.universityDisabled = false;
    //   this.taxcodeID = null;
    // }

  }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          width: 136,
          text: 'Refresh',
          onClick: this.taxcodeGetAll.bind(this),
        },
      }
    );
  }

  add() {
    this.taxcode = {
      taxcode_ID: 0,
      quickbook_ID: null,
      taxcode_TITLE: "",
      taxcode_DESC: null,
      taxcode_PERCENTAGE: "",
      taxcode_CODE: "",
      isactive:true,
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

  taxcodeEdit(){
    this.disabled = false;
  }

  taxcodeCancel() {
    this.disabled = true;
    if (this.taxcode.taxcode_ID==0) {
      this.router.navigate(["/home/taxcode "], {});
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
    if ((this.view == 1 || this.view == 11)  && this.disabled == false) {
      this.taxcodes = response;
      window.sessionStorage.setItem("taxcodes", JSON.stringify(this.taxcodes));
    } else {
      this.taxcodesAll = response;
      window.sessionStorage.setItem("taxcodesAll", JSON.stringify(this.taxcodesAll));
    }
    this.cancel.next();
  }

  taxcodeGet() {
    this.taxcodeservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setTaxcodes(response);
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
        } else{
          this.setTaxcodes(response);
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
        } else{
          this.setTaxcode(response);

        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  taxcodeAdd(taxcode) {
    taxcode.isactive="Y";


    this.taxcodeservice.add(taxcode).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.taxcode_ID) {
          this.toastrservice.success("Success", "New Taxcode Added");
          this.taxcodeGetAll();
          this.setTaxcode(response);
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
          this.toastrservice.success("Success", " Taxcode Updated");
          if (this.disabled==true) {
            this.setTaxcode(response);
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

  // taxcodeSearch(str) {
  //   var search = {
  //     search: str
  //   }
  //   this.taxcodeservice.search(search).subscribe(response => {
  //     if (response) {
  //       if (response.error && response.status) {
  //         this.toastrservice.warning("Message", " " + response.message);
  //       } else{
  //         this.setTaxcodes(this.taxcodeservice.getAllDetail(response));
  //       }
  //     }
  //   }, error => {
  //     this.onfailservice.onFail(error);
  //   })
  // }

  // taxcodeSearchAll(str) {
  //   var search = {
  //     search: str
  //   }
  //   this.taxcodeservice.searchAll(search).subscribe(response => {
  //     if (response) {
  //       if (response.error && response.status) {
  //         this.toastrservice.warning("Message", " " + response.message);
  //       } else{
  //         this.setTaxcodes(this.taxcodeservice.getAllDetail(response));
  //       }
  //     }
  //   }, error => {
  //     this.onfailservice.onFail(error);
  //   })
  // }

  // taxcodeAdvancedSearch(universityID) {
  //   this.universityID = universityID;
  //   var search = {
  //     university_ID: universityID
  //   }
  //   this.taxcodeservice.advancedSearch(search).subscribe(response => {
  //     if (response) {
  //       if (response.error && response.status) {
  //         this.toastrservice.warning("Message", " " + response.message);
  //       } else{
  //         this.setTaxcodes(this.taxcodeservice.getAllDetail(response));
  //       }
  //     }
  //   }, error => {
  //     this.onfailservice.onFail(error);
  //   })
  // }

  // taxcodeAdvancedSearchAll(universityID) {
  //   this.universityID = universityID;
  //   var search = {
  //     university_ID: universityID
  //   }
  //   this.taxcodeservice.advancedSearchAll(search).subscribe(response => {
  //     if (response) {
  //       if (response.error && response.status) {
  //         this.toastrservice.warning("Message", " " + response.message);
  //       } else{
  //         this.setTaxcodes(this.taxcodeservice.getAllDetail(response));
  //       }
  //     }
  //   }, error => {
  //     this.onfailservice.onFail(error);
  //   })
  // }

}
