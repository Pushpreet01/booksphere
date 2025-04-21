import { useState } from 'react';
import { addReview, auth } from '../lib/firebase';
import axios from 'axios';

export default function ReviewForm({ bookId, username, onReviewSubmitted }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return alert('Please log in to leave a review.');

    try {
      // Ensure bookId is defined
      if (!bookId) {
        throw new Error('Book ID is missing.');
      }

      // Prepend "/works/" to bookId if it doesn't already start with it
      const formattedBookId = bookId.startsWith('/works/') ? bookId : `/works/${bookId}`;

      // Fetch the book title from Open Library API
      let bookTitle = 'Unknown Book';
      try {
        const bookResponse = await axios.get(`https://openlibrary.org${formattedBookId}.json`);
        bookTitle = bookResponse.data.title || 'Unknown Book';
      } catch (apiError) {
        console.error('Failed to fetch book title:', apiError.message);
        alert('Could not fetch book title due to a network error. Proceeding with a default title.');
      }

      // Submit the review with the book title
      await addReview({
        bookId: formattedBookId,
        uid: user.uid,
        username,
        rating,
        comment,
        bookTitle,
      });
      setRating(5);
      setComment('');
      alert('Review submitted!');

      // Call the callback to refresh reviews in the parent component
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      alert(`Failed to submit review: ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-8 flex flex-col bg-base-100 p-6 rounded-lg shadow-custom border border-primary-light/30">
      <div>
        <label className="block mb-2 text-foreground font-semibold">Rating:</label>
        <select
          className="select h-12 px-4 rounded-2xl shadow-custom border border-black focus:outline-none focus:ring-2 focus:ring-primary-light"
          value={rating}
          onChange={(e) => setRating(+e.target.value)}
        >
          {[1,2,3,4,5].map(n => (
            <option key={n} value={n}>
              {n} Star{n>1 && 's'}
            </option>
          ))}
        </select>
      </div>
      <textarea
        className="textarea h-28 w-100 p-2 rounded-2xl shadow-custom border border-black focus:outline-none focus:ring-2 focus:ring-primary-light"
        placeholder="Write your thoughts..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />
      <button type="submit" className="btn bg-primary text-white border-none rounded-full px-4 py-2 w-100 hover:bg-primary-light">
        Submit Review
      </button>
    </form>
  );
}