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

const login = async (email, password) => {
  try {
    const res = await fetch('/api/v1/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    });
    const content = await res.json();
    if (content.status === 'success') {
      showAlert('success', 'Logged in successfully');
      window.setTimeout(() => {
        location.assign('/profile');
      }, 1000);
    } else {
      showAlert('error', content.message);
    }
  } catch (err) {
    showAlert('error', err);
  }
};

//registeration handler
const register = async (name, email, password, passwordConfirm) => {
  try {
    const res = await fetch('/api/v1/user/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        password,
        passwordConfirm
      })
    });

    const content = await res.json();
    if (content.status === 'success') {
      showAlert('success', content.message, 20);
      window.setTimeout(() => {
        location.assign('/');
      }, 5000);
    } else {
      showAlert('error', content.message);
    }
  } catch (err) {
    showAlert('error', err);
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
