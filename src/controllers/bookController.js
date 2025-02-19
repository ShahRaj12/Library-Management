const bookService = require("../services/bookService");

exports.addBook = async (req, res) => {
    try {
        const book = await bookService.addBook(req.body);
        res.status(201).json(book);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

exports.getBooks = async (req, res) => {
    try {
        const booksData = await bookService.getBooks(req.query);
        res.json(booksData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateBook = async (req, res) => {
    try {
        const updatedBook = await bookService.updateBook(req.params.id, req.body);
        res.json(updatedBook);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const message = await bookService.deleteBook(req.params.id);
        res.json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.borrowBook = async (req, res) => {
    try {
        const book = await bookService.borrowBook(req.params.id, req.user.id);
        res.json({ message: "Book borrowed successfully", book });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.returnBook = async (req, res) => {
    try {
        const book = await bookService.returnBook(req.params.id, req.user.id);
        res.json({ message: "Book returned successfully", book });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getBorrowedBooks = async (req, res) => {
    try {
        const borrowedBooks = await bookService.getBorrowedBooks();
        res.json(borrowedBooks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

