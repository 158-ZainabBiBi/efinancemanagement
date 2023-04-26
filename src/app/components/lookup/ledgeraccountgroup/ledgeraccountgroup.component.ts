import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-ledgeraccountgroup',
  templateUrl: './ledgeraccountgroup.component.html',
  styleUrls: ['./ledgeraccountgroup.component.css']
})
export class LedgeraccountgroupComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  ledgeraccountgroupID = null;

  ledgeraccountgroups = [];
  ledgeraccountgroupsAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.ledgeraccountgroups = JSON.parse(window.sessionStorage.getItem('ledgeraccountgroups'));
    this.ledgeraccountgroupsAll = JSON.parse(window.sessionStorage.getItem('ledgeraccountgroupsAll'));
    if (this.disabled == false && this.ledgeraccountgroups == null) {
      this.ledgeraccountgroupGet();
    } else if (this.disabled == true && this.ledgeraccountgroupsAll == null) {
      this.ledgeraccountgroupGetAll();
    }
  }

  setLedgeraccountgroups(response) {
    this.ledgeraccountgroups = response;
    window.sessionStorage.setItem("ledgeraccountgroups", JSON.stringify(this.ledgeraccountgroups));

    this.ledgeraccountgroupsAll = response;
    window.sessionStorage.setItem("ledgeraccountgroupsAll", JSON.stringify(this.ledgeraccountgroupsAll));
  }

  ledgeraccountgroupGet() {
    this.lookupservice.lookup("LEDGERACCOUNTGROUP").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setLedgeraccountgroups(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ledgeraccountgroupGetAll() {
    this.lookupservice.lookupAll("LEDGERACCOUNTGROUP").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setLedgeraccountgroups(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
