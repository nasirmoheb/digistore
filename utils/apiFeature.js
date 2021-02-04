class APIFeature {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    //1)Filtering
    let queryObj = { ...this.queryStr };
    //exclude fields that are not in database
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(e => delete queryObj[e]);

    //2)Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    queryObj = JSON.parse(queryStr);

    this.query = this.query.find(queryObj);
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      //default sort by time of creation
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      //default don't show (__v)
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    //5)Paginating
    if (this.queryStr.page && this.queryStr.limit) {
      //page
      const page = this.queryStr.page * 1;
      //limit item per page
      const limit = this.queryStr.limit * 1;
      //calculate skip
      const skip = page * limit - limit;
      //paginating
      this.query = this.query.skip(skip).limit(limit);
    } else {
      //default limit 100 item in page
      this.query = this.query.skip(0).limit(100);
    }
    return this;
  }
}

module.exports = APIFeature;
