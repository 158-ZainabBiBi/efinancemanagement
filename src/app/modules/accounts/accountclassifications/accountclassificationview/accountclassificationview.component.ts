import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountclassificationComponent } from 'src/app/components/account/accountclassification/accountclassification.component';

declare var $: any;

@Component({
  selector: 'app-accountclassificationview',
  templateUrl: './accountclassificationview.component.html',
  styleUrls: ['./accountclassificationview.component.css']
})
export class AccountclassificationviewComponent implements OnInit {
  @ViewChild("accountclassifications") accountclassifications: AccountclassificationComponent;

  accountclassificationID = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.accountclassification) {
        this.accountclassificationID = params.accountclassification;
      }
    });
  }

  cancel() {
    this.router.navigate(["/home/accountclassifications"], { queryParams: {} });
  }

  refresh() {
    this.accountclassifications.load(true);
    this.cancel();
  }
}
