import { useState, useEffect } from 'react';
import { fetchReviewsByBook, fetchReviewsByUser, fetchAllReviews } from '../lib/firebase';
import { Timestamp } from 'firebase/firestore';
import Link from 'next/link';

export default function ReviewList({ bookId, username, isFeed, reviews: propReviews }) {
  const [reviews, setReviews] = useState(propReviews || []);

  useEffect(() => {
    // Update local state if propReviews changes
    if (propReviews) {
      setReviews(propReviews);
      return;
    }

    // Fetch reviews if propReviews is not provided
    (async () => {
      let snap;
      if (isFeed) {
        snap = await fetchAllReviews();
      } else if (bookId) {
        snap = await fetchReviewsByBook(bookId);
      } else if (username) {
        snap = await fetchReviewsByUser(username);
      }
      const reviewData = snap?.docs.map(d => ({ id: d.id, ...d.data() })) || [];
      setReviews(reviewData);
    })();
  }, [bookId, username, isFeed, propReviews]);

  if (!reviews.length) return <p className="text-foreground/70">No reviews yet.</p>;

  return (
    <div className="space-y-4 mt-8">
      {reviews.map(r => {
        const date = r.createdAt instanceof Timestamp
          ? r.createdAt.toDate().toLocaleDateString()
          : '';
        return (
          <Link
            key={r.id}
            href={`/books/${r.bookId.replace('/works/', '')}`}
            className="block p-6 border border-primary-light/30 rounded-lg shadow-custom hover:shadow-purple hover:scale-105 transition-all duration-300"
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-foreground">{r.username}</span>
              <span className="text-primary">{'★'.repeat(r.rating)}</span>
            </div>
            {isFeed && (
              <p className="mt-2 text-foreground font-semibold">{r.bookTitle || 'Unknown Book'}</p>
            )}
            <p className="mt-2 text-foreground/70">{r.comment}</p>
            <p className="text-xs text-foreground/70 mt-1">{date}</p>
          </Link>
        );
      })}
    </div>
  );
}