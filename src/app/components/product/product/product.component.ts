import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { ProductService } from './product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  @Input()
  view: number = 1;
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  productID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() productChange = new EventEmitter();

  products = [];
  productsAll = [];
  product = {
    product_ID: 0,
    product_NAME: "",
    product_CODE: "",
    product_NEWCODE: "",
    product_DESC: "",
    quickbook_ID: null,
    netsuite_ID: null,
    productcategory_ID: null,
    isactive: true
  }

  constructor(
    private productservice: ProductService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.products = JSON.parse(window.sessionStorage.getItem('products'));
    this.productsAll = JSON.parse(window.sessionStorage.getItem('productsAll'));
    if (this.view == 1 && this.products == null) {
      this.productGet();
    }

    if (this.productsAll == null) {
      this.productGetAll();
    }

    if (!this.productID && Number(window.sessionStorage.getItem('product'))>0) {
      this.productID = Number(window.sessionStorage.getItem('product'));
    }
    if (this.productID) {
      window.sessionStorage.setItem("product", this.productID);
    }
  }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          width: 136,
          text: 'Refresh',
          onClick: this.productGetAll.bind(this),
        },
      }
    );
  }

  add() {
    this.product = {
      product_ID: 0,
      product_NAME: "",
      product_CODE: "",
      product_NEWCODE: "",
      product_DESC: "",
      quickbook_ID: null,
      netsuite_ID: null,
      productcategory_ID: null,
      isactive: true
    };
  }

  update(row) {
    this.edit.next(row);
  }

  change(productID) {
    for (var i=0; i<this.products.length; i++) {
      if (this.products[i].product_ID == productID) {
        this.productChange.next(this.products[i]);
        break;
      }
    }
  }

  setproducts(response) {
    if (this.view == 1) {
      this.products = response;
      window.sessionStorage.setItem("products", JSON.stringify(this.products));
    } else {
      this.productsAll = response;
      window.sessionStorage.setItem("productsAll", JSON.stringify(this.productsAll));
    }
    this.cancel.next();
  }

  productGet() {
    this.productservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          response = this.productservice.getAllDetail(response);
          this.setproducts(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  productGetAll() {
    this.productservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          response = this.productservice.getAllDetail(response);
          this.setproducts(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  productAdd(product) {
    this.productservice.add(product).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.product_ID) {
          this.toastrservice.success("Success", "New Product Added");
          this.productGet();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  productUpdate(product) {
    if (product.isactive == true) {
      product.isactive = "Y";
    } else {
      product.isactive = "N";
    }
    this.productservice.update(product, product.product_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.product_ID) {
          this.toastrservice.success("Success", " Product Updated");
          this.productGet();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }
}
