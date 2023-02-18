
import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { AccounttypeService } from '../accounttype/accounttype.service';

@Component({
  selector: 'app-accounttype',
  templateUrl: './accounttype.component.html',
  styleUrls: ['./accounttype.component.css']
})
export class AccounttypeComponent implements OnInit {
 
  @Input()
  view: number = 1;
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  accounttypeID = null;
  
  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();

  accounttypes = [];
  accounttypesAll = [];
  accounttype = {
      accounttype_ID: 0,
      accounttype_CODE: "",
      accounttype_NAME: "",
      accounttype_DESCRIPTION: "",
      isactive:true,
  }
 
  constructor(
    private accounttypeservice: AccounttypeService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router : Router,
  ) { }

  ngOnInit(): void {
    this.accounttypes = JSON.parse(window.sessionStorage.getItem('accounttypes'));
    this.accounttypesAll = JSON.parse(window.sessionStorage.getItem('accounttypesAll'));
    if (this.view == 1 && this.disabled == false && this.accounttypes == null) {
      this.accounttypeGet();
    } else if (this.view == 1 && this.disabled == true && this.accounttypesAll == null) {
      this.accounttypeGetAll();
    } else if (this. view == 2 && this.accounttypesAll == null) {
      this.accounttypeGetAll();
    }

    if (this.accounttypeID != 0 && !this.accounttypeID && Number(window.sessionStorage.getItem('accounttype'))>0) {
      this.accounttypeID = Number(window.sessionStorage.getItem('accounttype'));
    }  
    
    if (this.view == 5 && this.accounttypeID) {
      window.sessionStorage.setItem("accounttype", this.accounttypeID);
      this.accounttypeGetOne(this.accounttypeID);
    }
    // if (this.accounttypeID == 0) {
    //   this.universityDisabled = false;
    //   this.accounttypeID = null;
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
          onClick: this.accounttypeGetAll.bind(this),
        },
      }
    );
  }

  add() {
    this.accounttype = {
      accounttype_ID: 0,
      accounttype_CODE: "",
      accounttype_NAME: "",
      accounttype_DESCRIPTION: "",
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

  accounttypeEdit(){
    this.disabled = false;
  }

  accounttypeCancel() {
    this.disabled = true;
    if (this.accounttype.accounttype_ID==0) {
      this.router.navigate(["/home/accounttype "], {});
    }
  }

  setAccounttype(response) {
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.accounttype = response;
  }

  setAccounttypes(response) {
    if ((this.view == 1 || this.view == 11)  && this.disabled == false) {
      this.accounttypes = response;
      window.sessionStorage.setItem("accounttypes", JSON.stringify(this.accounttypes));
    } else {
      this.accounttypesAll = response;
      window.sessionStorage.setItem("accounttypesAll", JSON.stringify(this.accounttypesAll));
    }
    this.cancel.next();
  }

  accounttypeGet() {
    this.accounttypeservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setAccounttypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  accounttypeGetAll() {
    this.accounttypeservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setAccounttypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  accounttypeGetOne(id) {
    this.disabled = true;
    this.accounttypeservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setAccounttype(response);

        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  accounttypeAdd(accounttype) {
    accounttype.isactive="Y";

    this.accounttypeservice.add(accounttype).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.accounttype_ID) {
          this.toastrservice.success("Success", "New Accounttype Added");
          this.accounttypeGetAll();
          this.setAccounttype(response);
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  accounttypeUpdate(accounttype) {
    if (accounttype.isactive == true) {
      accounttype.isactive = "Y";
    } else {
      accounttype.isactive = "N";
    }
    this.accounttypeservice.update(accounttype, accounttype.accounttype_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.accounttype_ID) {
          this.toastrservice.success("Success", " Accounttype Updated");
          this.accounttypeGetAll();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  // accounttypeSearch(str) {
  //   var search = {
  //     search: str
  //   }
  //   this.accounttypeservice.search(search).subscribe(response => {
  //     if (response) {
  //       if (response.error && response.status) {
  //         this.toastrservice.warning("Message", " " + response.message);
  //       } else{
  //         this.setAccounttypes(this.accounttypeservice.getAllDetail(response));
  //       }
  //     }
  //   }, error => {
  //     this.onfailservice.onFail(error);
  //   })
  // }

  // accounttypeSearchAll(str) {
  //   var search = {
  //     search: str
  //   }
  //   this.accounttypeservice.searchAll(search).subscribe(response => {
  //     if (response) {
  //       if (response.error && response.status) {
  //         this.toastrservice.warning("Message", " " + response.message);
  //       } else{
  //         this.setAccounttypes(this.accounttypeservice.getAllDetail(response));
  //       }
  //     }
  //   }, error => {
  //     this.onfailservice.onFail(error);
  //   })
  // }

  // accounttypeAdvancedSearch(universityID) {
  //   this.universityID = universityID;
  //   var search = {
  //     university_ID: universityID
  //   }
  //   this.accounttypeservice.advancedSearch(search).subscribe(response => {
  //     if (response) {
  //       if (response.error && response.status) {
  //         this.toastrservice.warning("Message", " " + response.message);
  //       } else{
  //         this.setAccounttypes(this.accounttypeservice.getAllDetail(response));
  //       }
  //     }
  //   }, error => {
  //     this.onfailservice.onFail(error);
  //   })
  // }

  // accounttypeAdvancedSearchAll(universityID) {
  //   this.universityID = universityID;
  //   var search = {
  //     university_ID: universityID
  //   }
  //   this.accounttypeservice.advancedSearchAll(search).subscribe(response => {
  //     if (response) {
  //       if (response.error && response.status) {
  //         this.toastrservice.warning("Message", " " + response.message);
  //       } else{
  //         this.setAccounttypes(this.accounttypeservice.getAllDetail(response));
  //       }
  //     }
  //   }, error => {
  //     this.onfailservice.onFail(error);
  //   })
  // }

} 
