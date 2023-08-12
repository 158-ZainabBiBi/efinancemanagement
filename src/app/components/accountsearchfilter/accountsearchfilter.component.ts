import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { AccountComponent } from '../account/account/account.component';
import { BankaccounttypeComponent } from '../lookup/account/bankaccounttype/bankaccounttype.component';
import { TransactiontypeComponent } from '../lookup/account/transactiontype/transactiontype.component';
import { AccounttypeComponent } from '../lookup/account/accounttype/accounttype.component';
import { BankaccountComponent } from '../account/bankaccount/bankaccount.component';
import { ChartofaccountComponent } from '../account/chartofaccount/chartofaccount.component';
import { JournalComponent } from '../account/journal/journal.component';
import { TransactionComponent } from '../account/transaction/transaction.component';
import { CustomerComponent } from '../customer/customer/customer.component';
import { LedgerComponent } from '../account/ledger/ledger.component';
import { TrialbalanceComponent } from '../account/trialbalance/trialbalance.component';
import { BankdepositComponent } from '../account/bankdeposit/bankdeposit.component';
import { BanktransferComponent } from '../account/banktransfer/banktransfer.component';
import { BalancesheetComponent } from '../account/balancesheet/balancesheet.component';
import { IncomestatementComponent } from '../account/incomestatement/incomestatement.component';
import { ProfitandlossComponent } from '../account/profitandloss/profitandloss.component';
import { BusinesstypeComponent } from '../lookup/customer/businesstype/businesstype.component';
import { AccountclassificationComponent } from '../account/accountclassification/accountclassification.component';
import { PaymentmethodComponent } from '../lookup/finance/paymentmethod/paymentmethod.component';
import { CurrencyComponent } from '../lookup/finance/currency/currency.component';

@Component({
  selector: 'app-accountsearchfilter',
  templateUrl: './accountsearchfilter.component.html',
  styleUrls: ['./accountsearchfilter.component.css']
})
export class AccountsearchfilterComponent implements OnInit {
  @ViewChild(BankaccountComponent) bankaccounts;
  @ViewChild(BankdepositComponent) bankdeposits;
  @ViewChild(BanktransferComponent) banktransfers;
  @ViewChild(AccountComponent) accounts;
  @ViewChild(CustomerComponent) customers;
  @ViewChild(TransactionComponent) transactions;
  @ViewChild(LedgerComponent) ledgers;
  @ViewChild(ChartofaccountComponent) chartofaccounts;
  @ViewChild(JournalComponent) journals;
  @ViewChild(TrialbalanceComponent) trialbalances;
  @ViewChild(BankaccounttypeComponent) bankaccounttypes;
  @ViewChild(TransactiontypeComponent) transactiontypes;
  @ViewChild(AccounttypeComponent) accounttypes;
  @ViewChild(BalancesheetComponent) balancesheets;
  @ViewChild(IncomestatementComponent) incomestatements;
  @ViewChild(ProfitandlossComponent) profitandlosses;
  @ViewChild(BusinesstypeComponent) businesstypes;
  @ViewChild(AccountclassificationComponent) accountclassifications;
  @ViewChild(PaymentmethodComponent) paymentmethods;
  @ViewChild(CurrencyComponent) currencies;

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
  accounttype = false;
  @Input()
  chartofaccount = false;
  @Input()
  transaction = false;
  @Input()
  transactiondatefrom = false;
  @Input()
  transactiondateto = false;
  @Input()
  ledger = false;
  @Input()
  bankaccount = false;
  @Input()
  customer = false;
  @Input()
  bankdeposit = false;
  @Input()
  balancesheetrefund = false;
  @Input()
  Chartofaccount = false;
  @Input()
  businesstype = false;
  @Input()
  incomestatement = false;
  @Input()
  profitandloss = false;
  @Input()
  banktransfer = false;
  @Input()
  balancesheet = false;
  @Input()
  accountclassification = false;
  @Input()
  paymentmethod = false;
  @Input()
  currency = false;

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
    accounttype_ID: null,
    chartofaccount_ID: null,
    transaction_ID: null,
    ledger_ID: null,
    journal_ID: null,
    bankdeposit_ID: null,
    balancesheetrefund_ID: null,
    Chartofaccount_ID: null,
    banktransfer_ID: null,
    balancesheet_ID: null,
    incomestatement_ID: null,
    profitandloss_ID: null,
    businesstype_ID: null,
    accountclassification_ID: null,
    currency_ID: null,
    paymentmethod_ID: null,

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
    if (this.bankaccounttypes)
      this.search.bankaccounttype_ID = this.bankaccounttypes.bankaccounttypeID;
    if (this.bankdeposits)
      this.search.bankdeposit_ID = this.bankdeposits.bankdepositID;
    if (this.balancesheets)
      this.search.balancesheet_ID = this.balancesheets.balancesheetID;
    if (this.banktransfers)
      this.search.banktransfer_ID = this.banktransfers.banktransferID;
    if (this.chartofaccounts)
      this.chartofaccounts.chartofaccount_ID = this.chartofaccounts.chartofaccountID;
    if (this.profitandlosses)
      this.profitandlosses.profitandloss_ID = this.profitandlosses.profitandlossID;
    if (this.incomestatements)
      this.incomestatements.incomestatement_ID = this.incomestatements.incomestatementID;
    if (this.businesstypes)
      this.search.businesstype_ID = this.businesstypes.businesstypeID;
    if (this.transactiontypes)
      this.search.transactiontype_ID = this.transactiontypes.transactiontypeID;
    if (this.customers)
      this.search.customer_ID = this.customers.customerID;
    if (this.bankaccounts)
      this.search.bankaccount_ID = this.bankaccounts.bankaccountID;
    if (this.accounttypes)
      this.search.accounttype_ID = this.accounttypes.accounttypeID;
    if (this.chartofaccounts)
      this.chartofaccounts.chartofaccount_ID = this.chartofaccounts.chartofaccountID;
    if (this.ledgers)
      this.ledgers.ledger_ID = this.ledgers.ledgerID;
    if (this.transactions)
      this.transactions.transaction_ID = this.transactions.transactionID;
    if (this.journals)
      this.search.journal_ID = this.journals.journalID;
    if (this.trialbalances)
      this.search.trialbalance_ID = this.trialbalances.trialbalanceID;
    if (this.accountclassifications)
      this.search.accountclassification_ID = this.accountclassifications.accountclassificationID;
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
    if (this.bankaccounttypes)
      this.bankaccounttypes.bankaccounttypeID = null;
    if (this.bankdeposits)
      this.bankdeposits.bankdepositID = null;
    if (this.balancesheets)
      this.balancesheets.balancesheetID = null;
    if (this.banktransfers)
      this.banktransfers.banktransferID = null;
    if (this.chartofaccounts)
      this.chartofaccounts.chartofaccountID = null;
    if (this.profitandlosses)
      this.profitandlosses.profitandlossID = null;
    if (this.incomestatements)
      this.incomestatements.incomestatementID = null;
    if (this.businesstypes)
      this.businesstypes.businesstypeID = null;
    if (this.transactiontypes)
      this.transactiontypes.transactiontypeID = null;
    if (this.transactiontypes)
      this.transactiontypes.transactiontypeID = null;
    if (this.customers)
      this.customers.customerID = null;
    if (this.bankaccounts)
      this.bankaccounts.bankaccountID = null;
    if (this.chartofaccounts)
      this.chartofaccounts.chartofaccountID = null;
    if (this.ledgers)
      this.ledgers.ledgerID = null;
    if (this.transactions)
      this.transactions.transactionID = null;
    if (this.accounttypes)
      this.accounttypes.accounttypeID = null;
    if (this.journals)
      this.journals.journalID = null;
    if (this.trialbalances)
      this.trialbalances.trialbalanceID = null;
    if (this.accountclassifications)
      this.accountclassifications.accountclassificationID = null;
    if (this.paymentmethods)
      this.paymentmethods.paymentmethodID = null;
    if (this.currencies)
      this.currencies.currencyID = null;

    this.search.transaction_DATEFROM = null;
    this.search.transaction_DATETO = null;
  }

}
