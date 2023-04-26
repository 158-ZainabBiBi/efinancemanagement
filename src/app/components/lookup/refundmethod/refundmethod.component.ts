import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-refundmethod',
  templateUrl: './refundmethod.component.html',
  styleUrls: ['./refundmethod.component.css']
})
export class RefundmethodComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  refundmethodID = null;

  refundmethods = [];
  refundmethodsAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.refundmethods = JSON.parse(window.sessionStorage.getItem('refundmethods'));
    this.refundmethodsAll = JSON.parse(window.sessionStorage.getItem('refundmethodsAll'));
    if (this.disabled == false && this.refundmethods == null) {
      this.refundmethodGet();
    } else if (this.disabled == true && this.refundmethodsAll == null) {
      this.refundmethodGetAll();
    }
  }

  setRefundmethods(response) {
    this.refundmethods = response;
    window.sessionStorage.setItem("refundmethods", JSON.stringify(this.refundmethods));

    this.refundmethodsAll = response;
    window.sessionStorage.setItem("refundmethodsAll", JSON.stringify(this.refundmethodsAll));
  }

  refundmethodGet() {
    this.lookupservice.lookup("REFUNDMETHOD").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setRefundmethods(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  refundmethodGetAll() {
    this.lookupservice.lookupAll("REFUNDMETHOD").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setRefundmethods(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
