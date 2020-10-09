class Bank {
  constructor(bankName, location) {
    this.bankName = bankName;
    this.location = location;
  }
}

class QueueCounter {
  constructor(number = 1) {
    this.number = parseFloat(number);
    this.queueNumber = [];
    this.queueName = [];
  }

  addToQueue(customer) {
    this.queueNumber.push(`${this.number}`);
    this.queueName.push(`${customer.name}`);
    customer.queueNumber = this.number;
    this.number++;

    return `Queue ${this.number - 1} : ${customer.name}`;
  }

  getNextQueueName() {
    return this.queueName[0];
  }

  shiftToQueue() {
    this.queueNumber.shift();
    this.queueName.shift();
    return `Next queue number : ${this.queueNumber[0]}`;
  }
}

class BankStaff {
  constructor(name, position) {
    this.name = name;
    this.position = position;
  }
}

class Security extends BankStaff {
  constructor(name, position = "Security") {
    super(name, position);
  }

  // Security helped Customer to add them into queue
  register(QC, customer) {
    if (customer.queueNumber === null) {
      console.log(`Adding ${customer.name} to Queue`);
      return QC.addToQueue(customer);
    } else {
      return `${customer.name} already have a queue number.`;
    }
  }
}

class Teller extends BankStaff {
  constructor(
    name,
    position = "Teller",
    serveStatus = false,
    queueNumberServed = null,
    nameServed = null
  ) {
    super(name, position);
    this.serveStatus = serveStatus;
    this.queueNumberServed = queueNumberServed;
    this.nameServed = nameServed;
  }

  // Teller call next customer in queue if teller available and serve no one
  callQueue(QC) {
    if (this.serveStatus === false) {
      if (this.queueNumberServed === null && this.nameServed === null) {
        console.log(`Calling next Queue!`);
        // Serve next customer
        return this.serve(QC, QC.getNextQueueName());
      }
    }
  }

  // Serve next customer
  serve(QC, customer) {
    this.serveStatus = true;
    this.queueNumberServed = parseFloat(QC.queueNumber[0]);
    this.nameServed = customer;
    console.log(`Serving queue number ${this.queueNumberServed} : ${customer}`);
    return QC.shiftToQueue();
  }
}

class Customer {
  constructor(name, cashOwned, moneyInAccount, queueNumber = null) {
    this.name = name;
    this.cashOwned = cashOwned;
    this.moneyInAccount = moneyInAccount;
    this.queueNumber = queueNumber;
  }

  // Check balance - can only be done if customer served by teller
  checkBalance(teller) {
    if (
      teller.nameServed === this.name &&
      teller.queueNumberServed === this.queueNumber
    ) {
      return `${this.name}'s balance : Rp${this.moneyInAccount},00`;
    } else {
      return `${this.name} is not served by any teller yet! Please take queue number or please wait if you already have queue number.`;
    }
  }

  // Deposit - can only be done if customer served by teller
  deposit(teller, ammount) {
    if (
      teller.nameServed === this.name &&
      teller.queueNumberServed === this.queueNumber
    ) {
      if (ammount <= this.cashOwned) {
        this.moneyInAccount += ammount;
        this.cashOwned -= ammount;

        return `${this.name} deposited Rp${ammount},00. Thank you for your transaction.`;
      } else {
        return `Deposit rejected! ${this.name} don't have enough cash.`;
      }
    } else {
      return `${this.name} is not served by any teller yet! Please take queue number or please wait if you already have queue number.`;
    }
  }

  // Withdraw - can only be done if customer served by teller
  withdraw(teller, ammount) {
    if (
      teller.nameServed === this.name &&
      teller.queueNumberServed === this.queueNumber
    ) {
      if (ammount <= this.moneyInAccount) {
        this.moneyInAccount -= ammount;
        this.cashOwned += ammount;

        return `${this.name} withdraw Rp${ammount},00. Thank you for your transaction.`;
      } else {
        return `Withdraw rejected! ${this.name} don't have enough money in account.`;
      }
    } else {
      return `${this.name} is not served by any teller yet! Please take queue number or please wait if you already have queue number.`;
    }
  }

  // Transfer - can only be done if customer served by teller
  transfer(teller, ammount, destination) {
    if (
      teller.nameServed === this.name &&
      teller.queueNumberServed === this.queueNumber
    ) {
      if (ammount <= this.moneyInAccount) {
        this.moneyInAccount -= ammount;
        destination.moneyInAccount += ammount;

        return `${this.name} transfer Rp${ammount},00 to ${destination.name}. Thank you for your transaction.`;
      } else {
        return `Transfer rejected! ${this.name} don't have enough money in account.`;
      }
    } else {
      return `${this.name} is not served by any teller yet! Please take queue number or please wait if you already have queue number.`;
    }
  }

  // End transaction with teller
  finishTransaction(teller) {
    if (
      teller.nameServed === this.name &&
      teller.queueNumberServed === this.queueNumber
    ) {
      this.queueNumber = null;
      teller.serveStatus = false;
      teller.nameServed = null;
      teller.queueNumberServed = null;

      return `${teller.name} : Transaction with ${this.name} finished. Thank you for trusting us.`;
    }
  }
}

let BCA = new Bank("BCA", "KCP Yogyakarta");
let QC = new QueueCounter();
let Yoga = new Security("Yoga");
let Citra = new Teller("Citra");
let Jack = new Customer("Jack", 10000000, 250000);
let Jill = new Customer("Jill", 5000000, 300000);

console.log(Yoga.register(QC, Jack)); // Adding Jack to Queue
// Queue 1 : Jack
console.log(Yoga.register(QC, Jill)); // Adding Jill to Queue
// Queue 2 : Jill
console.log(Yoga.register(QC, Jill)); // Jill already have a queue number.
console.log(Citra.callQueue(QC)); // Calling next Queue!
// Serving queue number 1 : Jack
// Next queue number : 2
console.log(Jack.checkBalance(Citra)); // Jack's balance : Rp250000,00
console.log(Jack.deposit(Citra, 12000000)); // Deposit rejected! Jack don't have enough cash.
console.log(Jack.deposit(Citra, 1000000)); // Jack deposited Rp1000000,00. Thank you for your transaction.
console.log(Jack.withdraw(Citra, 3000000)); // Withdraw rejected! Jack don't have enough money in account.
console.log(Jack.transfer(Citra, 500000, Jill)); // Jack transfer Rp500000,00 to Jill. Thank you for your transaction.
console.log(Jack.finishTransaction(Citra)); // Citra : Transaction with Jack finished. Thank you for trusting us.
console.log(Citra.callQueue(QC)); // Calling next Queue!
// Serving queue number 2 : Jill
// Next queue number : undefined
console.log(Jill.checkBalance(Citra)); // Jill's balance : Rp800000,00
console.log(Jill.withdraw(Citra, 200000)); // Jill withdraw Rp200000,00. Thank you for your transaction.

// Test - Failed transaction if not served by any teller.
console.log(Jack.checkBalance(Citra));
console.log(Jack.deposit(Citra, 100000));
console.log(Jack.withdraw(Citra, 100000));
console.log(Jack.transfer(Citra, 50000, Jill));
