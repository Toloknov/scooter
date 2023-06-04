import AOS from "aos"; // если эта библотека не надо то удалить ее
AOS.init();
//getE
import Swiper, { Navigation } from "swiper";

const swiper = new Swiper(".reviews-wrapper", {
  modules: [Navigation],
  breakpoints: {
    580: { slidesPerView: 3 },
  },

  slidesPerView: 1,
  spaceBetween: 40,
  loop: true,
  centeredSlides: "true",
  grabCursor: "true",
  navigation: {
    nextEl: ".reviews_toggle-next",
    prevEl: ".reviews_toggle-prev",
  },
});
burgerMenu();
autoHeightSwiper();
changeTheme();
changeImg();
pawerChange();
securityChange();
modal();
anchors();
function anchors() {
  const anchors = document.querySelectorAll("a[href*='#']");
  const headerNav = document.querySelector(".header_nav");
  const burgerMenu = document.querySelector("[data-burger-menu]");

  [...anchors].map((anchor) => {
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      const width = document.body.clientWidth;
      console.log(width);
      if (width < 480) {
        headerNav.classList.remove("header_nav-active");
        burgerMenu.classList.remove("burger-menu_line-active");
      }
      const blockId = anchor.getAttribute("href");
      document
        .querySelector("" + blockId)
        .scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}
function modal() {
  const modal = document.querySelector("#modal");
  document.addEventListener("click", (e) => {
    if (e.target.id === "buy") {
      modal.classList.remove("hidden");
    } else if (e.target.id === "cross" || e.target.id === "modal") {
      modal.classList.add("hidden");
    }
  });
}
function autoHeightSwiper() {
  const reviewsContainer = document.querySelector(".reviews_container");
  const reviewsItems = document.querySelectorAll(".reviews_item");
  window.addEventListener("resize", () => {
    [...reviewsItems].map((item) => {
      item.style.maxHeight = reviewsContainer.offsetHeight + "px";
    });
  });
}

function burgerMenu() {
  const burgerMenu = document.querySelector("[data-burger-menu]");
  const headerNav = document.querySelector(".header_nav");
  burgerMenu.addEventListener("click", () => {
    const width = document.body.clientWidth;
    headerNav.classList.remove("hidden");
    headerNav.classList.toggle("header_nav-active");
    burgerMenu.classList.toggle("burger-menu_line-active");


  });
}
function changeTheme() {
  const boxes = document.querySelectorAll(".box");
  const whiteBtn = document.querySelectorAll("[data-toggle='white']");
  const darkBtn = document.querySelectorAll("[data-toggle='dark']");
  [...boxes].map((box) => {
    box.addEventListener("click", (e) => {
      if (e.target.dataset.toggle === "white") {
        [...whiteBtn].map((white) => {
          white.classList.remove("box_btn_active");
        });
        [...darkBtn].map((dark) => {
          dark.classList.add("box_btn_active");
        });

        document.documentElement.style.setProperty("--black-color", "#f1f1f1");
        document.documentElement.style.setProperty("--bg", "#E0E0E0");
        document.documentElement.style.setProperty("--light-color", "#151515");
      } else {
        document.documentElement.style.setProperty("--black-color", "#151515");
        document.documentElement.style.setProperty("--bg", "#222222");
        document.documentElement.style.setProperty("--light-color", "#f1f1f1");

        [...darkBtn].map((dark) => {
          dark.classList.remove("box_btn_active");
        });
        [...whiteBtn].map((white) => {
          white.classList.add("box_btn_active");
        });
      }
    });
  });
}

function changeImg() {
  const imageElement = document.querySelector(".header_main-img");
  const sources = document.querySelectorAll("#head-pic source");
  const imageScooterPro = document.querySelector("[data-scooter='pro']");
  const mobileItemVector = document.querySelectorAll(
    ".mobile_item-vector svg use"
  );
  const whiteBtn = document.querySelectorAll("[data-toggle='white']");
  const darkBtn = document.querySelectorAll("[data-toggle='dark']");
  const imgDark = [
    "./images/dark-scooter-min.avif",
    "./images/dark-scooter-middle.avif",
    "./images/dark-scooter-big.avif",
    "./images/dark-scooter-min.webp",
    "./images/dark-scooter-middle.webp",
    "./images/dark-scooter-big.webp",
    "./images/dark-scooter-min.png",
    "./images/dark-scooter-middle .png",
  ];
  const imgWhite = [
    "./images/white-scooter-min.avif",
    "./images/white-scooter-middle.avif",
    "./images/white-scooter-big.avif",
    "./images/white-scooter-min.webp",
    "./images/white-scooter-middle.webp",
    "./images/white-scooter-big.webp",
    "./images/white-scooter-min.png",
    "./images/white-scooter-middle .png",
  ];

  [...darkBtn].map((dark) => {
    dark.addEventListener("click", () => {
      sources.forEach((source, i) => {
        source.srcset = imgWhite[i];
      });
      imageElement.src = "./images/dark-scooter-big.png";
      mobileItemVector[0].href.baseVal = "./images/sprite.svg#--white-apple";
      mobileItemVector[1].href.baseVal = "./images/sprite.svg#--white-android";

      imageScooterPro.children[0].srcset = "./images/white-scooter-pro.avif";
      imageScooterPro.children[1].srcset = "./images/white-scooter-pro.webp";
      imageScooterPro.children[2].src = "./images/white-scooter-pro.png";
    });
  });

  [...whiteBtn].map((white) => {
    white.addEventListener("click", () => {
      sources.forEach((source, i) => {
        source.srcset = imgDark[i];
      });
      imageElement.src = "./images/dark-scooter-big.png";
      mobileItemVector[0].href.baseVal = "./images/sprite.svg#--dark-apple";
      mobileItemVector[1].href.baseVal = "./images/sprite.svg#--dark-android";

      imageScooterPro.children[0].srcset = "./images/dark-scooter-pro.avif";
      imageScooterPro.children[1].srcset = "./images/dark-scooter-pro.webp";
      imageScooterPro.children[2].src = "./images/dark-scooter-pro.png";
    });
  });
}

function pawerChange() {
  const pawerContainer = document.querySelector(".pawer_container");
  const sources = document.querySelectorAll("#pawer_pic source");
  const imagesMain = document.querySelector(".pawer_images-main");
  pawerContainer.addEventListener("click", (e) => {
    if (document.body.clientWidth > 660) {
      [...pawerContainer.children].map((item) => {
        item.classList.remove("pawer_container-item-active");
      });
      const currentItem = e.target.closest(".pawer_container-item");
      currentItem.classList.add("pawer_container-item-active");
      const dateElemCurrent = currentItem.dataset.elem;
      sources[0].srcset = `./images/pawer-${dateElemCurrent}.avif`;
      sources[1].srcset = `./images/pawer-${dateElemCurrent}.webp`;
      imagesMain.src = `./images/pawer-${dateElemCurrent}.jpg`;
    }
  });
}
function securityChange() {
  const securityContainer = document.querySelector(".security_container");
  const sources = document.querySelectorAll("#security_pic source");
  const imagesMain = document.querySelector(".security_images-main");
  securityContainer.addEventListener("click", (e) => {
    if (document.body.clientWidth > 660) {
      [...securityContainer.children].map((item) => {
        item.classList.remove("security_container-item-active");
      });
      const currentItem = e.target.closest(".security_container-item");
      currentItem.classList.add("security_container-item-active");
      const dateElemCurrent = currentItem.dataset.elem;
      sources[0].srcset = `./images/security-${dateElemCurrent}.avif`;
      sources[1].srcset = `./images/security-${dateElemCurrent}.webp`;
      imagesMain.src = `./images/security-${dateElemCurrent}.jpg`;
    }
  });
}
