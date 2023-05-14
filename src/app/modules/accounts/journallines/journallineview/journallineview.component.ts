import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-journallineview',
  templateUrl: './journallineview.component.html',
  styleUrls: ['./journallineview.component.css']
})
export class JournallineviewComponent implements OnInit {

  journallineID = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.journalline) {
        this.journallineID = params.journalline;
      }
    });
  }

  cancel() {
    this.router.navigate(["/home/journallines"], { queryParams: {} });
  }

  refresh() {
    this.cancel();
  }
}
