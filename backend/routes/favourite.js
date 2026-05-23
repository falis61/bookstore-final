const router = require("express").Router();
const User = require("../models/user");
const {authenticateToken} = require("./userAuth");


// add book to favourite
router.put("/add-book-to-favourite", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;

    const userData = await User.findById(id);

    const isBookFavourite = userData.favourites.includes(bookid);
    if (isBookFavourite) {
      return res.status(200).json({ message: "Book is already in favourites" });
    }

    await User.findByIdAndUpdate(id, {
      $push: { favourites: bookid }
    });

    return res.status(200).json({ message: "Book added to favourites" });

  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// delete book from favourite
router.put("/remove-book-from-favourite", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const foundUser = await User.findById(id);
    const isBookfavourate = foundUser.favourites.includes(bookid);
    if (isBookfavourate) {
      await User.findByIdAndUpdate(id, {$pull: {favourites: bookid}});
    }

    
    return res.status(200).json({ message: "Book removed from favourites" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get favourite books
router.get("/get-favourite-books", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const foundUser = await User.findById(id).populate("favourites");
    const favouriteBooks = foundUser.favourites;
    return res.json({
      status: "success",
      data: favouriteBooks,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "an error occured " });
  }
});

module.exports = router;
