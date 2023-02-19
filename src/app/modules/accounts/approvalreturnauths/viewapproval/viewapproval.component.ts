import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-viewapproval',
  templateUrl: './viewapproval.component.html',
  styleUrls: ['./viewapproval.component.css']
})
export class ViewapprovalComponent implements OnInit {
  approvalreturnauthID = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.approvalreturnauth) {
        this.approvalreturnauthID = params.approvalreturnauth;
      }
    });
  }

  cancel() {
    this.router.navigate(["/home/approvalreturnauths"], { queryParams: {} });
  }

}
