import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { LoginService } from '../../pages/login/login.service';
import { OnFailService } from 'src/app/services/on-fail.service';
import { SidebarService } from 'src/app/services/sidebar.service';
import { setting } from "src/app/setting";

import * as $ from 'jquery'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  results = "No Record";
  Timeout;
  anything = false;
  user: any;
  temp = [];
  menu: any = [];
  smenu: any = [];
  bonusschemeAll: any;
  AllMenus = [];

  logo = setting.logo;

  constructor(
    private toastrservice: ToastrService,
    private _onFail_: OnFailService,
    private sidebarservice: SidebarService,
    private loginservice: LoginService
  ) { }

  ngOnInit() {
    this.user = this.loginservice.loaddetail();
  }

  logout() {
    this.loginservice.logout();
  }

  redirectToAppsStore() {
    location.replace(setting.AppsStorePath);
  }

  sideBar() {
    this.sidebarservice.userprivileges().subscribe(res => {
      this.AllMenus = res;
      var tempPri = [],
        flags = [];
      for (var m = 0; m < res.length; m++) {
        if (flags[res[m].pcategory_ID.pcategory_ID]) continue;
        flags[res[m].pcategory_ID.pcategory_ID] = true;
        this.temp.push(res[m].pcategory_ID);
      }
      for (var c = 0; c < this.temp.length; c++) {
        for (var p = 0; p < res.length; p++) {
          if (
            res[p].pcategory_ID.pcategory_NAME ==
            this.temp[c].pcategory_NAME &&
            res[p].ismenuprivilege == "Y"
          ) {
            tempPri.push({
              name: res[p].privilege_NAME,
              link: res[p].privilege_STATE
            });
          }
          if (p == res.length - 1) {
            if (tempPri.length > 0) {
              this.menu[c] = {
                cat: this.temp[c].pcategory_NAME,
                iconname: this.temp[c].pcategory_ICON,
                pri: tempPri
              };
              tempPri = [];
            }
          }
        }
      }

      this.smenu = this.menu[0].pri;
      setTimeout(() => {
        $(".myinput").append("<strong>Added to the front</strong>.");
      }, 1);

    }, err => {
      this._onFail_.onFail(err);
    }
    );
    // TOGGEL
    $("#btn-toggle").click(function () {
      $(".navigation").slideToggle();
    });
    $(document).ready(function () {
      $(".search-suggestions .search-input")
        .focus(function () {
          $(".suggestions").fadeIn("slide");
        })
        .focusout(function () {
          $(".suggestions").fadeOut("slide");
        });
    });
  }

  isNotEmpty(m) {
    if (JSON.stringify(m).length > 0) {
      return true;
    } else {
      return false;
    }
  }

  findLength(m) {
    return m.length;
  }

  ngAfterViewInit() {
    this.sideBar();
  }
}
