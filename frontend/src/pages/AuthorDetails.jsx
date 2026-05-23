import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const AuthorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [author, setAuthor] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthorDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:1000/api/v1/author-details/${id}`
        );

        setAuthor(response.data.data.author);
        setBooks(response.data.data.books || []);
      } catch (error) {
        console.log("Author details error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorDetails();
  }, [id]);

  const handleBookClick = (bookId) => {
    navigate(`/view-book-details/${bookId}`);
  };

  if (loading) {
    return (
      <div className="bg-[#F5F1E6] min-h-screen px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#5A4335] text-lg">Loading author...</p>
        </div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="bg-[#F5F1E6] min-h-screen px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#5A4335] text-lg">Author not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F1E6] min-h-screen px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* AUTHOR HEADER */}
        <div className="bg-[#FBF7EF] border border-[#D6C3A3] rounded-[18px] p-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6">
            
            <div className="w-full md:w-[180px] h-[230px] rounded-[16px] overflow-hidden bg-[#F3E7D7] border border-[#D6C3A3] flex items-center justify-center">
              {author.image ? (
                <img
                  src={author.image}
                  alt={author.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[#7B6253] text-sm">
                  No Image
                </span>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-4xl font-serif text-[#3B2218]">
                {author.name}
              </h1>

              {/* AUTHOR META */}
              <div className="mt-3 space-y-2 text-[#7B6253] text-base">
                
                {(author.born || author.died) && (
                  <p>
                    <span className="font-medium text-[#5A4335]">
                      Born:
                    </span>{" "}
                    {author.born || "?"}
                    {author.died
                      ? ` - ${author.died}`
                      : author.born
                      ? " -"
                      : ""}
                  </p>
                )}

                {author.nationality && (
                  <p>
                    <span className="font-medium text-[#5A4335]">
                      Nationality:
                    </span>{" "}
                    {author.nationality}
                  </p>
                )}

                {author.genre && (
                  <p>
                    <span className="font-medium text-[#5A4335]">
                      Genre:
                    </span>{" "}
                    {author.genre}
                  </p>
                )}
              </div>

              <p className="text-[#5A4335] text-base mt-5 leading-8">
                {author.description}
              </p>

              <p className="text-[#7B6253] text-sm mt-5">
                {books.length}{" "}
                {books.length === 1 ? "book" : "books"} available
              </p>
            </div>
          </div>
        </div>

        {/* AUTHOR BOOKS */}
        <div className="mt-10">
          <h2 className="text-3xl font-serif text-[#3B2218] mb-6">
            Books by {author.name}
          </h2>

          {books.length === 0 ? (
            <p className="text-[#5A4335]">
              No books found for this author.
            </p>
          ) : (
            <div className="space-y-5">
              {books.map((book) => (
                <div
                  key={book._id}
                  onClick={() => handleBookClick(book._id)}
                  className="bg-[#FBF7EF] border border-[#D6C3A3] rounded-[18px] p-5 shadow-sm hover:shadow-md transition cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row gap-5">
                    <div className="w-full md:w-[95px] h-[120px] rounded-[14px] overflow-hidden bg-[#F3E7D7] border border-[#D6C3A3] flex items-center justify-center">
                      <img
                        src={book.url}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-left text-2xl font-serif text-[#2B5D87] hover:underline">
                        {book.title}
                      </h3>

                      <p className="text-[#6E5A4D] text-sm leading-7 mt-3 capitalize">
                        {book.category}
                        {book.language
                          ? ` · ${book.language}`
                          : ""}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <span className="px-3 py-1.5 rounded-full bg-[#F5EBDD] text-[#5A4335] text-sm border border-[#E1CFB2]">
                          ${book.price}
                        </span>

                        {book.stock !== undefined && (
                          <span className="text-sm text-[#7B6253]">
                            Stock: {book.stock}
                          </span>
                        )}
                      </div>

                      {book.desc && (
                        <p className="text-[#6E5A4D] text-sm leading-7 mt-4 line-clamp-2">
                          {book.desc}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AuthorDetails;