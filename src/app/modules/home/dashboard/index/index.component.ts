import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  constructor(
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    let slideIndex: number = 0;
    showSlides();

    function showSlides() {
      let i: number;
      let slides: HTMLCollectionOf<Element> = document.getElementsByClassName("mySlides");
      let dots: HTMLCollectionOf<Element> = document.getElementsByClassName("dot");
      for (i = 0; i < slides.length; i++) {
        (slides[i] as HTMLElement).style.display = "none";
      }
      slideIndex++;
      if (slideIndex > slides.length) { slideIndex = 1 }
      for (i = 0; i < dots.length; i++) {
        (dots[i] as HTMLElement).className = (dots[i] as HTMLElement).className.replace(" active", "");
      }
      (slides[slideIndex - 1] as HTMLElement).style.display = "block";
      (dots[slideIndex - 1] as HTMLElement).className += " active";
      setTimeout(showSlides, 2000); // Change image every 5 seconds
    }
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
