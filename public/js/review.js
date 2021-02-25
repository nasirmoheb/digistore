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

const sendReview = async (review, rating, product_id) => {
  try {
    const res = await fetch(`http://127.0.0.1:3000/api/v1/product/${product_id}/review`, {
      method: 'POST', // or 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        review,
        rating
      })
    });

    const content = await res.json();
    if (content.status === 'success') {
      showAlert('success', 'Your review successfully added');
      // showAlert('success', 'Your review successfully added');
    } else {
      showAlert('error', content.message);
    }
  } catch (err) {
    console.log(err);
  }
};

document.querySelector('.submit__review').addEventListener('click', e => {
  e.preventDefault();

  const review = document.querySelector('.review__input').value;

  const rating = document.querySelector('.review__rate').value;
  const product_id = document.querySelector('.add__review').dataset.product_id;

  sendReview(review, rating, product_id);
});
