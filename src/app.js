//Initialize Moralis
Moralis.initialize("Zui8PUN4j9XzLudxaVhmRtOkFpYOw6QEAN5HgGWc");
Moralis.serverURL = "https://qni07wc4t0vc.usemoralis.com:2053/server";

window.addEventListener("load", function () {
  if (typeof web3 !== "undefined") {
    console.log("web3 is enabled");
    if (web3.currentProvider.isMetaMask === true) {
      console.log("MetaMask is active");
    } else {
      console.log("MetaMask is not available");
    }
  } else {
    console.log("web3 is not found");
    this.alert("Metamask not installed");
  }
});

var account;
var _bnbBalance;
var _lnsBalance;
async function login() {
  try {
    const currentUser = Moralis.User.current();
    if (!currentUser) {
      currentUser = await Moralis.Web3.authenticate().then(function (user) {
        account = user.get("ethAddress");
        console.log(user.get("ethAddress"));
        getAccount();
      });
    } else if (currentUser) {
      currentUser = await Moralis.User.currentAsync().then(function (user) {
        // do stuff with your user
        account = user.get("ethAddress");
        console.log(user.get("ethAddress"));
        getAccount();
      });
    }
    // show account
  } catch (error) {}
}

async function logout() {
  await Moralis.User.logOut();
  console.log("logged out");
}

const ethereumButton = document.querySelector(".enableEth");
const showAccount = document.querySelector(".showAccount");
const showBNBBalances = document.querySelector(".showBNBBalances");
const showLNSBalances = document.querySelector(".showLNSBalances");
const logoutBtn = document.querySelector(".logout");

ethereumButton.addEventListener("click", () => {
  login();
});

showAccount.addEventListener("click", () => {
  console.log("Log-out button click");
  dropdownFunction();
});

logoutBtn.addEventListener("click", () => {
  logout();
  location.reload();
});

function dropdownFunction() {
  document.getElementById("addressDropdown").classList.toggle("show");
}

window.onclick = function (event) {
  if (!event.target.matches(".showAccount")) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
};

async function getAccount() {
  console.log("getacount");
  document.getElementById("btnhide").classList.add("hide");
  document.getElementById("hideAcc").classList.remove("hide");
  document.getElementById("hideAcc").classList.add("show");
  getBalance();
  showAccount.innerHTML = account;

  // Moralis.Web3.authenticate().then(function (user) {
  //   console.log(user.get("ethAddress"));
  //   account = user.get("ethAddress");
  //   console.log("Running Authenticate");
  //   showAccount.innerHTML = account;
  // });
}

async function getBalance() {
  //get bnb blance
  const bnbBalances = await Moralis.Web3.getERC20({
    chain: "bsc testnet",
    symbol: "BNB",
  });
  let decbnbBalances = Web3.utils.fromWei(bnbBalances.balance, "ether");
  _bnbBalance = decbnbBalances + " BNB";

  showBNBBalances.innerHTML = "Balance: " + _bnbBalance;

  const lnsBalances = await Moralis.Web3.getERC20({
    chain: "bsc testnet",
    tokenAddress: "0x0dd3597b28C6696bAa15121d6CC75B65d2E0fEd2",
  });

  let declnsBalances = Web3.utils.fromWei(lnsBalances.balance, "shannon");
  _lnsBalance = declnsBalances + " LNS";
  console.log(lnsBalances);

  showLNSBalances.innerHTML = "Balance: " + _lnsBalance;
}
