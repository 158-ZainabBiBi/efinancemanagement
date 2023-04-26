import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-postingperiod',
  templateUrl: './postingperiod.component.html',
  styleUrls: ['./postingperiod.component.css']
})
export class PostingperiodComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  postingperiodID = null;

  postingperiods = [];
  postingperiodsAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.postingperiods = JSON.parse(window.sessionStorage.getItem('postingperiods'));
    this.postingperiodsAll = JSON.parse(window.sessionStorage.getItem('postingperiodsAll'));
    if (this.disabled == false && this.postingperiods == null) {
      this.postingperiodGet();
    } else if (this.disabled == true && this.postingperiodsAll == null) {
      this.postingperiodGetAll();
    }
  }

  setPostingperiods(response) {
    this.postingperiods = response;
    window.sessionStorage.setItem("postingperiods", JSON.stringify(this.postingperiods));

    this.postingperiodsAll = response;
    window.sessionStorage.setItem("postingperiodsAll", JSON.stringify(this.postingperiodsAll));
  }

  postingperiodGet() {
    this.lookupservice.lookup("POSTINGPERIOD").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setPostingperiods(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  postingperiodGetAll() {
    this.lookupservice.lookupAll("POSTINGPERIOD").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setPostingperiods(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
