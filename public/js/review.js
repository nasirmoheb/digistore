/*eslint-disable*/
import '@babel/polyfill';
import axios from 'axios';
import { showAlert } from './alerts';

const sendReview = async (review, rating, product_id) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `http://127.0.0.1:3000/api/v1/product/${product_id}/review`,
      data: {
        review,
        rating
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Your review successfully added');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

document.querySelector('.submit__review').addEventListener('click', e => {
  e.preventDefault();

  const review = document.querySelector('.review__input').value;

  const rating = document.querySelector('.review__rate').value;
  const product_id = document.querySelector('.add__review').dataset.product_id;

  sendReview(review, rating, product_id);
});
