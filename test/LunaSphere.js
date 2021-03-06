var LunaSphere = artifacts.require("./LunaSphere.sol");

contract("LunaSphere", function (accounts) {
  it("initialize the contract with the correct values", function () {
    return LunaSphere.deployed()
      .then(function (instance) {
        tokenInstance = instance;
        return tokenInstance.name();
      })
      .then(function (name) {
        assert.equal(name, "LunaSphere", "has the correct name");
        return tokenInstance.symbol();
      })
      .then(function (symbol) {
        assert.equal(symbol, "LNS", "has the correct symbol");
        return tokenInstance.decimals();
      })
      .then(function (decimals) {
        assert.equal(decimals, "9", "has the correct decimals");
      });
  });

  it("set the total supply upon deployment", function () {
    return LunaSphere.deployed()
      .then(function (instance) {
        tokenInstance = instance;
        return tokenInstance.totalSupply();
      })
      .then(function (totalSupply) {
        assert.equal(
          BigInt(totalSupply),
          3000000000000000000,
          "sets the total supply to 1 bill"
        );
        return tokenInstance.balanceOf(accounts[0]);
      })
      .then(function (adminBalance) {
        assert.equal(
          BigInt(adminBalance),
          3000000000000000000,
          "sets the inital balance of the admin"
        );
      });
  });

  it("Transfers Function Working", function () {
    return LunaSphere.deployed()
      .then(function (instance) {
        tokenInstance = instance;
        return tokenInstance.transfer.call(
          accounts[1],
          BigInt(9999999999999999999)
        );
      })
      .then(assert.fail)
      .catch(function (error) {
        assert(
          error.message.indexOf("revert") >= 0,
          "error must contain revert"
        );
        return tokenInstance.transfer.call(accounts[1], 2500000000000000, {
          from: accounts[0],
        });
      })
      .then(function (success) {
        assert.equal(success, true, "it returns true");
        return tokenInstance.transfer(accounts[1], 2500000000000000, {
          from: accounts[0],
        });
      })
      .then(function (receipt) {
        assert.equal(receipt.logs.length, 1, "triggers one event");
        assert.equal(
          receipt.logs[0].event,
          "Transfer",
          "Should be the Tranfer event"
        );
        assert.equal(
          receipt.logs[0].args.from,
          accounts[0],
          "logs the account the tokens are transferred from"
        );
        assert.equal(
          receipt.logs[0].args.to,
          accounts[1],
          "logs the account the tokens are tranferred to"
        );
        assert.equal(
          receipt.logs[0].args.value,
          2500000000000000,
          "logs the transfer amount"
        );
        return tokenInstance.balanceOf(accounts[1]);
      })
      .then(function (balance) {
        assert.equal(
          BigInt(balance),
          2500000000000000,
          "adds the amount receive"
        );
        return tokenInstance.balanceOf(accounts[0]);
      })
      .then(function (balance) {
        assert.equal(
          BigInt(balance),
          2997500000000000000,
          "deducts the amount receive"
        );
      });
  });

  it("approves tokens delegated transfer", function () {
    return LunaSphere.deployed()
      .then(function (instance) {
        tokenInstance = instance;
        return tokenInstance.approve.call(accounts[1], 100);
      })
      .then(function (success) {
        assert.equal(success, true, "returns true");
        return tokenInstance.approve(accounts[1], 100);
      })
      .then(function (receipt) {
        assert.equal(receipt.logs.length, 1, "triggers one event");
        assert.equal(
          receipt.logs[0].event,
          "Approval",
          "Should be the Approval event"
        );
        assert.equal(
          receipt.logs[0].args.owner,
          accounts[0],
          "logs the account the tokens are authorized by"
        );
        assert.equal(
          receipt.logs[0].args.spender,
          accounts[1],
          "logs the account the tokens are authorized to"
        );
        assert.equal(
          receipt.logs[0].args.value,
          100,
          "logs the authorized amount"
        );
        return tokenInstance.allowance(accounts[0], accounts[1]);
      })
      .then(function (allowance) {
        assert.equal(
          allowance.toNumber(),
          100,
          "stores the allowance for delegated transfer"
        );
      });
  });

  it("handles delegated token transfer", function () {
    return LunaSphere.deployed()
      .then(function (instance) {
        tokenInstance = instance;
        fromAccount = accounts[2];
        toAccount = accounts[3];
        spendingAccount = accounts[4];
        //transfers some token to fromAccount
        return tokenInstance.transfer(fromAccount, 100, { from: accounts[0] });
      })
      .then(function (receipt) {
        //Approve spendingAccount to spend 10 tokens from fromAccount
        return tokenInstance.approve(spendingAccount, 10, {
          from: fromAccount,
        });
      })
      .then(function (receipt) {
        return tokenInstance.transferFrom(fromAccount, toAccount, 9999, {
          from: spendingAccount,
        });
      })
      .then(assert.fail)
      .catch(function (error) {
        assert(
          error.message.toString().indexOf("revert") >= 0,
          "Cannot transfer larger than balance"
        );
        //try transfering larger than the approve amount
        return tokenInstance.transferFrom(fromAccount, toAccount, 20, {
          from: spendingAccount,
        });
      })
      .then(assert.fail)
      .catch(function (error) {
        assert(
          error.message.toString().indexOf("revert") >= 0,
          "cannot transfer larger than allowed"
        );
        return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, {
          from: spendingAccount,
        });
      })
      .then(function (success) {
        assert.equal(success, true);
        return tokenInstance.transferFrom(fromAccount, toAccount, 10, {
          from: spendingAccount,
        });
      })
      .then(function (receipt) {
        assert.equal(
          receipt.logs.length,
          2,
          "triggers transfer event and adjust approve event"
        );
        assert.equal(
          receipt.logs[0].event,
          "Transfer",
          "should be the transfer event"
        );
        assert.equal(
          receipt.logs[0].args.from,
          fromAccount,
          "logs the account the tokens are transferred from"
        );
        assert.equal(
          receipt.logs[0].args.to,
          toAccount,
          "logs the account the tokens are tranferred to"
        );
        assert.equal(
          receipt.logs[0].args.value,
          10,
          "logs the transfer amount"
        );
        return tokenInstance.balanceOf(fromAccount);
      })
      .then(function (balance) {
        assert.equal(
          balance.toNumber(),
          90,
          "deducts the amount from the sending account"
        );
        return tokenInstance.balanceOf(toAccount);
      })
      .then(function (balance) {
        assert.equal(
          balance.toNumber(),
          10,
          "adds the amount from the receiving account"
        );
        return tokenInstance.allowance(fromAccount, spendingAccount);
      })
      .then(function (allowance) {
        assert.equal(allowance, 0, "deducts the amount from the allowance");
      });
  });

  it("Mint function working", function () {
    return LunaSphere.deployed()
      .then(function (instance) {
        tokenInstance = instance;
        return tokenInstance.mint.call(1000000);
      })
      .then(function (success) {
        assert.equal(success, true, "it returns true");
        return tokenInstance.mint(1000000);
      })
      .then(function (receipt) {
        assert.equal(receipt.logs.length, 1, "triggers one event");
        assert.equal(
          receipt.logs[0].event,
          "Transfer",
          "Should be the Tranfer event"
        );
        assert.equal(
          receipt.logs[0].args.to,
          accounts[0],
          "logs the account the tokens are tranferred to"
        );
        assert.equal(
          receipt.logs[0].args.value,
          1000000,
          "logs the transfer amount"
        );
        return tokenInstance.balanceOf(accounts[0]);
      })
      .then(function (balance) {
        assert.equal(
          balance,
          2997500000001000000,
          "Must be equal to mint added"
        );
      });
  });
});
