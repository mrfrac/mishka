(function () {
  const button = document.querySelector(".page-header__navigation-toggle");
  const mainNav = document.querySelector(".main-nav");
  // const mainContainer = document.querySelector(".main-container");

  mainNav.classList.remove("main-nav--nojs");
  // mainContainer.classList.remove("main-container--nojs");
  mainNav.classList.add("main-nav--closed");

  button.addEventListener("click", () => {
    if (mainNav.classList.contains("main-nav--opened")) {
      mainNav.classList.remove("main-nav--opened")
      mainNav.classList.add("main-nav--closed");
      button.classList.remove("page-header__navigation-toggle--opened");
    } else {
      button.classList.add("page-header__navigation-toggle--opened");
      mainNav.classList.remove("main-nav--closed")
      mainNav.classList.add("main-nav--opened");
    }
  });
})();
