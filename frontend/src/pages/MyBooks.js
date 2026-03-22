import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../layout/Layout";
import { getCoverTheme, getBookCoverCandidates } from "../utils/covers";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Box,
  CircularProgress,
  Stack,
  Button
} from "@mui/material";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AppSnackbar from "../components/AppSnackbar";

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

export default function MyBooks() {

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const fetchMyBooks = async () => {
    try {
      const res = await api.get("/books/my");
      setBooks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error loading my books:", err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const returnBook = async (id) => {
    try {
      await api.put(`/books/${id}/return`);
      showSnackbar("Book returned successfully");
      fetchMyBooks();
    } catch (err) {
      console.error("Error returning book:", err);
      showSnackbar("Unable to return book", "error");
    }
  };

  useEffect(() => {
    fetchMyBooks();
    // Initial load only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔄 Loading state
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
            Loading your borrowed books...
          </Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        My Borrowed Books
      </Typography>

      <Typography variant="body1" color="text.secondary" mb={3}>
        View and manage all books you've borrowed
      </Typography>

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
          <LibraryBooksIcon sx={{ fontSize: 60, color: "#D1D5DB", mb: 2 }} />
          <Typography variant="h6" fontWeight={600} color="text.secondary" mb={1}>
            No borrowed books yet
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Start exploring the library and borrow your first book!
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {books.map((book) => {
            const isOverdue = Boolean(book.dueDate) && new Date(book.dueDate) < new Date();
            const dueDate = book.dueDate ? new Date(book.dueDate) : null;
            const hoursToDue = dueDate ? (dueDate.getTime() - Date.now()) / (1000 * 60 * 60) : null;
            const isDueSoon = hoursToDue !== null && hoursToDue >= 0 && hoursToDue <= 48;
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

                  <Typography variant="h6" fontWeight={600} mb={1}>
                    {book.title}
                  </Typography>

                  <Typography color="text.secondary" mb={2}>
                    {book.author}
                  </Typography>

                  <Box mb={2}>
                    <Chip
                      label={isOverdue ? "Overdue" : "Borrowed"}
                      color={isOverdue ? "error" : "warning"}
                      size="small"
                    />
                  </Box>

                  {book.dueDate && (
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 1,
                        fontWeight: isOverdue || isDueSoon ? 700 : 500,
                        color: isOverdue || isDueSoon ? "error.main" : "text.primary"
                      }}
                    >
                      Due: {new Date(book.dueDate).toLocaleString()}
                    </Typography>
                  )}

                  {book.fineAmount > 0 && (
                    <Typography variant="body2" color="error">
                      Fine: ₹{Number(book.fineAmount).toFixed(2)}
                    </Typography>
                  )}

                  <Stack direction="row" spacing={1} mt={2.5}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => returnBook(book.id)}
                      sx={{
                        borderRadius: 2,
                        fontWeight: 700,
                        background: "linear-gradient(90deg, #F59E0B, #D97706)",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          transform: "scale(1.03)",
                          boxShadow: "0 8px 24px rgba(245, 158, 11, 0.35)",
                          background: "linear-gradient(90deg, #D97706, #B45309)"
                        }
                      }}
                    >
                      Return
                    </Button>
                  </Stack>

                </CardContent>
              </Card>
            </Grid>
            );
          })}
        </Grid>
      )}

      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Layout>
  );
}