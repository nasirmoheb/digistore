/*eslint-disable*/

const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
const showAlert = (type, msg, time = 7) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, time * 1000);
};

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
    const res = await fetch('http://127.0.0.1:3000/api/v1/user/updateMe', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email
      })
    });
    const content = await res.json();

    if (content.status === 'success') {
      showAlert('success', 'Your Accout successfuly updated!');
    } else {
      showAlert('error', content.message);
    }
  } catch (err) {
    showAlert('error', err);
  }
};

const updateUserPassword = async (currentPassword, password, passwordConfirm) => {
  try {
    const res = await fetch('http://127.0.0.1:3000/api/v1/user/updatePassword', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        currentPassword,
        password,
        passwordConfirm
      })
    });
    const content = await res.json();

    if (content.status === 'success') {
      showAlert('success', 'Your Password successfuly updated!');
    } else {
      showAlert('error', content.message);
    }
  } catch (err) {
    showAlert('error', err);
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
    const res = await fetch('http://127.0.0.1:3000/api/v1/user/logout', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const content = await res.json();
    if (content.status === 'success') {
      showAlert('success', 'Logout successfully');
      location.assign('/');
    } else {
      showAlert('error', content.message);
    }
  } catch (err) {
    showAlert('error', err);
  }
});
