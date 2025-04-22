import { useState, useEffect } from 'react'
import Head from 'next/head'
import BookCard from '../components/BookCard'
import AuthButton from '../components/AuthButton'
import axios from 'axios'

// Predefined list of book subjects for featured/random selection
const subjects = [
  'fantasy', 'science_fiction', 'romance', 'mystery',
  'biographies', 'history', 'adventure', 'horror', 'children', 'young_adult'
]

// Simple shuffle function to randomize the book order
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5)
}

export default function Home() {
  // State to track the search query
  const [query, setQuery] = useState('')
  // Search result books
  const [results, setResults] = useState([])
  // Featured books displayed when no search is active
  const [featured, setFeatured] = useState([])

  // useEffect to fetch featured/random books on page load
  useEffect(() => {
    const loadRandomBooks = async () => {
      // Pick a random subject and offset for variety
      const randomSubject = subjects[Math.floor(Math.random() * subjects.length)]
      const randomOffset = Math.floor(Math.random() * 10) * 20 // up to 200 items skip

      try {
        // Fetch books by subject using Open Library API
        const res = await axios.get(`https://openlibrary.org/subjects/${randomSubject}.json?limit=50&offset=${randomOffset}`)
        const works = res.data.works || []
        const randomBooks = shuffle(works).slice(0, 16) // Get top 16 shuffled books
        setFeatured(randomBooks)
      } catch (err) {
        console.error('Failed to fetch random books:', err)
      }
    }

    loadRandomBooks()
  }, [])

  // Handles user-initiated search from the form
  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query) return

    try {
      // Fetch search results from Open Library API
      const res = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`)
      setResults(res.data.docs.slice(0, 20)) // Limit to top 20 results
    } catch (err) {
      console.error('Search failed:', err)
    }
  }

  return (
    <>
      {/* Page metadata */}
      <Head>
        <title>BookSphere</title>
      </Head>

      <div className="container mx-auto px-6 py-12">
        {/* Search bar */}
        <form onSubmit={handleSearch} className="mb-12 flex justify-center">
          <div className="relative w-full max-w-lg">
            <input
              type="text"
              placeholder="Search books..."
              className="input h-12 w-full p-6 rounded-4xl shadow-custom border border-black focus:outline-none focus:ring-2 focus:ring-primary-light"
              value={query}
              onChange={(e) => setQuery(e.target.value)} // Update search query
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 btn bg-primary text-white border-none rounded-full px-4 py-2"
            >
              Search
            </button>
          </div>
        </form>

        {/* Display search results or featured books */}
        {results.length > 0 ? (
          <>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Search Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10">
              {results.map((book) => (
                // Render each search result using BookCard
                <BookCard key={book.key} book={book} />
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Discover New Reads</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10">
              {featured.map((book) => (
                // Render each featured book using BookCard with normalized structure
                <BookCard
                  key={book.key}
                  book={{
                    key: book.key,
                    title: book.title,
                    author_name: book.authors?.map((a) => a.name),
                    cover_i: book.cover_id
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}
