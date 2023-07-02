import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { JournalComponent } from 'src/app/components/account/journal/journal.component';

declare var $: any;

@Component({
  selector: 'app-journalview',
  templateUrl: './journalview.component.html',
  styleUrls: ['./journalview.component.css']
})
export class JournalviewComponent implements OnInit {
  @ViewChild("journals") journals: JournalComponent;

  journalID = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.journal) {
        this.journalID = params.journal;
      }
    });
  }

  cancel() {
    this.router.navigate(["/home/journals"], { queryParams: {} });
  }

  refresh() {
    this.journals.load(true);
    this.cancel();
  }
}
