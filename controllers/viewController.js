exports.getHome = (req, res, next) => {
  res.status(200).render('home');
};

exports.getProduct = (req, res, next) => {
  res.status(200).render('base');
};
