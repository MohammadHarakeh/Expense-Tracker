document.addEventListener("DOMContentLoaded", function () {
  const rangeSlider = document.getElementById("rangeSlider");
  const output = document.getElementById("output");
  const numbers = document.querySelectorAll(".number-container p");
  const userInputContainer = document.getElementById("user-inputs-wrapper");
  const create = document.getElementById("create");
  const amount = document.getElementById("amount");

  //slider functionality

  noUiSlider.create(rangeSlider, {
    start: [0, 5000],
    connect: true,
    range: {
      min: 0,
      max: 5000,
    },
  });

  rangeSlider.noUiSlider.on("update", function (values) {
    let minValue = parseInt(values[0]);
    let maxValue = parseInt(values[1]);
    output.textContent = "Selected range: " + minValue + " to " + maxValue;

    numbers.forEach(function (number) {
      let value = parseInt(number.getAttribute("data-value"));
      if (value >= minValue && value <= maxValue) {
        number.style.display = "block";
      } else {
        number.style.display = "none";
      }
    });
  });

  // Create button functionality

  create.addEventListener("click", function () {
    let userInputDiv = document.createElement("div");
    let fontIconsDiv = document.createElement("div");
    let trashIcon = document.createElement("i");
    let editIcon = document.createElement("i");

    let amountInput = amount.value;

    trashIcon.className = "fa-solid fa-trash";
    editIcon.className = "fa-solid fa-pen-to-square";

    userInputDiv.className = "user-inputs";
    fontIconsDiv.className = "font-icons-div";

    if (amountInput.trim() !== "") {
      userInputDiv.textContent = amountInput + " USD";
      userInputContainer.appendChild(userInputDiv);
      userInputDiv.appendChild(fontIconsDiv);
      fontIconsDiv.appendChild(trashIcon);
      fontIconsDiv.appendChild(editIcon);
    } else {
      alert("enter an amount");
    }
  });
});
