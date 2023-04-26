import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { AccountComponent } from '../finance/account/account.component';
import { BankaccounttypeComponent } from '../lookup/bankaccounttype/bankaccounttype.component';
import { ReturnauthComponent } from '../account/returnauth/returnauth.component';
import { CustomerrefundComponent } from '../account/customerrefund/customerrefund.component';

import { CardtypeComponent } from '../lookup/cardtype/cardtype.component';
import { RefundmethodComponent } from '../lookup/refundmethod/refundmethod.component';
import { PostingperiodComponent } from '../lookup/postingperiod/postingperiod.component';
import { ReturnstatusComponent } from '../lookup/returnstatus/returnstatus.component';
import { SaleordertypeComponent } from '../lookup/saleordertype/saleordertype.component';
import { CurrencysymbolreplacementComponent } from '../lookup/currencysymbolreplacement/currencysymbolreplacement.component'

import { GeneralratetypeComponent } from '../lookup/generalratetype/generalratetype.component';
import { CashflowratetypeComponent } from '../lookup/cashflowratetype/cashflowratetype.component';

@Component({
  selector: 'app-accountsearchfilter',
  templateUrl: './accountsearchfilter.component.html',
  styleUrls: ['./accountsearchfilter.component.css']
})
export class AccountsearchfilterComponent implements OnInit {
  @ViewChild(AccountComponent) accounts;
  @ViewChild(BankaccounttypeComponent) bankaccounttypes;
  @ViewChild(ReturnauthComponent) returnauths;
  @ViewChild(CustomerrefundComponent) customerrefunds

  @ViewChild(CardtypeComponent) cardtypes;
  @ViewChild(RefundmethodComponent) refundmethods;
  @ViewChild(GeneralratetypeComponent) generalratetypes;
  @ViewChild(CashflowratetypeComponent) cashflowratetypes;
  @ViewChild(PostingperiodComponent) postingperiods;
  @ViewChild(ReturnstatusComponent) returnstatuss;
  @ViewChild(SaleordertypeComponent) saleordertypes;
  @ViewChild(CurrencysymbolreplacementComponent) currencysymbolreplacements;

  @Input()
  account: boolean = false;
  @Input()
  bankaccounttype = false;
  @Input()
  returnauth = false;
  @Input()
  customerrefund = false;
  @Input()
  cardtype = false;
  @Input()
  currencysymbolreplacement = false;
  @Input()
  refundmethod = false;
  @Input()
  saleordertype = false;
  @Input()
  postingperiod = false;
  @Input()
  returnstatus = false;
  @Input()
  cashflowratetype = false;
  @Input()
  generalratetype = false;

  @Output() advancedSearch = new EventEmitter();
  @Output() advancedSearchAll = new EventEmitter();

  search = {
    account_ID: null,
    bankaccounttype_ID: null,
    returnauth_ID: null,
    customerrefund_ID: null,

    cardtype_ID: null,
    cashflowratetype_ID: null,
    generalratetype_ID: null,
    refundmethod_ID: null,
    saleordertype_ID: null,
    postingperiod_ID: null,
    returnstatus_ID: null,
    currencysymbolreplacement_ID: null
  };
  isall = false;

  constructor(
  ) { }

  ngOnInit(): void {
  }

  accountsearchfilter() {
    if (this.accounts)
      this.search.account_ID = this.accounts.accountID;
    if (this.bankaccounttypes)
      this.search.bankaccounttype_ID = this.bankaccounttypes.bankaccounttypeID;
    if (this.returnauths)
      this.search.returnauth_ID = this.returnauths.returnauthID;
    if (this.customerrefunds)
      this.search.customerrefund_ID = this.customerrefunds.customerrefundID;

    if (this.generalratetypes)
      this.search.generalratetype_ID = this.generalratetypes.generalratetypeID;
    if (this.cashflowratetypes)
      this.search.cashflowratetype_ID = this.cashflowratetypes.cashflowratetypeID;
    if (this.refundmethods)
      this.search.refundmethod_ID = this.refundmethods.refundmethodID;
    if (this.cardtypes)
      this.cardtypes.cardtype_ID = this.cardtypes.cardtypeID;
    if (this.saleordertypes)
      this.saleordertypes.saleordertype_ID = this.saleordertypes.saleordertypeID;
    if (this.returnstatuss)
      this.returnstatuss.returnstatus_ID = this.returnstatuss.returnstatusID;
    if (this.postingperiods)
      this.postingperiods.postingperiod_ID = this.postingperiods.postingperiodID;
    if (this.currencysymbolreplacements)
      this.search.currencysymbolreplacement_ID = this.currencysymbolreplacements.currencysymbolreplacementID;


    if (this.isall == true)
      this.advancedSearchAll.next(this.search);
    else
      this.advancedSearch.next(this.search);
  }

  reset() {
    if (this.accounts)
      this.accounts.accountID = null;
    if (this.bankaccounttypes)
      this.bankaccounttypes.bankaccounttypeID = null;
    if (this.returnauths)
      this.returnauths.returnauthID = null;
    if (this.customerrefunds)
      this.customerrefunds.customerrefundID = null;

    if (this.cardtypes)
      this.cardtypes.cardtypeID = null;
    if (this.generalratetypes)
      this.generalratetypes.generalratetypeID = null;
    if (this.cashflowratetypes)
      this.cashflowratetypes.cashflowratetypeID = null;
    if (this.saleordertypes)
      this.saleordertypes.saleordertypeID = null;
    if (this.returnstatuss)
      this.returnstatuss.returnstatusID = null;
    if (this.postingperiods)
      this.postingperiods.postingperiodID = null;
    if (this.refundmethods)
      this.refundmethods.refundmethodID = null;
    if (this.currencysymbolreplacements)
      this.currencysymbolreplacements.currencysymbolreplacementID = null;
  }

}
