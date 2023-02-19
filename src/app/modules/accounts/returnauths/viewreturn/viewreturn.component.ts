import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-viewreturn',
  templateUrl: './viewreturn.component.html',
  styleUrls: ['./viewreturn.component.css']
})
export class ViewreturnComponent implements OnInit {
  returnauthID = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.returnauth) {
        this.returnauthID = params.returnauth;
      }
    });
  }

  cancel() {
    this.router.navigate(["/home/returnauths"], { queryParams: {} });
  }

}
