import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { AccountComponent } from '../account/account/account.component';
import { BankaccountComponent } from '../account/bankaccount/bankaccount.component';
import { JournalComponent } from '../account/journal/journal.component';
import { TransactionComponent } from '../account/transaction/transaction.component';
import { CustomerComponent } from '../customer/customer/customer.component';
import { LedgerComponent } from '../account/ledger/ledger.component';
import { AccountclassificationComponent } from '../account/accountclassification/accountclassification.component';

import { BankaccounttypeComponent } from '../lookup/account/bankaccounttype/bankaccounttype.component';
import { TransactiontypeComponent } from '../lookup/account/transactiontype/transactiontype.component';
import { AccounttypeComponent } from '../lookup/account/accounttype/accounttype.component';
import { BusinesstypeComponent } from '../lookup/customer/businesstype/businesstype.component';
import { PaymentmethodComponent } from '../lookup/finance/paymentmethod/paymentmethod.component';
import { CurrencyComponent } from '../lookup/finance/currency/currency.component';

@Component({
  selector: 'app-accountsearchfilter',
  templateUrl: './accountsearchfilter.component.html',
  styleUrls: ['./accountsearchfilter.component.css']
})
export class AccountsearchfilterComponent implements OnInit {
  @ViewChild(BankaccountComponent) bankaccounts;
  @ViewChild(AccountComponent) accounts;
  @ViewChild(CustomerComponent) customers;
  @ViewChild(TransactionComponent) transactions;
  @ViewChild(LedgerComponent) ledgers;
  @ViewChild(JournalComponent) journals;
  @ViewChild(AccountclassificationComponent) accountclassifications;

  @ViewChild(BankaccounttypeComponent) bankaccounttypes;
  @ViewChild(TransactiontypeComponent) transactiontypes;
  @ViewChild(AccounttypeComponent) accounttypes;
  @ViewChild(BusinesstypeComponent) businesstypes;
  @ViewChild(PaymentmethodComponent) paymentmethods;
  @ViewChild(CurrencyComponent) currencies;

  @Input()
  account: boolean = false;
  @Input()
  journal = false;
  @Input()
  transaction = false;
  @Input()
  ledger = false;
  @Input()
  bankaccount = false;
  @Input()
  customer = false;
  @Input()
  accountclassification = false;

  @Input()
  paymentmethod = false;
  @Input()
  currency = false;
  @Input()
  bankaccounttype = false;
  @Input()
  transactiontype = false;
  @Input()
  accounttype = false;
  @Input()
  businesstype = false;

  @Input()
  transactiondatefrom = false;
  @Input()
  transactiondateto = false;

  @Output() advancedSearch = new EventEmitter();
  @Output() advancedSearchAll = new EventEmitter();

  search = {
    account_ID: null,
    bankaccount_ID: null,
    customer_ID: null,
    transaction_ID: null,
    ledger_ID: null,
    journal_ID: null,
    accountclassification_ID: null,

    transactiontype_ID: null,
    accounttype_ID: null,
    businesstype_ID: null,
    currency_ID: null,
    paymentmethod_ID: null,
    bankaccounttype_ID: null,

    transaction_DATEFROM: null,
    transaction_DATETO: null,
  };
  isall = false;

  constructor(
  ) { }

  ngOnInit(): void {
  }

  accountsearchfilter() {
    if (this.accounts)
      this.search.account_ID = this.accounts.accountID;
    if (this.customers)
      this.search.customer_ID = this.customers.customerID;
    if (this.bankaccounts)
      this.search.bankaccount_ID = this.bankaccounts.bankaccountID;
    if (this.ledgers)
      this.ledgers.ledger_ID = this.ledgers.ledgerID;
    if (this.transactions)
      this.transactions.transaction_ID = this.transactions.transactionID;
    if (this.journals)
      this.search.journal_ID = this.journals.journalID;
    if (this.accountclassifications)
      this.search.accountclassification_ID = this.accountclassifications.accountclassificationID;

    if (this.bankaccounttypes)
      this.search.bankaccounttype_ID = this.bankaccounttypes.bankaccounttypeID;
    if (this.businesstypes)
      this.search.businesstype_ID = this.businesstypes.businesstypeID;
    if (this.transactiontypes)
      this.search.transactiontype_ID = this.transactiontypes.transactiontypeID;
    if (this.accounttypes)
      this.search.accounttype_ID = this.accounttypes.accounttypeID;
    if (this.paymentmethods)
      this.search.paymentmethod_ID = this.paymentmethods.paymentmethodID;
    if (this.currencies)
      this.search.currency_ID = this.currencies.currencyID;

    if (this.isall == true)
      this.advancedSearchAll.next(this.search);
    else
      this.advancedSearch.next(this.search);
  }

  reset() {
    if (this.accounts)
      this.accounts.accountID = null;
    if (this.customers)
      this.customers.customerID = null;
    if (this.bankaccounts)
      this.bankaccounts.bankaccountID = null;
    if (this.ledgers)
      this.ledgers.ledgerID = null;
    if (this.transactions)
      this.transactions.transactionID = null;
    if (this.journals)
      this.journals.journalID = null;
    if (this.accountclassifications)
      this.accountclassifications.accountclassificationID = null;

    if (this.bankaccounttypes)
      this.bankaccounttypes.bankaccounttypeID = null;
    if (this.businesstypes)
      this.businesstypes.businesstypeID = null;
    if (this.transactiontypes)
      this.transactiontypes.transactiontypeID = null;
    if (this.transactiontypes)
      this.transactiontypes.transactiontypeID = null;
    if (this.accounttypes)
      this.accounttypes.accounttypeID = null;
    if (this.paymentmethods)
      this.paymentmethods.paymentmethodID = null;
    if (this.currencies)
      this.currencies.currencyID = null;

    this.search.transaction_DATEFROM = null;
    this.search.transaction_DATETO = null;
  }

}
