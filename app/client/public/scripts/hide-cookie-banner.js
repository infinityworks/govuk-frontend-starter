/* eslint-env browser */
const hideButton = document.querySelector(".js-hide");
const cookieBanner = document.querySelector(".govuk-cookie-banner");
const confirmationBanner = document.querySelector(".js-confirmation-banner");

if (confirmationBanner && confirmationBanner instanceof HTMLElement) {
  // Shift focus to the confirmation banner
  confirmationBanner.setAttribute("tabindex", "-1");
  confirmationBanner.focus();

  confirmationBanner.addEventListener("blur", function () {
    confirmationBanner.removeAttribute("tabindex");
  });
}

/**
 * As the cookie banner component does not currently include JavaScript, we
 * have to take care of the 'Hide' button to make progressive enhancement
 * functional.
 **/
if (hideButton) {
  hideButton.addEventListener("click", function (event) {
    cookieBanner.setAttribute("hidden", "hidden");
    event.preventDefault();
  });
}
