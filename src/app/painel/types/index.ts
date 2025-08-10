export interface Wallet {
  id: string;
  balance: number;
  coin: {
    symbol: string;
    name: string;
  };
}

export interface TransactionUser {
  id: string;
  email: string;
  name: string;
}

export interface TransactionCoin {
  id: string;
  symbol: string;
  name: string;
}

export interface TransactionType {
  id: string;
  type: string;
  description: string;
}

export interface Transaction {
  id: string;
  fromCoin: TransactionCoin;
  toCoin: TransactionCoin;
  amountFrom: number;
  amountTo: number;
  userId: string;
  userFrom: TransactionUser;
  userTo: TransactionUser;
  type: TransactionType;
  createdAt: string;
}