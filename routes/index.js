var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

/*Handles asynchronous functions */
const asyncHandler = (cb) => {
  //async handler
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      next(error); // forwards to global handler
    }
  };
};

//Error handler function
const errHandler = (errStatus, msg) => {
  const err = new Error(msg);
  err.status = errStatus;
  throw err;
};

/* GET home page. */
// Home route should redirect to the /books route
router.get(
  '/',
  asyncHandler(async (req, res, next) => {
    res.redirect('/books');
  })
);

/* GET books page. */
// Shows the full list of books
router.get(
  '/books',
  asyncHandler(async (req, res, next) => {
    const books = await Book.findAll();

    res.render('index', { books, title: 'Library Books' });
  })
);

/* GET books/new page. */
// Shows the create new book form
router.get(
  '/books/new',
  asyncHandler(async (req, res, next) => {
    res.render('new-book', { title: 'New Book' });
  })
);

/* POST books/new page. */
// Posts a new book to the database
router.post(
  '/books/new',
  asyncHandler(async (req, res, next) => {
    await Book.create(req.body);
    res.redirect('/books');
  })
);

/* GET Books/:id page. */
// Shows book detail form
router.get(
  '/books/:id',
  asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    // console.log(book);
    if (book) {
      res.render('update-book', { book, title: 'Update Book' });
    } else {
      errHandler(404, 'Page not found! Please try again.');
    }
  })
);

/* POST Books/:id page. */
// Updates book info in the database
router.post(
  '/books/:id',
  asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    await book.update(req.body);
    res.redirect('/books');
  })
);

/* POST Books page. */
// Deletes a book
router.post(
  '/books/:id/delete',
  asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    await book.destroy();
    res.redirect('/books');
  })
);

module.exports = router;
