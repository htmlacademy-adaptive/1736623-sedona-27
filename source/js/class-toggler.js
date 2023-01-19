let navMain = document.querySelector('.main-navigation');
let navToggle = document.querySelector('.main-navigation__toggle');
let navLogo = document.querySelector('.logotype');
let navButtons = document.querySelector('.navigation');

navMain.classList.remove('main-navigation--nojs');

navToggle.addEventListener('click', function () {
  if (navMain.classList.contains('main-navigation--closed')) {
    navMain.classList.remove('main-navigation--closed');
    navMain.classList.add('main-navigation--opened');
    navLogo.classList.remove('logotype--active');
    navLogo.classList.add('logotype--none');
    navButtons.classList.remove('navigation--none');
    navButtons.classList.add('navigation--active');
  } else {
    navMain.classList.add('main-navigation--closed');
    navMain.classList.remove('main-navigation--opened');
    navLogo.classList.remove('logotype--none');
    navLogo.classList.add('logotype--active');
    navButtons.classList.remove('navigation--active');
    navButtons.classList.add('navigation--none');
  }
});
