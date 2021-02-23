/*eslint-disable*/
import '@babel/polyfill';
import axios from 'axios';
import { showAlert } from './alerts';
//login handler
const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/user/login',
      data: {
        email,
        password
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

//registeration handler
const register = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/user/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm
      }
    });

    console.log(res.data.status);
    if (res.data.status === 'success') {
      showAlert('success', res.data.message, 20);
      console.log(res);
      window.setTimeout(() => {
        location.assign('/');
      }, 5000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

//Login event listener
document.getElementById('LoginForm').addEventListener('submit', async e => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  await login(email, password);
});

//Registeration event listener
document.getElementById('RegForm').addEventListener('submit', e => {
  e.preventDefault();

  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPass').value;
  const passwordConfirm = document.getElementById('regConfirmPass').value;

  register(name, email, password, passwordConfirm);
});
