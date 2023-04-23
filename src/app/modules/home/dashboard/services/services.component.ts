import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {

  constructor(
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    // show the first div by default
    this.showDiv(1);
  }

  showDiv(index: number): void {
    const divs = document.querySelectorAll('.tab');
    divs.forEach((div, i) => {
      if (i === index - 1) {
        (div as HTMLElement).style.display = "block";
      } else {
        (div as HTMLElement).style.display = "none";
      }
    });
  }

  showcontact() {
    this.router.navigate(["/home/customers"], {});
  }

  showabout() {
    this.router.navigate(["/home/tellers"], {});
  }

  showservices() {
    this.router.navigate(["/home/advisors"], {});
  }

}
