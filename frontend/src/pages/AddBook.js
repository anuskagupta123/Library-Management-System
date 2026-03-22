import { useState } from "react";
import Layout from "../layout/Layout";
import api from "../services/api";
import {
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Stack
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AddBook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  const getValidationMessage = (bookPayload) => {
    if (!bookPayload.title.trim()) return "Title is required.";
    if (bookPayload.title.trim().length > 200) return "Title must be at most 200 characters.";

    if (!bookPayload.author.trim()) return "Author is required.";
    if (bookPayload.author.trim().length < 2) return "Author must be at least 2 characters.";
    if (bookPayload.author.trim().length > 100) return "Author must be at most 100 characters.";

    if (!bookPayload.isbn.trim()) return "ISBN is required.";
    if (bookPayload.isbn.trim().length > 50) return "ISBN must be at most 50 characters.";

    if (bookPayload.category && bookPayload.category.trim().length > 100) {
      return "Category must be at most 100 characters.";
    }

    return null;
  };

  const getApiErrorMessage = (err) => {
    const data = err?.response?.data;
    if (!data) return "Failed to add book";

    if (data.errors && typeof data.errors === "object") {
      const details = Object.entries(data.errors)
        .map(([field, message]) => `${field}: ${message}`)
        .join("\n");
      return details || data.message || "Validation failed";
    }

    return data.message || "Failed to add book";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookPayload = {
      title: title.trim(),
      author: author.trim(),
      isbn: isbn.trim(),
      category: category.trim()
    };

    const validationMessage = getValidationMessage(bookPayload);
    if (validationMessage) {
      alert(validationMessage);
      return;
    }

    try {
      await api.post("/books", bookPayload);
      navigate("/books");
    } catch (err) {
      alert(getApiErrorMessage(err));
    }
  };

  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: { xs: 2, sm: 4 }
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 500,
            p: 2,
            borderRadius: 3,
            boxShadow: "0 10px 40px rgba(0,0,0,0.12), 0 0 40px rgba(59, 130, 246, 0.08)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 15px 50px rgba(0,0,0,0.15), 0 0 50px rgba(59, 130, 246, 0.12)"
            }
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: 700, fontSize: { xs: "1.5rem", sm: "1.75rem" }, mb: 3 }}
            >
              Add New Book
            </Typography>

            <Typography variant="body2" color="text.secondary" mb={3}>
              Fill in the details below to add a new book to the library.
            </Typography>

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  label="Book Title"
                  fullWidth
                  required
                  size="small"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.3s ease"
                    }
                  }}
                />

                <TextField
                  label="Author"
                  fullWidth
                  required
                  size="small"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.3s ease"
                    }
                  }}
                />

                <TextField
                  label="ISBN"
                  fullWidth
                  required
                  size="small"
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.3s ease"
                    }
                  }}
                />

                <TextField
                  label="Category"
                  fullWidth
                  size="small"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.3s ease"
                    }
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{
                    borderRadius: 2.5,
                    textTransform: "none",
                    fontWeight: 600,
                    mt: 2,
                    py: 1.5,
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
                  Add Book
                </Button>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
}
