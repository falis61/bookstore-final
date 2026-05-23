import React from "react";
import Hero from "../components/Home/Hero";
import RecentlyAdded from "../components/Home/RecentlyAdded";
import MostPopular from "../components/Home/MostPopular";
import AboutPreview from "../components/AboutPreview";
import FeaturedCollections from "../components/Home/FeaturedCollections";
import TrendingBooks from "../components/Home/TrendingBooks";
import ClassicBooks from "../components/Home/ClassicBooks";
import BooksWeLove from "../components/Home/BooksWeLove";
import RecentlyViewedBooks from "../components/Home/RecentlyViewedBooks";
import FeaturedBundles from "../components/Home/FeaturedBundles";
import DiscountedBooks from "../components/Home/DiscountedBooks";

const Home = () => {
  return (
    <div>
      <Hero />
      <AboutPreview />
      <FeaturedCollections />
       <FeaturedBundles />
       <DiscountedBooks />
      <RecentlyViewedBooks />
      <RecentlyAdded />
      <MostPopular />
      <TrendingBooks />
      <ClassicBooks />
      <BooksWeLove />
    </div>
  );
};

export default Home;