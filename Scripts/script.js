document.addEventListener("DOMContentLoaded", function () {
  const rangeSlider = document.getElementById("rangeSlider");
  const output = document.getElementById("output");
  const userInputContainer = document.getElementById("user-inputs-wrapper");
  const create = document.getElementById("create");
  const amount = document.getElementById("amount");
  const totalBalance = document.getElementById("total-balance");
  const totalIncome = document.querySelector(".total-income h1");
  const totalExpense = document.querySelector(".total-expense h1");

  let totalBalanceValue = 0;
  let totalIncomeValue = 0;
  let totalExpenseValue = 0;

  totalBalance.querySelector("h1").textContent = totalBalanceValue + " USD";
  totalIncome.textContent = totalIncomeValue.toFixed(2) + " USD";
  totalExpense.textContent = totalExpenseValue.toFixed(2) + " USD";

  // Slider functionality
  noUiSlider.create(rangeSlider, {
    start: [-5000, 5000],
    connect: true,
    range: {
      min: -5000,
      max: 5000,
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

  // Create button functionality
  create.addEventListener("click", function () {
    let amountInput = parseFloat(amount.value); // Move the initialization here

    if (!isNaN(amountInput) && amountInput !== 0) {
      let userInputDiv = document.createElement("div");
      let fontIconsDiv = document.createElement("div");
      let trashIcon = document.createElement("i");
      let editIcon = document.createElement("i");

      trashIcon.className = "fa-solid fa-trash";
      editIcon.className = "fa-solid fa-pen-to-square";

      userInputDiv.className = "user-inputs";
      fontIconsDiv.className = "font-icons-div";

      userInputDiv.textContent = amountInput.toFixed(2) + " USD";
      userInputContainer.appendChild(userInputDiv);
      userInputDiv.appendChild(fontIconsDiv);
      fontIconsDiv.appendChild(trashIcon);
      fontIconsDiv.appendChild(editIcon);

      trashIcon.addEventListener("click", function () {
        totalBalanceValue -= amountInput;
        userInputContainer.removeChild(userInputDiv);

        if (amountInput < 0) {
          totalExpenseValue -= amountInput;
          totalExpense.textContent = totalExpenseValue.toFixed(2) + " USD";
        } else {
          totalIncomeValue -= amountInput;
          totalIncome.textContent = totalIncomeValue.toFixed(2) + " USD";
        }
        updateTotalBalance();
      });

      if (amountInput < 0) {
        userInputDiv.style.backgroundColor = "rgb(252, 51, 51)";
        totalExpenseValue += amountInput;
        totalExpense.textContent = totalExpenseValue.toFixed(2) + " USD";
      } else {
        userInputDiv.style.backgroundColor = "rgb(43, 255, 43)";
        totalIncomeValue += amountInput;
        totalIncome.textContent = totalIncomeValue.toFixed(2) + " USD";
      }

      totalBalanceValue += amountInput;
      updateTotalBalance();
    } else {
      alert("Please enter a valid amount");
    }
  });

  // Function to update total balance
  function updateTotalBalance() {
    totalBalance.querySelector("h1").textContent =
      totalBalanceValue.toFixed(2) + " USD";
  }
});
