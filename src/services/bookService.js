const Book = require("../models/Book");
const User = require("../models/User");
const mongoose = require('mongoose')
const { sendEmail } = require("../services/emailService");

exports.addBook = async (bookData) => {
    const bookExist = await Book.findOne({
        title: bookData.title,
        author: bookData.author,
        genre: bookData.genre,
        availability: bookData.availability
    });

    if (bookExist) {
        throw new Error("Book already exists");
    }

    return await Book.create(bookData);
};

exports.getBooks = async ({ search, sort, page = 1, limit = 10, availability }) => {
    const query = {};

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { author: { $regex: search, $options: "i" } },
            { genre: { $regex: search, $options: "i" } }
        ];
    }

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    if (availability !== undefined) {
        query.availability = availability === "true";
    }

    const sortOptions = {};
    if (sort) {
        const sortField = sort.startsWith("-") ? sort.substring(1) : sort;
        sortOptions[sortField] = sort.startsWith("-") ? -1 : 1;
    } else {
        sortOptions["title"] = 1;
    }

    const books = await Book.find(query).sort(sortOptions).skip(skip).limit(pageSize);
    const totalBooks = await Book.countDocuments(query);

    return {
        books,
        totalBooks,
        page: pageNumber,
        totalPages: Math.ceil(totalBooks / pageSize),
    };
};

exports.updateBook = async (id, bookData) => {
    const bookExist = await Book.findOne({
        _id: { $ne: id },
        title: bookData.title,
        author: bookData.author,
        genre: bookData.genre,
        availability: bookData.availability,
    });

    if (bookExist) {
        throw new Error("Book already exists");
    }

    const updatedBook = await Book.findByIdAndUpdate(id, bookData, { new: true });

    if (!updatedBook) {
        throw new Error("Book not found");
    }

    return updatedBook;
};

exports.deleteBook = async (id) => {
    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
        throw new Error("Book not found");
    }

    return { message: "Book deleted successfully" };
};

exports.borrowBook = async (bookId, userId) => {
    const book = await Book.findById(bookId);
    if (!book) {
        throw new Error("Book not found");
    }

    if (!book.availability) {
        throw new Error("Book is already borrowed");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }

    book.availability = false;
    book.borrowedBy = userId;
    book.borrowedAt = new Date();

    await book.save();

    const subject = "Book Borrowed Successfully!";
    const message = `Hello ${user.fullName},\n\nYou have successfully borrowed the book: "${book.title}".\nPlease return it on time.\n\nThank you!`;

    await sendEmail(user.email, subject, message);

    return book;
};

exports.returnBook = async (bookId, userId) => {
    const book = await Book.findById(bookId);
    if (!book) {
        throw new Error("Book not found");
    }

    if (!book.borrowedBy || book.borrowedBy.toString() !== userId) {
        throw new Error("You cannot return this book");
    }

    book.availability = true;
    book.borrowedBy = null;
    book.borrowedAt = null;

    await book.save();
    return book;
};

exports.getBorrowedBooks = async () => {
    return await Book.find({ availability: false }).populate("borrowedBy", "fullName email");
};
