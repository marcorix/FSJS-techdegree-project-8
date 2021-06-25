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
    let book;
    try {
      book = await Book.create(req.body);
      res.redirect('/books');
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        // checking the error
        book = await Book.build(req.body);
        res.render('new-book', {
          book,
          errors: error.errors,
          title: 'New Book',
        });
      } else {
        throw error; // error caught in the asyncHandler's catch block
      }
    }
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
      res.render('page-not-found');
      res.sendStatus(404);
    }
  })
);

/* POST Books/:id page. */
// Updates book info in the database
router.post(
  '/books/:id',
  asyncHandler(async (req, res, next) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if (book) {
        await book.update(req.body);
        res.redirect('/books');
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        // checking the error
        book = await Book.build(req.body);
        book.id = req.params.id;
        res.render('update-book', {
          book,
          errors: error.errors,
          title: 'Edit Book',
        });
      } else {
        throw error; // error caught in the asyncHandler's catch block
      }
    }
  })
);

/* POST Books page. */
// Deletes a book
router.post(
  '/books/:id/delete',
  asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.destroy();
      res.redirect('/books');
    } else {
      res.sendStatus(404);
    }
  })
);

module.exports = router;
