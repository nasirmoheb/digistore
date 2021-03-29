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
    const res = await fetch('/api/v1/user/updateMe', {
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
    const res = await fetch('/api/v1/user/updatePassword', {
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

const saveData = document.querySelector('.save__data');
if (saveData) {
  saveData.addEventListener('click', async () => {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    document.querySelector('.save__data').textContent = 'updating...';
    await updateUserData(name, email);
    document.querySelector('.save__data').textContent = 'Save Changes';
  });
}

const savePass = document.querySelector('.save__password');
if (savePass) {
  savePass.addEventListener('click', async () => {
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
}

document.getElementById('logout').addEventListener('click', async () => {
  try {
    const res = await fetch('/api/v1/user/logout', {
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

const addCategory = async name => {
  try {
    const res = await fetch('/api/v1/category', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json'
      },
      body: JSON.stringify({ name })
    });

    const content = await res.json();

    if (content.status === 'success') {
      showAlert('success', 'Your Category successfully created!😍');
    } else {
      showAlert('error', content.message);
    }
  } catch (err) {
    console.log(err);
  }
};

const saveCategory = document.querySelector('#categorySaveBtn');

if (saveCategory) {
  saveCategory.addEventListener('click', () => {
    const categoryName = document.querySelector('#categoryName').value;
    addCategory(categoryName);
  });
}

const addProduct = async data => {
  try {
    const res = await fetch('/api/v1/product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const content = await res.json();

    if (content.status === 'success') {
      showAlert('success', 'Product successfuly created!🌐');
    } else {
      showAlert('error', content.message);
    }
  } catch (err) {
    console.log(err);
  }
};

const saveProduct = document.querySelector('#addProduct');
if (saveProduct) {
  saveProduct.addEventListener('click', () => {
    const pName = document.querySelector('#productName').value;
    const pSKU = document.querySelector('#productSKU').value;
    const pCoverPhoto = document.querySelector('#productCoverPhoto').value;
    const pPhotos = document.querySelector('#productPhotos').value;
    const pPrice = document.querySelector('#productPrice').value;
    const pQuantity = document.querySelector('#productQuantity').value;
    const pCategory = document.querySelector('#productCategory').value;
    const pSummery = document.querySelector('#productSummery').value;
    const pDescription = document.querySelector('#productDescription').value;
    const pModel = document.querySelector('#productModel').value;
    const pReleaseDate = document.querySelector('#productReleaseDate').value;
    const pCompany = document.querySelector('#productCompanyName').value;

    const data = {
      sku: pSKU,
      name: pName,
      category: pCategory,
      imageCover: pCoverPhoto,
      images: pPhotos,
      summery: pSummery,
      description: pDescription,
      manufactureDetails: {
        modelNumber: pModel,
        releaseDate: pReleaseDate,
        company: pCompany
      },
      price: pPrice,
      quantity: pQuantity
    };

    addProduct(data);
  });
}
