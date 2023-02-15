import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { Router } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import { setting } from 'src/app/setting';
import { redirectByHref } from '../../../utilities/Shared_Funtions';

import { StudentinstanceService } from './studentinstance.service';

@Component({
  selector: 'app-studentinstance',
  templateUrl: './studentinstance.component.html',
  styleUrls: ['./studentinstance.component.css']
})
export class StudentinstanceComponent implements OnInit {
  @ViewChild("grid") dataGrid: DxDataGridComponent;

  @Input()
  view: number = 1;
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  studentinstanceID = null;

  @Output() show = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() selected = new EventEmitter();

  studentinstances = [];
  studentinstancesAll = [];
  studentinstance = {
    studentinstance_ID: 0,
    intakecourse_ID: null,
    intakecourse: {
      intake_ID: null,
      course_ID: null
    },
    person_ID: null,

    studentinstitute_ID: null,
    studentstatus_ID: null,
    qualificationonentry_ID: null,
    reasonend_ID: null,
    unitlgth_ID: null,
    sourcetuitionfee_ID: null,

    declaration_DATE: null,
    sourcetuitionfee_DESC: null,
    student_RN: "",
    registration_NO: null,
    comdate: null,
    enddate: null,
    splength: null,
    owninst: null,
    isactive: true
  }

  constructor(
    private studentinstanceservice: StudentinstanceService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    console.log("Student Instance: "+this.disabled);
    this.studentinstances = JSON.parse(window.sessionStorage.getItem('studentinstances'));
    this.studentinstancesAll = JSON.parse(window.sessionStorage.getItem('studentinstancesAll'));
    if (this.view == 1 && this.studentinstances == null) {
      this.studentinstanceGet();
    } else if (this.view == 1 && this.disabled == true && this.studentinstancesAll == null) {
      this.studentinstanceGetAll();
    } else if (this.view == 2 && this.studentinstancesAll == null) {
      this.studentinstanceGetAll();
    }

    if (this.studentinstanceID != 0 && !this.studentinstanceID && Number(window.sessionStorage.getItem('studentinstance')) > 0) {
      this.studentinstanceID = Number(window.sessionStorage.getItem('studentinstance'));
    } else if (this.view == 5) {
      redirectByHref(setting.redirctPath+"/#/home/personal");
    }

    if (this.view == 5 && this.studentinstanceID) {
      window.sessionStorage.setItem("studentinstance", this.studentinstanceID);
      this.studentinstanceGetOne(this.studentinstanceID);
    }

    if (this.studentinstanceID == 0) {
      this.studentinstanceID = null;
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
          onClick: this.studentinstanceGetAll.bind(this),
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
          onClick: this.studentinstanceGetAll.bind(this),
        },
      }
    );
  }

  add() {
    this.studentinstance = {
      studentinstance_ID: 0,
      intakecourse_ID: null,
      intakecourse: {
        intake_ID: null,
        course_ID: null
      },
      person_ID: null,

      studentinstitute_ID: null,
      studentstatus_ID: null,
      qualificationonentry_ID: null,
      reasonend_ID: null,
      unitlgth_ID: null,
      sourcetuitionfee_ID: null,

      declaration_DATE: null,
      sourcetuitionfee_DESC: null,
      student_RN: "",
      registration_NO: null,
      comdate: null,
      enddate: null,
      splength: null,
      owninst: null,
      isactive: true
    };
  }

  update(row) {
    this.edit.next(row);
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

  studentinstanceCancel() {
    console.log(this.studentinstance);
    this.disabled = true;
    if (this.studentinstance.studentinstance_ID == 0) {
      this.router.navigate(["/home/studentinstances"], {});
    }
  }

  setstudentinstance(response) {
    this.disabled = true;
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.studentinstance = response;
  }

  setstudentinstances(response) {
    if ((this.view == 1 || this.view == 11) && this.disabled == false) {
      this.studentinstances = response;
      window.sessionStorage.setItem("studentinstances", JSON.stringify(this.studentinstances));
    } else {
      this.studentinstancesAll = response;
      window.sessionStorage.setItem("studentinstancesAll", JSON.stringify(this.studentinstancesAll));
    }
    this.cancel.next();
  }

  studentinstanceGetOne(id) {
    this.studentinstanceservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setstudentinstance(this.studentinstanceservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  studentinstanceGet() {
    this.studentinstanceservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setstudentinstances(this.studentinstanceservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  studentinstanceGetAll() {
    this.studentinstanceservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setstudentinstances(this.studentinstanceservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  studentinstanceAdd(studentinstance) {
    studentinstance.isactive = "Y";
    if (this.view == 5) { } else {}

    this.studentinstanceservice.add(studentinstance).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.studentinstance_ID) {
          this.toastrservice.success("Success", "New Studentinstance Added");
          this.studentinstanceGetAll();
          this.setstudentinstance(this.studentinstanceservice.getDetail(response));
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  studentinstanceUpdate(studentinstance) {
    if (this.view == 5) { } else {}

    if (studentinstance.isactive == true) {
      studentinstance.isactive = "Y";
    } else {
      studentinstance.isactive = "N";
    }
    this.studentinstanceservice.update(studentinstance, studentinstance.studentinstance_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.studentinstance_ID) {
          this.toastrservice.success("Success", " Studentinstance Updated");
          if (this.disabled == true) {
            this.setstudentinstance(this.studentinstanceservice.getDetail(response));
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
