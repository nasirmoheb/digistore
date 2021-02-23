// <!-----------------JS for Account page---------------->

const LoginForm = document.getElementById('LoginForm');
const RegForm = document.getElementById('RegForm');
const Indicator = document.getElementById('Indicator');

function registerToggle() {
  RegForm.style.transform = 'translateX(0px)';
  LoginForm.style.transform = 'translateX(0px)';
  Indicator.style.transform = 'translateX(100px)';
}

function loginToggle() {
  RegForm.style.transform = 'translateX(300px)';
  LoginForm.style.transform = 'translateX(300px)';
  Indicator.style.transform = 'translateX(0px)';
}