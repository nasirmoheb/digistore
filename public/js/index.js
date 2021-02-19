/*
=============
Navigation
=============
 */

const navOpen = document.querySelector('.nav__hamburger');
const navClose = document.querySelector('.close__toggle');
const menu = document.querySelector('.nav__menu');
const navContainer = document.querySelector('.nav__menu');

navOpen.addEventListener('click', () => {
  menu.classList.add('open');
  document.body.classList.add('active');
  navContainer.style.left = '0';
  navContainer.style.width = '30rem';
});

navClose.addEventListener('click', () => {
  menu.classList.remove('open');
  document.body.classList.remove('active');
  navContainer.style.left = '-30rem';
  navContainer.style.width = '';
});

/*
=============
Profile Navigation
=============
 */

const profileOpen = document.querySelector('.profile__menu--open');
const profileClose = document.querySelector('.profile__menu--close');
const profileContainer = document.querySelector('.profile__menu');

profileOpen.addEventListener('click', () => {
  profileContainer.style.width = '30rem';
  profileContainer.style.left = '0';
  profileOpen.style.display = 'none';
  profileClose.style.display = 'block';
});

profileClose.addEventListener('click', () => {
  profileContainer.style.width = '0';
  profileContainer.style.left = '-30rem';
  profileOpen.style.display = 'block';
  profileClose.style.display = 'none';
});
