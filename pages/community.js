import Head from 'next/head';
import AuthButton from '../components/AuthButton';
import ReviewList from '../components/ReviewList';

export default function Community() {
  return (
    <>
      <Head><title>Community Feed – BookSphere</title></Head>
      <div className="container mx-auto px-6 py-12">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-5xl font-bold text-primary uppercase tracking-wider">Community Feed</h1>
        </header>
        <div className="bg-base-100 p-8 rounded-lg shadow-custom">
          <ReviewList isFeed />
        </div>
      </div>
    </>
  );
}