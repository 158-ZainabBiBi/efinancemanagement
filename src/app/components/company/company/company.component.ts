import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { CompanyService } from './company.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  @Input()
  view: number = 1;
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  companyID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() onCompanyChange = new EventEmitter();

  companies = [];
  companiesAll = [];
  company = {
    company_ID : 0,
    company_NAME: "",
    company_DESC : "",
    start_DATE: "",
    end_DATE: "",
    isactive: true,
  }

  constructor(
    private companyservice: CompanyService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router : Router,
  ) { }

  ngOnInit(): void {
    this.companies = JSON.parse(window.sessionStorage.getItem('companies'));
    this.companiesAll = JSON.parse(window.sessionStorage.getItem('companiesAll'));

    if (this.view == 1 && this.disabled == false && this.companies == null) {
      this.companyGet();
    } else if (this.view == 1 && this.disabled == true && this.companiesAll == null) {
      this.companyGetAll();
    } else if (this. view == 2 && this.companiesAll == null) {
      this.companyGetAll();
    }

    if (this.companyID != 0 && !this.companyID && Number(window.sessionStorage.getItem('company'))>0) {
      this.companyID = Number(window.sessionStorage.getItem('company'));
    }

    if (this.view == 5 && this.companyID) {
      window.sessionStorage.setItem("company", this.companyID);
      this.companyGetOne(this.companyID);
    }

    if (this.view == 11 && this.disabled == false) {
      this.companyID = null;
      this.companiesAll = null;
      this.companies = null;
    }
    
    if (this.companyID == 0)
      this.companyID = null;
  }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          width: 136,
          text: 'Refresh',
          onClick: this.companyGetAll.bind(this),
        },
      }
    );
  }

  add() {
    this.company = {
      company_ID : 0,
      company_NAME: "",
      company_DESC : "",
      start_DATE: "",
      end_DATE: "",
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

  companyEdit(){
    this.disabled = false;
  }

  companyCancel() {
    this.disabled = true;
    if (this.company.company_ID==0) {
      this.router.navigate(["/home/companies"], {});
    }
  }

  onChange(company) {
    this.onCompanyChange.next(company);
  }

  setCompany(response){
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.company = response;
    this.disabled = true;
  }

  setCompanies(response) {
    if (this.view == 1 && this.disabled == false) {
      this.companies = response;
      window.sessionStorage.setItem("companies", JSON.stringify(this.companies));
    } else {
      this.companiesAll = response;
      window.sessionStorage.setItem("companiesAll", JSON.stringify(this.companiesAll));
    }
    this.cancel.next();
  }

  companyGet() {
    this.companyservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  companyGetAll() {
    this.companyservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  companyGetOne(id) {
    this.companyservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }
  companyAdd(company) {
    company.isactive="Y";
   
    this.companyservice.add(company).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.company_ID) {
          this.toastrservice.success("Success", "New Company Added");
          this.companyGetAll();
          this.setCompany(response);
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  companyUpdate(company) {
   
    if (company.isactive == true) {
      company.isactive = "Y";
    } else {
      company.isactive = "N";
    }
    this.companyservice.update(company, company.company_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.company_ID) {
          this.toastrservice.success("Success", " Company Updated");
          if (this.disabled==true) {
            this.setCompany(response);
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
}