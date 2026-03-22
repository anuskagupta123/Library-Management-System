import { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Chip
} from "@mui/material";
import Layout from "../layout/Layout";
import api from "../services/api";

export default function UserDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    myBorrowedBooks: 0
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [booksRes, myBooksRes] = await Promise.all([
          api.get("/books"),
          api.get("/books/my")
        ]);

        const books = Array.isArray(booksRes.data) ? booksRes.data : [];
        const myBooks = Array.isArray(myBooksRes.data) ? myBooksRes.data : [];

        setStats({
          totalBooks: books.length,
          availableBooks: books.filter((b) => b.available).length,
          myBorrowedBooks: myBooks.length
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">Total Books</Typography>
              <Typography variant="h4" fontWeight={700}>{stats.totalBooks}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">Available Books</Typography>
              <Typography variant="h4" fontWeight={700}>{stats.availableBooks}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">My Borrowed Books</Typography>
              <Typography variant="h4" fontWeight={700}>{stats.myBorrowedBooks}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Quick Status
        </Typography>
        {stats.myBorrowedBooks > 0 ? (
          <Chip label={`You currently have ${stats.myBorrowedBooks} book(s) borrowed`} color="warning" />
        ) : (
          <Chip label="You have no borrowed books right now" color="success" />
        )}
      </Box>
    </Layout>
  );
}
