/**
 * Shared utility for book cover theming and image URLs
 * Provides category-based color themes and cover image resolution
 */

export const getCoverTheme = (category) => {
  const value = String(category || "").toLowerCase();

  if (value.includes("science") || value.includes("tech")) {
    return {
      background: "linear-gradient(135deg, #CFFAFE 0%, #A5F3FC 100%)",
      border: "#67E8F9",
      icon: "#0E7490",
      text: "#155E75"
    };
  }

  if (value.includes("fiction") || value.includes("novel")) {
    return {
      background: "linear-gradient(135deg, #FDE68A 0%, #FCD34D 100%)",
      border: "#F59E0B",
      icon: "#B45309",
      text: "#92400E"
    };
  }

  if (value.includes("history") || value.includes("biography")) {
    return {
      background: "linear-gradient(135deg, #FED7AA 0%, #FDBA74 100%)",
      border: "#FB923C",
      icon: "#C2410C",
      text: "#9A3412"
    };
  }

  return {
    background: "linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)",
    border: "#93C5FD",
    icon: "#1D4ED8",
    text: "#1E3A8A"
  };
};

/**
 * Get the cover image URL for a book
 * Prefers actual cover image if available, falls back to placeholder
 */
const normalizeIsbn = (isbn) => String(isbn || "").replace(/[^0-9Xx]/g, "");

const encode = (value) => encodeURIComponent(String(value || "").trim());

export const getBookCoverCandidates = (book) => {
  const candidates = [];
  const isbn = normalizeIsbn(book?.isbn);
  const title = String(book?.title || "").trim();
  const author = String(book?.author || "").trim();

  if (book?.imageUrl && book.imageUrl.trim()) {
    candidates.push(book.imageUrl.trim());
  }

  if (isbn) {
    candidates.push(`https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`);
    candidates.push(`https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg?default=false`);
    candidates.push(`https://books.google.com/books/content?vid=ISBN${isbn}&printsec=frontcover&img=1&zoom=1&source=gbs_api`);
  }

  if (title) {
    const qTitle = encode(title);
    const qAuthor = encode(author);
    candidates.push(`https://bookcover.longitood.com/bookcover?book_title=${qTitle}&author_name=${qAuthor}`);
  }

  return [...new Set(candidates)].filter(Boolean);
};

export const getBookCoverUrl = (book) => getBookCoverCandidates(book)[0] || null;
