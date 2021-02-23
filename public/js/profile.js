import '@babel/polyfill';
import axios from 'axios';
import { showAlert } from '/alerts';

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

const updateUserData = async (name, email) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://127.0.0.1:3000/api/v1/user/updateMe',
      data: {
        name,
        email
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Your Accout successfuly updated!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const updateUserPassword = async (currentPassword, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://127.0.0.1:3000/api/v1/user/updatePassword',
      data: {
        currentPassword,
        password,
        passwordConfirm
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Your Password successfuly updated!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

document.querySelector('.save__data').addEventListener('click', async () => {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  document.querySelector('.save__data').textContent = 'updating...';
  await updateUserData(name, email);
  document.querySelector('.save__data').textContent = 'Save Changes';
});

document.querySelector('.save__password').addEventListener('click', async () => {
  const currentPassword = document.getElementById('c_pass').value;
  const password = document.getElementById('n_pass').value;
  const passwordConfirm = document.getElementById('co_pass').value;

  document.querySelector('.save__password').textContent = 'updating...';
  await updateUserPassword(currentPassword, password, passwordConfirm);
  document.querySelector('.save__password').textContent = 'Save Changes';
  document.getElementById('c_pass').value = '***********';
  document.getElementById('n_pass').value = '***********';
  document.getElementById('co_pass').value = '***********';
});

document.getElementById('logout').addEventListener('click', async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/user/logout'
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logout successfully');
      location.assign('/');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
});
