import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../layout/Layout";
import AppSnackbar from "../components/AppSnackbar";
import { getCoverTheme, getBookCoverCandidates } from "../utils/covers";

import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Stack,
  CircularProgress,
  Box,
  Chip,
  TextField,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SearchIcon from "@mui/icons-material/Search";

const PAGE_SIZE = 6;

// ✅ Extract username from JWT
const getUsernameFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub;
  } catch {
    return null;
  }
};

// ✅ Book Cover Image Component with Fallback
const BookCoverImage = ({ book, coverTheme }) => {
  const coverCandidates = getBookCoverCandidates(book);
  const [coverIndex, setCoverIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const coverUrl = coverCandidates[coverIndex] || null;

  useEffect(() => {
    setCoverIndex(0);
    setImageLoaded(false);
  }, [book?.id, book?.isbn, book?.imageUrl, book?.title, book?.author]);

  const handleImageError = () => {
    setImageLoaded(false);
    setCoverIndex((prev) => prev + 1);
  };

  const showPlaceholder = !coverUrl;

  return (
    <Box
      sx={{
        height: 200,
        borderRadius: 2,
        mb: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        background: coverTheme.background,
        border: `1px solid ${coverTheme.border}`,
        overflow: "hidden",
        position: "relative"
      }}
    >
      {coverUrl && (
        <img
          src={coverUrl}
          alt={book.title}
          onLoad={() => setImageLoaded(true)}
          onError={handleImageError}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: imageLoaded ? 1 : 0,
            transition: "opacity 0.3s ease-in-out"
          }}
        />
      )}
      {(showPlaceholder || !imageLoaded) && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%"
          }}
        >
          <MenuBookIcon sx={{ fontSize: 44, color: coverTheme.icon, mb: 0.5 }} />
          <Typography variant="caption" sx={{ color: coverTheme.text, fontWeight: 700, textAlign: "center", px: 1 }}>
            {book.category || "General"}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default function Books() {

  const currentUser = getUsernameFromToken();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [titleFilter, setTitleFilter] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categories, setCategories] = useState([]);

  // ================= FETCH =================
  const fetchBooks = async (pageNumber = 0, overrides = null) => {
    try {
      setLoading(true);
      setError("");

      const activeTitle = overrides?.title ?? titleFilter;
      const activeAuthor = overrides?.author ?? authorFilter;
      const activeAvailability = overrides?.availability ?? availabilityFilter;
      const activeCategory = overrides?.category ?? categoryFilter;

      const params = {};
      if (activeTitle.trim()) params.title = activeTitle.trim();
      if (activeAuthor.trim()) params.author = activeAuthor.trim();
      if (activeAvailability === "available") params.available = true;
      if (activeAvailability === "borrowed") params.available = false;
      if (activeCategory !== "all") params.category = activeCategory;

      const res = await api.get("/books/filter", { params });
      const allBooks = Array.isArray(res.data) ? res.data : [];

      const categoryValues = [...new Set(allBooks
        .map((b) => b.category)
        .filter((c) => typeof c === "string" && c.trim()))];
      setCategories(categoryValues.sort((a, b) => a.localeCompare(b)));

      const total = allBooks.length;
      const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
      const safePage = Math.min(Math.max(pageNumber, 0), pages - 1);
      const start = safePage * PAGE_SIZE;
      const end = start + PAGE_SIZE;

      setBooks(allBooks.slice(start, end));
      setTotalPages(pages);
      setPage(safePage);

    } catch (err) {
      console.error(err);
      setError("Unable to load books.");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(0);
    // Initial load only; subsequent fetches are triggered by explicit user actions.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ================= ACTIONS =================

  const handleSearch = () => {
    fetchBooks(0);
  };

  const handleReset = () => {
    setTitleFilter("");
    setAuthorFilter("");
    setAvailabilityFilter("all");
    setCategoryFilter("all");
    fetchBooks(0, {
      title: "",
      author: "",
      availability: "all",
      category: "all"
    });
  };

  const handlePageChange = (event, value) => {
    fetchBooks(value - 1);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const borrowBook = async (id) => {
    try {
      await api.put(`/books/${id}/borrow`);
      showSnackbar("Book borrowed successfully");
      fetchBooks(page);
    } catch (err) {
      console.error(err);
      showSnackbar("Unable to borrow book", "error");
    }
  };

  const returnBook = async (id) => {
    try {
      await api.put(`/books/${id}/return`);
      showSnackbar("Book returned successfully");
      fetchBooks(page);
    } catch (err) {
      console.error(err);
      showSnackbar("Unable to return book", "error");
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <Layout>
        <Box 
          display="flex" 
          flexDirection="column"
          alignItems="center" 
          justifyContent="center" 
          mt={8}
          mb={8}
        >
          <CircularProgress sx={{ mb: 2 }} size={50} />
          <Typography color="text.secondary" variant="body1">
            Loading books...
          </Typography>
        </Box>
      </Layout>
    );
  }

  // ================= UI =================

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        Books
      </Typography>

      {/* SEARCH */}
      <Box 
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" },
          gap: 2,
          mb: 3,
          alignItems: "flex-end"
        }}
      >
        <TextField
          label="Search by title"
          size="small"
          fullWidth
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />

        <TextField
          label="Filter by author"
          size="small"
          fullWidth
          value={authorFilter}
          onChange={(e) => setAuthorFilter(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />

        <FormControl size="small" fullWidth>
          <InputLabel>Availability</InputLabel>
          <Select
            value={availabilityFilter}
            label="Availability"
            onChange={(e) => setAvailabilityFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="available">Available</MenuItem>
            <MenuItem value="borrowed">Borrowed</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter}
            label="Category"
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button 
          variant="contained" 
          onClick={handleSearch}
          fullWidth
          sx={{ 
            gridColumn: { xs: "1", sm: "1 / -1", md: "auto" },
            borderRadius: 2.5,
            fontWeight: 600,
            background: "linear-gradient(90deg, #2563EB, #1D4ED8)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              transform: "scale(1.02)",
              boxShadow: "0 12px 32px rgba(37, 99, 235, 0.4)",
              background: "linear-gradient(90deg, #1D4ED8, #1E40AF)"
            },
            "&:active": {
              transform: "scale(0.98)"
            }
          }}
        >
          Search
        </Button>
        <Button 
          variant="outlined" 
          onClick={handleReset}
          fullWidth
          sx={{ 
            gridColumn: { xs: "1", sm: "1 / -1", md: "auto" },
            borderRadius: 2.5,
            fontWeight: 600,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              transform: "scale(1.02)",
              boxShadow: "0 8px 24px rgba(37, 99, 235, 0.2)"
            }
          }}
        >
          Reset
        </Button>
      </Box>

      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

      {books.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
            borderRadius: 2,
            backgroundColor: "#F9FAFB",
            border: "2px dashed #E5E7EB"
          }}
        >
          <SearchIcon sx={{ fontSize: 60, color: "#D1D5DB", mb: 2 }} />
          <Typography variant="h6" fontWeight={600} color="text.secondary" mb={1}>
            No books found
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" mb={2}>
            Try adjusting your search filters or browse all books
          </Typography>
          <Button 
            variant="outlined"
            onClick={handleReset}
            sx={{
              borderRadius: 2.5,
              textTransform: "none",
              fontWeight: 600,
              mt: 2
            }}
          >
            Reset Filters
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {books.map((book) => {
            const isMine = book.issuedTo === currentUser;
            const isOverdue = Boolean(book.dueDate) && !book.available && new Date(book.dueDate) < new Date();
            const coverTheme = getCoverTheme(book.category);

            return (
              <Grid item xs={12} md={6} lg={4} key={book.id}>
                <Card
                  sx={{
                    borderRadius: 2.5,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.1), 0 0 32px rgba(59, 130, 246, 0.05)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    height: "100%",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 16px 48px rgba(0,0,0,0.12), 0 0 48px rgba(59, 130, 246, 0.08)"
                    }
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <BookCoverImage book={book} coverTheme={coverTheme} />

                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {book.title}
                    </Typography>

                    <Typography color="text.secondary" sx={{ mb: 1 }}>
                      {book.author}
                    </Typography>

                    {book.category && (
                      <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
                        Category: {book.category}
                      </Typography>
                    )}

                    <Box mt={1.5} mb={1.5}>
                      {book.available ? (
                        <Chip label="AVAILABLE" color="success" />
                      ) : isOverdue ? (
                        <Chip label="OVERDUE" color="error" />
                      ) : isMine ? (
                        <Chip label="Borrowed by YOU" color="warning" />
                      ) : (
                        <Chip label="Not Available" color="error" />
                      )}
                    </Box>

                    {/* ✅ Due Date */}
                    {book.dueDate && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Due: {new Date(book.dueDate).toLocaleString()}
                      </Typography>
                    )}

                    {/* ✅ Fine */}
                    {book.fineAmount > 0 && (
                      <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                        Fine: ₹{Number(book.fineAmount).toFixed(2)}
                      </Typography>
                    )}

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1} mt={2.5}>

                      {/* BORROW */}
                      {book.available && (
                        <Button
                          variant="contained"
                          size="large"
                          onClick={() => borrowBook(book.id)}
                          fullWidth
                          sx={{
                            borderRadius: 2,
                            fontWeight: 800,
                            fontSize: "1rem",
                            py: 1.4,
                            letterSpacing: 0.8,
                            background: "linear-gradient(90deg, #10B981, #059669)",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            "&:hover": {
                              transform: "scale(1.04)",
                              boxShadow: "0 8px 24px rgba(16, 185, 129, 0.4)",
                              background: "linear-gradient(90deg, #059669, #047857)"
                            }
                          }}
                        >
                          BORROW
                        </Button>
                      )}

                      {/* RETURN (ONLY YOUR BOOK) */}
                      {!book.available && isMine && (
                        <Button
                          variant="contained"
                          onClick={() => returnBook(book.id)}
                          fullWidth
                          sx={{
                            borderRadius: 2,
                            fontWeight: 600,
                            background: "linear-gradient(90deg, #F59E0B, #D97706)",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            "&:hover": {
                              transform: "scale(1.04)",
                              boxShadow: "0 8px 24px rgba(245, 158, 11, 0.4)",
                              background: "linear-gradient(90deg, #D97706, #B45309)"
                            }
                          }}
                        >
                          Return
                        </Button>
                      )}

                    </Stack>

                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={totalPages}
          page={page + 1}
          onChange={handlePageChange}
        />
      </Box>

      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />

    </Layout>
  );
}