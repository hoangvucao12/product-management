// Quantity
const quantitySelector = document.querySelector(".quantity-selector");
const input = quantitySelector.querySelector("input[type='number']");
const btnDesc = quantitySelector.querySelector(".btn-desc");
const btnAsc = quantitySelector.querySelector(".btn-asc");

btnDesc.addEventListener("click", () => {
  let current = parseInt(input.value) || 1;
  const min = parseInt(input.min) || 1;
  if (current > min) {
    input.value = current - 1;
  }
});

btnAsc.addEventListener("click", () => {
  let current = parseInt(input.value) || 1;
  const max = parseInt(input.max) || 99;
  if (current < max) {
    input.value = current + 1;
  }
});
// End Quantity

// Alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const time = showAlert.getAttribute("data-time");
  const closeAlert = showAlert.querySelector("[close-alert]");
  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, parseInt(time));
  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });
}
// End Alert
