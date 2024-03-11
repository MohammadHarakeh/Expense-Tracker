document.addEventListener("DOMContentLoaded", function () {
  const rangeSlider = document.getElementById("rangeSlider");
  const output = document.getElementById("output");
  const userInputContainer = document.getElementById("user-inputs-wrapper");
  const create = document.getElementById("create");
  const amount = document.getElementById("amount");
  const totalBalance = document.getElementById("total-balance");
  const totalIncome = document.querySelector(".total-income h1");
  const totalExpense = document.querySelector(".total-expense h1");
  const filterType = document.getElementById("filter-type");
  const currencyFilter = document.getElementById("currency-filter");

  let totalBalanceValue = 0;
  let totalIncomeValue = 0;
  let totalExpenseValue = 0;

  totalBalance.querySelector("h1").textContent = totalBalanceValue + " USD";
  totalIncome.textContent = totalIncomeValue.toFixed(2) + " USD";
  totalExpense.textContent = totalExpenseValue.toFixed(2) + " USD";

  // Slider functionality
  noUiSlider.create(rangeSlider, {
    start: [-10000, 10000],
    connect: true,
    range: {
      min: -10000,
      max: 10000,
    },
  });

  rangeSlider.noUiSlider.on("update", function (values) {
    let minValue = parseInt(values[0]);
    let maxValue = parseInt(values[1]);
    output.textContent = "Selected range: " + minValue + " to " + maxValue;

    Array.from(userInputContainer.children).forEach(function (userInputDiv) {
      let amountValue = parseInt(
        userInputDiv.textContent.split(" ")[0].replace("USD", "")
      );

      if (amountValue >= minValue && amountValue <= maxValue) {
        userInputDiv.style.display = "flex";
      } else {
        userInputDiv.style.display = "none";
      }
    });
  });

  filterType.addEventListener("change", filter);

  function filter() {
    const selectedFilter = filterType.value;

    Array.from(userInputContainer.children).forEach(function (userInputDiv) {
      let amountValue = parseInt(
        userInputDiv.textContent.split(" ")[0].replace("USD", "")
      );

      if (selectedFilter === "income" && amountValue >= 0) {
        userInputDiv.style.display = "flex";
      } else if (selectedFilter === "expense" && amountValue < 0) {
        userInputDiv.style.display = "flex";
      } else if (selectedFilter === "all") {
        userInputDiv.style.display = "flex";
      } else {
        userInputDiv.style.display = "none";
      }
    });
  }

  loadFromLocalStorage();

  function createAndAppendUserInput(amountValue, description) {
    let userInputDiv = document.createElement("div");
    let fontIconsDiv = document.createElement("div");
    let trashIcon = document.createElement("i");
    let editIcon = document.createElement("i");
    userInputDiv.dataset.originalAmount = amountValue;

    trashIcon.className = "fa-solid fa-trash";
    editIcon.className = "fa-solid fa-pen-to-square";

    userInputDiv.className = "user-inputs";
    fontIconsDiv.className = "font-icons-div";

    userInputDiv.innerHTML = `<span class = "input-user-amount">${(
      amountValue || 0
    ).toFixed(
      2
    )} USD</span class = "input-user-description"> <span>${description}</span>`;

    userInputContainer.appendChild(userInputDiv);
    userInputDiv.appendChild(fontIconsDiv);
    fontIconsDiv.appendChild(trashIcon);
    fontIconsDiv.appendChild(editIcon);

    editIcon.addEventListener("click", function () {
      const oldAmount = parseFloat(userInputDiv.dataset.originalAmount);
      const newAmount = parseFloat(prompt("Enter the new amount: "));
      const newDescription = prompt("Enter the new description: ");

      if (!isNaN(newAmount) && newAmount !== 0 && newDescription !== null) {
        const amountElement = userInputDiv.querySelector(".input-user-amount");
        const descriptionElement =
          userInputDiv.lastElementChild.previousElementSibling;

        if (amountElement && descriptionElement) {
          if (oldAmount < 0) {
            totalExpenseValue -= oldAmount;
            totalExpense.textContent = totalExpenseValue.toFixed(2) + " USD";
          } else {
            totalIncomeValue -= oldAmount;
            totalIncome.textContent = totalIncomeValue.toFixed(2) + " USD";
          }

          totalBalanceValue -= oldAmount;

          if (newAmount < 0) {
            userInputDiv.style.backgroundColor = "#ff4848";
            totalExpenseValue += newAmount;
            totalExpense.textContent = totalExpenseValue.toFixed(2) + " USD";
          } else {
            userInputDiv.style.backgroundColor = "rgb(43, 255, 43)";
            totalIncomeValue += newAmount;
            totalIncome.textContent = totalIncomeValue.toFixed(2) + " USD";
          }

          totalBalanceValue += newAmount;

          amountElement.textContent = newAmount.toFixed(2) + " USD";
          descriptionElement.textContent = newDescription;

          userInputDiv.dataset.originalAmount = newAmount;

          updateTotalBalance();
          saveToLocalStorage();
        }
      }
    });

    trashIcon.addEventListener("click", function () {
      const originalAmount = parseFloat(userInputDiv.dataset.originalAmount);

      if (originalAmount < 0) {
        totalExpenseValue -= originalAmount;
        totalExpense.textContent = totalExpenseValue.toFixed(2) + " USD";
      } else {
        totalIncomeValue -= originalAmount;
        totalIncome.textContent = totalIncomeValue.toFixed(2) + " USD";
      }

      totalBalanceValue -= originalAmount;
      userInputContainer.removeChild(userInputDiv);

      updateTotalBalance();
      saveToLocalStorage();
    });

    if (amountValue < 0) {
      userInputDiv.style.backgroundColor = "#ff4848";
      totalExpenseValue += amountValue;
      totalExpense.textContent = totalExpenseValue.toFixed(2) + " USD";
    } else {
      userInputDiv.style.backgroundColor = "rgb(43, 255, 43)";
      totalIncomeValue += amountValue;
      totalIncome.textContent = totalIncomeValue.toFixed(2) + " USD";
    }

    totalBalanceValue += amountValue;
    updateTotalBalance();
  }

  create.addEventListener("click", function () {
    let amountInput = parseFloat(amount.value);
    let descriptionInput = document.getElementById("description").value;

    if (!isNaN(amountInput) && amountInput !== 0) {
      createAndAppendUserInput(amountInput, descriptionInput);
      saveToLocalStorage();
    } else {
      alert("Please enter a valid amount");
    }
  });

  fetch("https://rich-erin-angler-hem.cyclic.app/students/available")
    .then((response) => response.json())
    .then((data) => {
      currencyDropDown(data);
    })
    .catch((error) => {
      console.error("Error fetching currencies:", error);
    });

  function currencyDropDown(currencies) {
    currencyFilter.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.text = "Select a currency";
    currencyFilter.add(defaultOption);

    currencies.forEach((currency) => {
      const option = document.createElement("option");
      option.value = currency.code;
      option.text = currency.code;
      currencyFilter.add(option);
    });
  }

  function saveToLocalStorage() {
    const userInputs = Array.from(userInputContainer.children).map(function (
      userInputDiv
    ) {
      const amountValue = parseFloat(
        userInputDiv.textContent.split(" ")[0].replace("USD", "")
      );
      const description = userInputDiv.textContent.split(" ")[2];
      const currency = userInputDiv.textContent.split(" ")[3];
      return {
        amount: amountValue,
        description: description,
        currency: currency,
      };
    });

    localStorage.setItem("userInputs", JSON.stringify(userInputs));
  }

  function loadFromLocalStorage() {
    const storedUserInputs = JSON.parse(localStorage.getItem("userInputs"));
    if (storedUserInputs) {
      storedUserInputs.forEach(function (userData) {
        createAndAppendUserInput(
          userData.amount,
          userData.description,
          userData.currency
        );
      });
    }
  }

  function updateTotalBalance() {
    totalBalance.querySelector("h1").textContent =
      totalBalanceValue.toFixed(2) + " USD";
  }
});
