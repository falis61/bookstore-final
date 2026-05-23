import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Subjects = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get(
          "http://localhost:1000/api/v1/get-all-books"
        );

        setBooks(res.data.data || []);
      } catch (error) {
        console.log("Error fetching subjects:", error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const groupedSubjects = useMemo(() => {
    const groups = {
      Literature: [],
      Kids: [],
      History: [],
      Science: [],
      Technology: [],
      Business: [],
      Education: [],
      Arts: [],
      Health: [],
      Other: [],
    };

    books.forEach((book) => {
      const categories = book.category
        ?.split(",")
        .map((c) => c.trim())
        .filter(Boolean);

      categories?.forEach((cat) => {
        const category = cat.toLowerCase();

        if (
          [
            "fantasy",
            "fiction",
            "romance",
            "poetry",
            "thriller",
            "mystery",
            "literature",
            "novel",
            "young adult",
            "young-adult",
            "horror",
            "short stories",
            "drama",
            "classic",
            "classics",
            "crime",
          ].includes(category)
        ) {
          if (!groups.Literature.includes(cat)) groups.Literature.push(cat);
        } else if (
          [
            "kids",
            "children",
            "childrens",
            "children's",
            "picture books",
            "baby books",
            "bedtime books",
            "stories in rhyme",
          ].includes(category)
        ) {
          if (!groups.Kids.includes(cat)) groups.Kids.push(cat);
        } else if (
          [
            "history",
            "ancient history",
            "medieval history",
            "modern history",
            "world war",
            "world war i",
            "world war ii",
            "civilization",
            "civilizations",
            "cultural history",
            "biography",
            "memoir",
          ].includes(category)
        ) {
          if (!groups.History.includes(cat)) groups.History.push(cat);
        } else if (
          [
            "science",
            "physics",
            "chemistry",
            "biology",
            "mathematics",
            "math",
            "astronomy",
            "environment",
            "nature",
          ].includes(category)
        ) {
          if (!groups.Science.includes(cat)) groups.Science.push(cat);
        } else if (
          [
            "technology",
            "cybersecurity",
            "cyber security",
            "programming",
            "coding",
            "computer science",
            "software engineering",
            "artificial intelligence",
            "ai",
            "machine learning",
            "data science",
            "networking",
            "web development",
            "database",
            "databases",
          ].includes(category)
        ) {
          if (!groups.Technology.includes(cat)) groups.Technology.push(cat);
        } else if (
          [
            "business",
            "finance",
            "economics",
            "marketing",
            "management",
            "entrepreneurship",
          ].includes(category)
        ) {
          if (!groups.Business.includes(cat)) groups.Business.push(cat);
        } else if (
          [
            "education",
            "learning",
            "teaching",
            "textbook",
            "textbooks",
            "study",
            "academic",
          ].includes(category)
        ) {
          if (!groups.Education.includes(cat)) groups.Education.push(cat);
        } else if (
          [
            "architecture",
            "art",
            "design",
            "fashion",
            "film",
            "music",
            "painting",
            "photography",
            "graphic design",
            "dance",
          ].includes(category)
        ) {
          if (!groups.Arts.includes(cat)) groups.Arts.push(cat);
        } else if (
          [
            "health",
            "wellness",
            "fitness",
            "nutrition",
            "cooking",
            "psychology",
            "self help",
            "self-help",
          ].includes(category)
        ) {
          if (!groups.Health.includes(cat)) groups.Health.push(cat);
        } else {
          if (!groups.Other.includes(cat)) groups.Other.push(cat);
        }
      });
    });

    return Object.entries(groups)
      .filter(([_, items]) => items.length > 0)
      .map(([title, subjects]) => ({
        title,
        subjects: subjects.sort((a, b) => a.localeCompare(b)),
      }));
  }, [books]);

  return (
    <div className="min-h-screen bg-[#F8F4EC] px-6 md:px-12 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Title */}
        <h1 className="text-5xl font-serif text-[#3B2218] font-semibold mb-8">
          Subjects
        </h1>

        {loading ? (
          <p className="text-[#5A3E2B] text-lg">Loading subjects...</p>
        ) : groupedSubjects.length === 0 ? (
          <p className="text-[#5A3E2B] text-lg">No subjects found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-10 mb-12">
            {groupedSubjects.map((group) => (
              <div key={group.title}>
                <h2 className="text-2xl font-semibold text-[#3B2218] mb-3">
                  {group.title}
                </h2>

                <ul className="space-y-1.5 list-disc pl-5 marker:text-[#6B5748]">
                  {group.subjects.map((subject, index) => (
                    <li key={index}>
                      <Link
                        to={`/category/${subject
                          .toLowerCase()
                          .replace(/ /g, "-")}`}
                        className="text-[#0B5CAD] hover:text-[#3B2218] transition text-[16.5px]"
                      >
                        {subject}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Explanation */}
        <div className="border-t border-[#E7DCCD]/60 pt-8 text-[#5A3E2B] leading-7">
          <h2 className="text-2xl font-semibold text-[#3B2218] mb-4">
            What’s a subject heading?
          </h2>

          <p className="mb-4">
            A subject heading is a way to organize books based on topics, themes,
            or ideas. Instead of searching only by title or author, subject
            headings help readers discover books through interests like Arts,
            Literature, Science, Technology, or History.
          </p>

          <p className="mb-4">
            These subjects load automatically from the categories saved in your
            book database. When you add a new book with a new category, it can
            appear here automatically.
          </p>

          <p>
            Each subject acts like a pathway. Click one to explore books related
            to that topic.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Subjects;