class Bank {
  constructor(bankName, location, ammountOfTotalMoneyStored = 0) {
    this.bankName = bankName;
    this.location = location;
    this.ammountOfTotalMoneyStored = ammountOfTotalMoneyStored;
  }
}

class Account extends Bank {
  constructor(id, ownerName, bankName, location, ammountOfTotalMoneyStored) {
    super(bankName, location, (ammountOfTotalMoneyStored = 0));
    this.id = id;
    this.ownerName = ownerName;
  }
}

class QueueCounter {
  constructor(number = 1) {
    this.number = number;
    this.queue = [];
  }

  addToQueue(customer) {
    this.queue.push(`${this.number}`);
    customer.queueNumber = this.number;
    this.number++;

    return `Queue ${this.number - 1} : ${customer.name}`;
  }
}

class BankStaff {
  constructor(name, position) {
    this.name = name;
    this.position = position;
  }
}

class Security extends BankStaff {
  constructor(name, position = "security") {
    super(name, position);
  }

  register(QC, name) {
    console.log(`Adding ${name.name} to Queue`);
    return QC.addToQueue(name);
  }
}

class Teller extends BankStaff {
  constructor(name, position = "teller", serveStatus = false) {
    super(name, position);
    this.serveStatus = serveStatus;
  }
}

class Customer {
  constructor(name, moneyOwned, accountID, queueNumber) {
    this.name = name;
    this.moneyOwned = moneyOwned;
    this.accountID = accountID;
    this.queueNumber = queueNumber;
  }
}

let BCA = new Bank("BCA", "KCP Yogyakarta");
let QC = new QueueCounter();
let Yoga = new Security("Yoga");
let Citra = new Teller("Citra");
let Jack = new Customer("Jack", 1000000);

console.log(BCA);
console.log(QC);
console.log(Yoga);
console.log(Citra);
console.log(Jack);
console.log(Yoga.register(QC, Jack));
