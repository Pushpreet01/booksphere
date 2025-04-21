import Link from 'next/link'

export default function BookCard({ book }) {
  const cover = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : '/placeholder.png'

  return (
    <Link
      href={`/books/${book.key.replace('/works/', '')}`}
      className="card w-48 bg-base-100 shadow-custom hover:shadow-purple hover:scale-105 transition-all duration-300 rounded-lg overflow-hidden border border-primary-light/30 hover:border-primary"
    >
      <figure>
        <img
          src={cover}
          alt={book.title}
          className="w-full aspect-[2/3] object-cover"
        />
      </figure>
      <div className="card-body p-4">
        <h2 className="card-title text-primary text-lg">{book.title}</h2>
        <p className="text-sm text-foreground/70">
          {book.author_name?.join(', ')}
        </p>
      </div>
    </Link>
  )
}