import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-viewrecieve',
  templateUrl: './viewrecieve.component.html',
  styleUrls: ['./viewrecieve.component.css']
})
export class ViewrecieveComponent implements OnInit {
  recievereturnauthID = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.recievereturnauth) {
        this.recievereturnauthID = params.recievereturnauth;
      }
    });
  }

  cancel() {
    this.router.navigate(["/home/recievereturnauths"], { queryParams: {} });
  }

}
