const router = require("express").Router();
const user = require("../models/user");
const jwt = require("jsonwebtoken");
const {authenticateToken} = require("./userAuth");
const Book = require("../models/book");
const Author = require("../models/author");
const Bundle = require("../models/bundle");
const AvailabilityAlert = require("../models/availabilityAlert");
const sendEmail = require("../utils/sendEmail");

//add book --admin
router.post("/add-book", authenticateToken, async (req, res) =>{
    try {
        const { id } = req.headers;
        const foundUser = await user.findById(id);
            if (foundUser.role !== "admin") 

         {
            return res
            .status (500)
            .json({ massage: "you are not havin access to perform admin work"});
         }
         const newBook = new Book({
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            desc: req.body.desc,
            language: req.body.language,
            category: req.body.category,
            popular: req.body.popular,
            trending: req.body.trending, 
            classic: req.body.classic,
            booksWeLove: req.body.booksWeLove,
            stock: req.body.stock,
        });
        await newBook.save();
        res.status(200).json({message: "Book added successfully "});
    } catch (error) {
        res.status (500).json({ message: "Internal server error"});
    }
});

// add author -- admin
router.post("/add-author", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    const foundUser = await user.findById(id);

    if (!foundUser || foundUser.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not authorized to add authors" });
    }

    const { name, image, born, died, nationality, genre, description } =
      req.body;

    if (!name || !description) {
      return res
        .status(400)
        .json({ message: "Name and description are required" });
    }

    const newAuthor = new Author({
      name,
      image,
      born,
      died,
      nationality,
      genre,
      description,
    });

    await newAuthor.save();

    return res.status(200).json({
      message: "Author added successfully",
      data: newAuthor,
    });
  } catch (error) {
    console.log(error);

    if (error.code === 11000) {
      return res.status(400).json({ message: "Author already exists" });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
});

// get one author by name
router.get("/get-author/:name", async (req, res) => {
  try {
    const author = await Author.findOne({
      name: decodeURIComponent(req.params.name),
    });

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    return res.status(200).json({
      status: "success",
      data: author,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// get all authors
router.get("/get-all-authors", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    const foundUser = await user.findById(id);

    if (!foundUser || foundUser.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not authorized to view authors" });
    }

    const authors = await Author.find().sort({ createdAt: -1 });

    return res.status(200).json({
      status: "success",
      data: authors,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// get author by id
router.get("/get-author-by-id/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    const foundUser = await user.findById(id);

    if (!foundUser || foundUser.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not authorized to view this author" });
    }

    const author = await Author.findById(req.params.id);

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    return res.status(200).json({
      status: "success",
      data: author,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// update author -- admin
router.put("/update-author/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    const foundUser = await user.findById(id);

    if (!foundUser || foundUser.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not authorized to update authors" });
    }

    const { name, image, born, died, nationality, genre, description } = req.body;

    if (!name || !description) {
      return res
        .status(400)
        .json({ message: "Name and description are required" });
    }

    const updatedAuthor = await Author.findByIdAndUpdate(
      req.params.id,
      {
        name,
        image,
        born,
        died,
        nationality,
        genre,
        description,
      },
      { new: true }
    );

    if (!updatedAuthor) {
      return res.status(404).json({ message: "Author not found" });
    }

    return res.status(200).json({
      message: "Author updated successfully",
      data: updatedAuthor,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// delete author -- admin
router.delete("/delete-author/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    const foundUser = await user.findById(id);

    if (!foundUser || foundUser.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete authors" });
    }

    const deletedAuthor = await Author.findByIdAndDelete(req.params.id);

    if (!deletedAuthor) {
      return res.status(404).json({ message: "Author not found" });
    }

    return res.status(200).json({
      message: "Author deleted successfully",
      data: deletedAuthor,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// public author details with books
router.get("/author-details/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    const books = await Book.find({
      author: author.name,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      status: "success",
      data: {
        author,
        books,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// update book
router.put("/update-book", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.headers;

    if (!bookid) {
      return res.status(400).json({ message: "Book id is required" });
    }

    const existingBook = await Book.findById(bookid);

    if (!existingBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    const oldStock = Number(existingBook.stock);

    const updatedBook = await Book.findByIdAndUpdate(
      bookid,
      {
        $set: {
          url: req.body.url,
          title: req.body.title,
          author: req.body.author,
          price: Number(req.body.price),
          originalPrice: Number(req.body.originalPrice || 0),
          desc: req.body.desc,
          language: req.body.language,
          category: req.body.category,
          popular: req.body.popular,
          trending: req.body.trending,
          classic: req.body.classic,
          booksWeLove: req.body.booksWeLove,
          stock: Number(req.body.stock),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    console.log("OLD STOCK:", oldStock);
    console.log("NEW STOCK:", updatedBook.stock);

    if (oldStock === 0 && updatedBook.stock > 0) {
      const alerts = await AvailabilityAlert.find({
        book: bookid,
        notified: false,
      }).populate("user");

      console.log("ALERTS FOUND:", alerts.length);

      for (let alert of alerts) {
        const alertUser = alert.user;

        if (alertUser && alertUser.email) {
          console.log("SENDING AVAILABILITY EMAIL TO:", alertUser.email);

          try {
            await sendEmail(alertUser.email, "Book Back in Stock 📚", {
         type: "availability",
         username: alertUser.username,
         bookTitle: updatedBook.title,
         bookImage: updatedBook.url,
         });
        } catch (emailError) {
        console.log("Availability email failed:", emailError.message);
         }
        }

        await AvailabilityAlert.findByIdAndDelete(alert._id);
      }
    }

    return res.status(200).json({
      message: "Book Updated successfully",
      data: updatedBook,
    });
  } catch (error) {
    console.log("UPDATE BOOK ERROR:", error);
    return res.status(500).json({ message: "An error Occured" });
  }
});

// request availability alert
router.post("/availability-alert/:bookid", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { bookid } = req.params;

    const book = await Book.findById(bookid);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.stock > 0) {
      return res.status(400).json({ message: "This book is already available" });
    }

    const existingAlert = await AvailabilityAlert.findOne({
      user: id,
      book: bookid,
      notified: false,
    });

    if (existingAlert) {
      return res.status(400).json({
        message: "You already requested an availability alert for this book",
      });
    }

    await AvailabilityAlert.create({
      user: id,
      book: bookid,
    });

    return res.status(200).json({
      message: "We will notify you when this book is available",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// delete book --admin
router.delete("/delete-book", authenticateToken, async (req, res) => {
    try {
        const { id, bookid } = req.headers;
        await Book.findByIdAndDelete(bookid);
        return res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occured" });
    }
});

//get all books
router.get("/get-all-books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
     return res.json({
        status: "success",
        data: books,
     })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occured" });
  }
});

// search books
router.get("/search-books", async (req, res) => {
  try {
    const { query, type } = req.query;

    if (!query || query.trim() === "") {
      return res.status(200).json({
        status: "success",
        data: [],
      });
    }

    let filter = {};

    if (type === "authors") {
      filter = {
        author: { $regex: query, $options: "i" },
      };
    } else {
      filter = {
        title: { $regex: query, $options: "i" },
      };
    }

    const books = await Book.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      status: "success",
      data: books,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occured" });
  }
});

//get recently added books
router.get("/get-recent-books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).limit(4);
    return res.json({
        status: "success",
        data: books,
  });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occured" });
  }
});

//get book by id 
router.get("/get-book-by-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const foundBook = await Book.findById(id);
    return res.json({
     status: "success" ,
     data: foundBook,
    });

  } catch (error) {
    console.log(error);
   return  res.status(500).json({ message: "An error occurred" });
  }
});

/*
// Add multiple books --admin
router.post("/add-multiple-books", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const foundUser = await user.findById(id);
    if (foundUser.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    await Book.insertMany(req.body);  // Accepts array of books
    res.status(200).json({ message: "Books added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}); */

router.get("/low-stock-books", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    const foundUser = await user.findById(id);

    if (!foundUser || foundUser.role !== "admin") {
      return res.status(403).json({
        message: "You are not authorized to view low stock books",
      });
    }

    const books = await Book.find({ stock: { $lt: 5 } })
      .select("title author url stock price")
      .sort({ stock: 1 });

    return res.status(200).json({
      message: "Low stock books fetched successfully",
      data: books,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// 🔥 GET MOST POPULAR BOOKS
router.get("/get-most-popular-books", async (req, res) => {
  try {
    const books = await Book.find({ popular: true }).sort({
      updatedAt: -1,
      createdAt: -1,
    });

    return res.json({
      status: "Success",
      data: books,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// GET TRENDING BOOKS
router.get("/get-trending-books", async (req, res) => {
  try {
    const books = await Book.find({ trending: true }).sort({
      updatedAt: -1,
      createdAt: -1,
    });

    return res.json({
      status: "Success",
      data: books,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// GET CLASSIC BOOKS
router.get("/get-classic-books", async (req, res) => {
  try {
    const books = await Book.find({ classic: true }).sort({
      updatedAt: -1,
      createdAt: -1,
    });

    return res.json({
      status: "Success",
      data: books,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// GET BOOKS WE LOVE
router.get("/get-books-we-love", async (req, res) => {
  try {
    const books = await Book.find({ booksWeLove: true }).sort({
      updatedAt: -1,
      createdAt: -1,
    });

    return res.json({
      status: "Success",
      data: books,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// RATE A BOOK
router.put("/rate-book", authenticateToken, async (req, res) => {
  try {
    const { id, bookid } = req.headers;
    const rating = Number(req.body.rating);

    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const foundBook = await Book.findById(bookid);

    if (!foundBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    const existingRatingIndex = foundBook.ratings.findIndex(
      (item) => item.user.toString() === id
    );

    if (existingRatingIndex !== -1) {
      foundBook.ratings[existingRatingIndex].value = rating;
    } else {
      foundBook.ratings.push({
        user: id,
        value: rating,
      });
    }

    const totalRatings = foundBook.ratings.reduce(
      (sum, item) => sum + item.value,
      0
    );

    foundBook.numRatings = foundBook.ratings.length;
    foundBook.avgRating = totalRatings / foundBook.numRatings;

    await foundBook.save();

    return res.status(200).json({
      message: "Book rated successfully",
      avgRating: foundBook.avgRating,
      numRatings: foundBook.numRatings,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// ADD OR UPDATE REVIEW
router.put("/add-review", authenticateToken, async (req, res) => {
  try {
    const { id, bookid } = req.headers;
    const { comment, rating } = req.body;

    if (!comment || !rating) {
      return res.status(400).json({ message: "Review and rating required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const foundUser = await user.findById(id);
    const foundBook = await Book.findById(bookid);

    if (!foundBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    const existingReviewIndex = foundBook.reviews.findIndex(
      (item) => item.user.toString() === id
    );

    if (existingReviewIndex !== -1) {
      foundBook.reviews[existingReviewIndex].comment = comment.trim();
      foundBook.reviews[existingReviewIndex].rating = rating;
      foundBook.reviews[existingReviewIndex].createdAt = new Date();
    } else {
      foundBook.reviews.unshift({
        user: id,
        username: foundUser.username,
        comment: comment.trim(),
        rating: rating,
      });
    }

    await foundBook.save();

    return res.status(200).json({
      message:
        existingReviewIndex !== -1
          ? "Review updated successfully"
          : "Review added successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE MY REVIEW
router.delete("/delete-review", authenticateToken, async (req, res) => {
  try {
    const { id, bookid } = req.headers;

    const foundBook = await Book.findById(bookid);

    if (!foundBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    const reviewIndex = foundBook.reviews.findIndex(
      (item) => item.user.toString() === id
    );

    if (reviewIndex === -1) {
      return res.status(404).json({ message: "Review not found" });
    }

    foundBook.reviews.splice(reviewIndex, 1);

    const ratingIndex = foundBook.ratings.findIndex(
      (item) => item.user.toString() === id
    );

    if (ratingIndex !== -1) {
      foundBook.ratings.splice(ratingIndex, 1);
    }

    if (foundBook.ratings.length > 0) {
      const totalRatings = foundBook.ratings.reduce(
        (sum, item) => sum + item.value,
        0
      );
      foundBook.numRatings = foundBook.ratings.length;
      foundBook.avgRating = totalRatings / foundBook.numRatings;
    } else {
      foundBook.numRatings = 0;
      foundBook.avgRating = 0;
    }

    await foundBook.save();

    return res.status(200).json({
      message: "Review deleted successfully",
      avgRating: foundBook.avgRating,
      numRatings: foundBook.numRatings,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// ADD BUNDLE (admin)
router.post("/add-bundle", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    const foundUser = await user.findById(id);

    if (!foundUser || foundUser.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can create bundles",
      });
    }

    const {
      title,
      description,
      books,
      discountPercent,
      image,
    } = req.body;

    if (!books || books.length < 2) {
      return res.status(400).json({
        message: "Bundle needs at least two books",
      });
    }

    const bundle = new Bundle({
      title,
      description,
      books,
      discountPercent,
      image,
    });

    await bundle.save();

    return res.status(200).json({
      message: "Bundle created successfully",
      data: bundle,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// ADD BUNDLE TO FAVOURITE
router.put("/add-bundle-to-favourite", authenticateToken, async (req, res) => {
  try {
    const { id, bundleid } = req.headers;

    if (!bundleid) {
      return res.status(400).json({ message: "Bundle id is required" });
    }

    const foundUser = await user.findById(id);
    const foundBundle = await Bundle.findById(bundleid);

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!foundBundle) {
      return res.status(404).json({ message: "Bundle not found" });
    }

    const alreadyFavourite = foundUser.favouriteBundles.some(
      (item) => item.toString() === bundleid
    );

    if (alreadyFavourite) {
      return res.status(400).json({ message: "Bundle already in favourites" });
    }

    foundUser.favouriteBundles.push(bundleid);
    await foundUser.save();

    return res.status(200).json({
      message: "Bundle added to favourites",
    });
  } catch (error) {
    console.log("ADD BUNDLE FAV ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// GET FAVOURITE BUNDLES
router.get("/get-favourite-bundles", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    const foundUser = await user
      .findById(id)
      .populate({
        path: "favouriteBundles",
        populate: {
          path: "books",
        },
      });

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      status: "success",
      data: foundUser.favouriteBundles,
    });
  } catch (error) {
    console.log("GET FAVOURITE BUNDLES ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// REMOVE BUNDLE FROM FAVOURITE
router.put("/remove-bundle-from-favourite", authenticateToken, async (req, res) => {
  try {
    const { id, bundleid } = req.headers;

    if (!bundleid) {
      return res.status(400).json({ message: "Bundle id is required" });
    }

    const foundUser = await user.findById(id);

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyFavourite = foundUser.favouriteBundles.some(
      (item) => item.toString() === bundleid
    );

    if (!alreadyFavourite) {
      return res.status(400).json({ message: "Bundle is not in favourites" });
    }

    foundUser.favouriteBundles = foundUser.favouriteBundles.filter(
      (item) => item.toString() !== bundleid
    );

    await foundUser.save();

    return res.status(200).json({
      message: "Bundle removed from favourites",
    });
  } catch (error) {
    console.log("REMOVE BUNDLE FAV ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// GET ALL BUNDLES
router.get("/get-bundles", async (req, res) => {
  try {
    const bundles = await Bundle.find({ active: true })
      .populate("books")
      .sort({ createdAt: -1 });

    return res.json({
      status: "Success",
      data: bundles,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// GET SINGLE BUNDLE
router.get("/get-bundle/:id", async (req, res) => {
  try {
    const bundle = await Bundle.findById(req.params.id)
      .populate("books");

    if (!bundle) {
      return res.status(404).json({
        message: "Bundle not found",
      });
    }

    return res.json({
      status: "Success",
      data: bundle,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// SEED DEFAULT FEATURED BUNDLES (admin)
router.post("/seed-default-bundles", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    const foundUser = await user.findById(id);

    if (!foundUser || foundUser.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can seed bundles",
      });
    }

    const defaultBundles = [
      {
        title: "Stoicism Bundle",
        image: "/bundle-stoicism.png",
        description:
          "A timeless collection for wisdom, discipline, inner strength, and calm thinking.",
        discountPercent: 25,
        books: [],
      },
      {
        title: "Cybersecurity Pack",
        image: "/bundle-cybersecurity.png",
        description:
          "A practical starter pack for learning digital safety, hacking basics, and network security.",
        discountPercent: 20,
        books: [],
      },
      {
        title: "Growth Essentials",
        image: "/bundle-growth.png",
        description:
          "Books for better habits, mindset, productivity, and personal improvement.",
        discountPercent: 20,
        books: [],
      },
      {
        title: "Classic Masterpieces",
        image: "/bundle-classics.png",
        description:
          "A beautiful collection of timeless stories that continue to inspire generations.",
        discountPercent: 15,
        books: [],
      },
      {
        title: "Skills Bundle",
        image: "/bundle-skills.png",
        description:
          "Curated reads for practical skills, learning, productivity, and self mastery.",
        discountPercent: 18,
        books: [],
      },
      {
        title: "Romance Bundle",
        image: "/bundle-romance.png",
        description:
          "A dreamy collection of heartfelt love stories, passion, longing, and unforgettable romance.",
        discountPercent: 15,
        books: [],
      },
      {
        title: "Horror Classics",
        image: "/bundle-horror.png",
        description:
          "Dark, haunting stories filled with suspense, gothic atmosphere, and chilling imagination.",
        discountPercent: 20,
        books: [],
      },
      {
        title: "Poetry Lover’s Set",
        image: "/bundle-poetry.png",
        description:
          "A beautiful collection of poetry for reflection, emotion, language, and feeling.",
        discountPercent: 18,
        books: [],
      },
      {
        title: "Mystery Bundle",
        image: "/bundle-mystery.png",
        description:
          "Curated mystery and detective stories filled with suspense, secrets, and hidden clues.",
        discountPercent: 16,
        books: [],
      },
      {
        title: "Fantasy Bundle",
        image: "/bundle-fantasy.png",
        description:
          "Epic fantasy adventures gathered in one magical bundle of worlds, quests, and imagination.",
        discountPercent: 17,
        books: [],
      },
      {
        title: "AI & Tech Bundle",
        image: "/bundle-ai-tech.png",
        description:
          "Essential reads on artificial intelligence, programming, innovation, and emerging technology.",
        discountPercent: 16,
        books: [],
      },
      {
        title: "Leadership Bundle",
        image: "/bundle-leadership.png",
        description:
          "Leadership, business, and strategy books for ambitious readers and future decision-makers.",
        discountPercent: 19,
        books: [],
      },
    ];

    let createdCount = 0;

    for (const bundleItem of defaultBundles) {
      const exists = await Bundle.findOne({ title: bundleItem.title });

      if (!exists) {
        await Bundle.create(bundleItem);
        createdCount++;
      }
    }

    return res.status(200).json({
      message: `${createdCount} default bundles seeded successfully`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// UPDATE BUNDLE (admin)
router.put("/update-bundle/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    const foundUser = await user.findById(id);

    if (!foundUser || foundUser.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can update bundles",
      });
    }

    const updatedBundle = await Bundle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.json({
      message: "Bundle updated successfully",
      data: updatedBundle,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});


// DELETE BUNDLE (admin)
router.delete("/delete-bundle/:id", authenticateToken, async (req,res)=>{
  try{
    const { id } = req.headers;

    const foundUser = await user.findById(id);

    if(!foundUser || foundUser.role !== "admin"){
      return res.status(403).json({
        message:"Only admin can delete bundles"
      });
    }

    await Bundle.findByIdAndDelete(req.params.id);

    return res.json({
      message:"Bundle deleted successfully"
    });

  } catch(error){
    console.log(error);
    return res.status(500).json({
      message:"Internal server error"
    });
  }
});

// get discounted books
router.get("/discounted-books", async (req, res) => {
  try {
    const books = await Book.find({
      originalPrice: { $gt: 0 },
      $expr: { $gt: ["$originalPrice", "$price"] },
    })
      .sort({ updatedAt: -1, createdAt: -1 })
      .limit(8);

    return res.status(200).json({
      status: "success",
      data: books,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
