import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import ReviewList from '../../components/ReviewList';
import ReviewForm from '../../components/ReviewForm';
import { auth, fetchReviewsByBook } from '../../lib/firebase';

export default function Book() {
  const router = useRouter();
  const { id } = router.query; // e.g., "OL123W"
  const [book, setBook] = useState(null);
  const [username, setUsername] = useState('');
  const [reviews, setReviews] = useState([]);

  // Format bookId to include "/works/"
  const bookId = id ? `/works/${id}` : null;

  // Fetch book details
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await axios.get(`https://openlibrary.org/works/${id}.json`);
        setBook(res.data);
      } catch (err) {
        console.error('Failed to fetch book:', err);
      }
    })();
  }, [id]);

  // Fetch reviews
  const fetchReviews = async () => {
    if (!bookId) return;
    try {
      const snap = await fetchReviewsByBook(bookId);
      const reviewData = snap?.docs.map(d => ({ id: d.id, ...d.data() })) || [];
      setReviews(reviewData);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [bookId]);

  // Get username from profiles collection or fallback to email
  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Ideally, fetch username from profiles collection, but for now use email
        setUsername(user.email); // user.username doesn't exist; use email as fallback
      } else {
        setUsername('');
      }
    });
  }, []);

  if (!book) return <div>Loading...</div>;

  return (
    <>
      <Head><title>{book.title} – BookSphere</title></Head>
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/3">
            <img
              src={book.covers ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg` : '/placeholder.png'}
              alt={book.title}
              className="w-full aspect-[2/3] object-cover rounded-lg shadow-custom"
            />
          </div>
          <div className="md:w-2/3">
            <h1 className="text-4xl font-bold text-primary">{book.title}</h1>
            <p className="text-foreground/70 mt-2">
              {book.authors?.map(a => a.name).join(', ')}
            </p>
            <p className="mt-4 text-foreground">{book.description?.value || book.description || 'No description available.'}</p>
          </div>
        </div>
        {username && <ReviewForm bookId={bookId} username={username} onReviewSubmitted={fetchReviews} />}
        <ReviewList bookId={bookId} reviews={reviews} />
      </div>
    </>
  );
}