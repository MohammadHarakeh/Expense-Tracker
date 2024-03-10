document.addEventListener("DOMContentLoaded", function () {
  const rangeSlider = document.getElementById("rangeSlider");
  const output = document.getElementById("output");
  const numbers = document.querySelectorAll(".number-container p");
  const userInputContainer = document.getElementById("user-inputs-wrapper");
  const create = document.getElementById("create");
  const amount = document.getElementById("amount");

  //slider functionality

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
      let amountValue = parseInt(userInputDiv.textContent.split(" ")[0]);

      if (amountValue >= minValue && amountValue <= maxValue) {
        userInputDiv.style.display = "flex";
      } else {
        userInputDiv.style.display = "none";
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

      trashIcon.addEventListener("click", function () {
        userInputContainer.removeChild(userInputDiv);
      });
    } else {
      alert("enter an amount");
    }

    if (amountInput < 0) {
      userInputDiv.style.backgroundColor = "red";
    } else {
      userInputDiv.style.backgroundColor = "rgb(43, 255, 43)";
    }
  });
});
