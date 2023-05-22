import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { AccountComponent } from '../account/account/account.component';
import { BankaccounttypeComponent } from '../lookup/account/bankaccounttype/bankaccounttype.component';
import { TransactiontypeComponent } from '../lookup/account/transactiontype/transactiontype.component';
import { LedgeraccounttypeComponent } from '../lookup/account/ledgeraccounttype/ledgeraccounttype.component';
import { BankaccountComponent } from '../account/bankaccount/bankaccount.component';
import { CoaaccountComponent } from '../account/coaaccount/coaaccount.component';
import { JournalComponent } from '../account/journal/journal.component';
import { TransactionComponent } from '../account/transaction/transaction.component';
import { CustomerComponent } from '../customer/customer/customer.component';
import { LedgeraccountComponent } from '../account/ledgeraccount/ledgeraccount.component';
import { TrialbalanceComponent } from '../account/trialbalance/trialbalance.component';

@Component({
  selector: 'app-accountsearchfilter',
  templateUrl: './accountsearchfilter.component.html',
  styleUrls: ['./accountsearchfilter.component.css']
})
export class AccountsearchfilterComponent implements OnInit {
  @ViewChild(AccountComponent) accounts;
  @ViewChild(CustomerComponent) customers;
  @ViewChild(BankaccountComponent) bankaccounts;
  @ViewChild(TransactionComponent) transactions;
  @ViewChild(LedgeraccountComponent) ledgeraccounts;
  @ViewChild(CoaaccountComponent) coaaccounts;
  @ViewChild(JournalComponent) journals;
  @ViewChild(TrialbalanceComponent) trialbalances;

  @ViewChild(BankaccounttypeComponent) bankaccounttypes;
  @ViewChild(TransactiontypeComponent) transactiontypes;
  @ViewChild(LedgeraccounttypeComponent) ledgeraccounttypes;

  @Input()
  account: boolean = false;
  @Input()
  bankaccounttype = false;
  @Input()
  trialbalance = false;
  @Input()
  customerrefund = false;
  @Input()
  transactiontype = false;
  @Input()
  journal = false;
  @Input()
  ledgeraccounttype = false;
  @Input()
  coaaccount = false;
  @Input()
  transaction = false;
  @Input()
  ledgeraccount = false;
  @Input()
  bankaccount = false;
  @Input()
  customer = false;

  @Output() advancedSearch = new EventEmitter();
  @Output() advancedSearchAll = new EventEmitter();

  search = {
    account_ID: null,
    bankaccounttype_ID: null,
    trialbalance_ID: null,
    customerrefund_ID: null,

    transactiontype_ID: null,
    bankaccount_ID: null,
    customer_ID: null,
    ledgeraccounttype_ID: null,
    coaaccount_ID: null,
    transaction_ID: null,
    ledgeraccount_ID: null,
    journal_ID: null
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

    if (this.customers)
      this.search.customer_ID = this.customers.customerID;
    if (this.bankaccounts)
      this.search.bankaccount_ID = this.bankaccounts.bankaccountID;
    if (this.ledgeraccounttypes)
      this.search.ledgeraccounttype_ID = this.ledgeraccounttypes.ledgeraccounttypeID;
    if (this.transactiontypes)
      this.transactiontypes.transactiontype_ID = this.transactiontypes.transactiontypeID;
    if (this.coaaccounts)
      this.coaaccounts.coaaccount_ID = this.coaaccounts.coaaccountID;
    if (this.ledgeraccounts)
      this.ledgeraccounts.ledgeraccount_ID = this.ledgeraccounts.ledgeraccountID;
    if (this.transactions)
      this.transactions.transaction_ID = this.transactions.transactionID;
    if (this.journals)
      this.search.journal_ID = this.journals.journalID;
    if (this.trialbalances)
      this.search.trialbalance_ID = this.trialbalances.trialbalanceID;


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

    if (this.transactiontypes)
      this.transactiontypes.transactiontypeID = null;
    if (this.customers)
      this.customers.customerID = null;
    if (this.bankaccounts)
      this.bankaccounts.bankaccountID = null;
    if (this.coaaccounts)
      this.coaaccounts.coaaccountID = null;
    if (this.ledgeraccounts)
      this.ledgeraccounts.ledgeraccountID = null;
    if (this.transactions)
      this.transactions.transactionID = null;
    if (this.ledgeraccounttypes)
      this.ledgeraccounttypes.ledgeraccounttypeID = null;
    if (this.journals)
      this.journals.journalID = null;
    if (this.trialbalances)
      this.trialbalances.trialbalanceID = null;
  }

}
