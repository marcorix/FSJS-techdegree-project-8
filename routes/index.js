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
router.get('/books/new', async function (req, res, next) {
  res.render('index', { title: 'Clara ti amo' });
});

/* POST books/new page. */
// Posts a new book to the database
router.post('/books/new', async function (req, res, next) {
  res.render('index', { title: 'Clara ti amo' });
});

/* GET Books/:id page. */
// Shows book detail form
router.get('/books/:id', async function (req, res, next) {
  res.render('index', { title: 'Clara ti amo' });
});

/* POST Books/:id page. */
// Updates book info in the database
router.post('/books/:id', async function (req, res, next) {
  res.render('index', { title: 'Clara ti amo' });
});

/* POST Books page. */
router.post('/books/:id/delete', async function (req, res, next) {
  const books = await Book.findAll();
  res.render('index', { title: 'Clara ti amo' });
});

module.exports = router;
