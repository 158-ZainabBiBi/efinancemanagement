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


  // showcontact() {
  //   this.router.navigate(["/home/contact"], {});
  // }

  // showabout() {
  //   this.router.navigate(["/home/about"], {});
  // }

  // showservices() {
  //   this.router.navigate(["/home/services"], {});
  // }

  // showlegal() {
  //   this.router.navigate(["/home/legal"], {});
  // }

  // showprivacy() {
  //   this.router.navigate(["/home/privacy"], {});
  // }

  // showterms() {
  //   this.router.navigate(["/home/terms"], {});
  // }

  // showbankaccount() {
  //   this.router.navigate(["/home/bankaccounts"], {});
  // }

  // showtransaction() {
  //   this.router.navigate(["/home/transactions"], {});
  // }

  // showjournal() {
  //   this.router.navigate(["/home/journals"], {});
  // }

  showindex() {
    window.open('http://localhost:4200/#/home/indexes', '_blank');
  }

  showcontact() {
    window.open('http://localhost:4200/#/home/contact', '_blank');
  }

  showabout() {
    window.open('http://localhost:4200/#/home/about', '_blank');
  }

  showservices() {
    window.open('http://localhost:4200/#/home/services', '_blank');
  }

  showlegal() {
    window.open('http://localhost:4200/#/home/legal', '_blank');
  }

  showprivacy() {
    window.open('http://localhost:4200/#/home/privacy', '_blank');
  }

  showterms() {
    window.open('http://localhost:4200/#/home/terms', '_blank');
  }

  showbankaccount() {
    window.open('http://localhost:4200/#/home/bankaccounts', '_blank');
  }

  showtransaction() {
    window.open('http://localhost:4200/#/home/transactions', '_blank');
  }

  showjournal() {
    window.open('http://localhost:4200/#/home/journals', '_blank');
  }

}
