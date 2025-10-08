const navButton = document.querySelector('#ham-btn');
const navBar = document.querySelector('#nav-bar');
const h1 = document.querySelector('#nav-header-text')

navButton.addEventListener('click', () => {
  navButton.classList.toggle('show');
  navBar.classList.toggle('show');
  h1.textContent
});