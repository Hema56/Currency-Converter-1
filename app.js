const BASE_URL ="https://latest.currency-api.pages.dev/v1/currencies/eur.json";

const dropdowns = document.querySelectorAll(".dropdown select");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const btn = document.querySelector("form button");

for (let select of dropdowns) {
  for (let currCode of Object.keys(countryList)) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}  

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc; 
};



const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }
  const URL = `https://api.exchangerate-api.com/v4/latest/${fromCurr.value}`;
  try {
    let response = await fetch(URL);
    if (!response.ok) {
      throw new Error("Failed to fetch exchange rates.");
    }
    let data = await response.json();
    let rate = data.rates[toCurr.value];
    if (!rate) throw new Error("Currency rate not found.");
    let finalAmount = amtVal * rate;
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
  } catch (error) {
    msg.innerText = `Error: ${error.message}`;
  }
};


btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});
    

window.addEventListener("load", () => {
  for ( let select of dropdowns){
    updateFlag(select);
  }
  updateExchangeRate();
});


