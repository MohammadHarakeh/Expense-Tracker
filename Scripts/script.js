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

  let totalBalanceValue = 0;
  let totalIncomeValue = 0;
  let totalExpenseValue = 0;
  let descriptionInput = "";

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

      // Check the selected filter type and show/hide entries accordingly
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

  // Create button functionality
  function createAndAppendUserInput(amountValue, description) {
    let userInputDiv = document.createElement("div");
    let fontIconsDiv = document.createElement("div");
    let trashIcon = document.createElement("i");
    let editIcon = document.createElement("i");

    trashIcon.className = "fa-solid fa-trash";
    editIcon.className = "fa-solid fa-pen-to-square";

    userInputDiv.className = "user-inputs";
    fontIconsDiv.className = "font-icons-div";

    userInputDiv.innerHTML = `<span>${amountValue.toFixed(
      2
    )} USD</span> <span>${description}</span>`;

    userInputContainer.appendChild(userInputDiv);
    userInputDiv.appendChild(fontIconsDiv);
    fontIconsDiv.appendChild(trashIcon);
    fontIconsDiv.appendChild(editIcon);

    trashIcon.addEventListener("click", function () {
      totalBalanceValue -= amountValue;
      userInputContainer.removeChild(userInputDiv);

      if (amountValue < 0) {
        totalExpenseValue -= amountValue;
        totalExpense.textContent = totalExpenseValue.toFixed(2) + " USD";
      } else {
        totalIncomeValue -= amountValue;
        totalIncome.textContent = totalIncomeValue.toFixed(2) + " USD";
      }
      updateTotalBalance();
      saveToLocalStorage(); // Save to local storage after removing an item
    });

    if (amountValue < 0) {
      userInputDiv.style.backgroundColor = "rgb(252, 51, 51)";
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

  // Your existing create button functionality
  create.addEventListener("click", function () {
    let amountInput = parseFloat(amount.value);
    descriptionInput = document.getElementById("description").value;

    if (!isNaN(amountInput) && amountInput !== 0) {
      createAndAppendUserInput(amountInput, descriptionInput);
      saveToLocalStorage(); // Save to local storage after adding an item
    } else {
      alert("Please enter a valid amount");
    }
  });

  function saveToLocalStorage() {
    const userInputs = Array.from(userInputContainer.children).map(function (
      userInputDiv
    ) {
      const amountValue = parseFloat(
        userInputDiv.textContent.split(" ")[0].replace("USD", "")
      );
      const description = userInputDiv.textContent.split(" ")[2];
      return { amount: amountValue, description: description };
    });

    localStorage.setItem("userInputs", JSON.stringify(userInputs));
    console.log("Saving to local storage");
  }

  // Your existing loadFromLocalStorage function
  function loadFromLocalStorage() {
    console.log("Loading from local storage");
    const storedUserInputs = JSON.parse(localStorage.getItem("userInputs"));
    if (storedUserInputs) {
      console.log("Stored data:", storedUserInputs);
      storedUserInputs.forEach(function (userData) {
        createAndAppendUserInput(userData.amount, userData.description);
      });
    }
  }

  function updateTotalBalance() {
    totalBalance.querySelector("h1").textContent =
      totalBalanceValue.toFixed(2) + " USD";
  }
});
