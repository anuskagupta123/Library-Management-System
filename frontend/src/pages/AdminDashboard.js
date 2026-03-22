import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress
} from "@mui/material";
import Layout from "../layout/Layout";
import api from "../services/api";
import { useEffect, useState } from "react";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import TimelineIcon from "@mui/icons-material/Timeline";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBooks: 0,
    issuedBooks: 0,
    availableBooks: 0,
    overdueBooks: 0
  });
  const [trend, setTrend] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [overdueBooks, setOverdueBooks] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, trendRes, activityRes, overdueRes] = await Promise.all([
          api.get("/dashboard/admin"),
          api.get("/dashboard/admin/borrow-trend"),
          api.get("/dashboard/admin/recent-activity"),
          api.get("/dashboard/admin/overdue")
        ]);

        const data = statsRes.data || {};
        setStats({
          totalBooks: data.total || 0,
          issuedBooks: data.issued || 0,
          availableBooks: data.available || 0,
          overdueBooks: data.overdue || 0
        });
        setTrend(Array.isArray(trendRes.data) ? trendRes.data : []);
        setRecentActivity(Array.isArray(activityRes.data) ? activityRes.data : []);
        setOverdueBooks(Array.isArray(overdueRes.data) ? overdueRes.data : []);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const maxTrendValue = Math.max(1, ...trend.map((point) => point.count || 0));

  const StatCard = ({ title, value, icon, color }) => (
    <Card
      sx={{
        borderRadius: 2.5,
        boxShadow: "0 8px 32px rgba(0,0,0,0.1), 0 0 32px rgba(59, 130, 246, 0.05)",
        p: 0,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 16px 48px rgba(0,0,0,0.12), 0 0 48px rgba(59, 130, 246, 0.08)"
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {value}
            </Typography>
          </Box>

          <Box
            sx={{
              background: color,
              color: "white",
              borderRadius: "12px",
              p: 2,
              transition: "all 0.3s ease"
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

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
            Loading dashboard...
          </Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Typography 
        variant="h4" 
        fontWeight={700} 
        gutterBottom
        sx={{ fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" } }}
      >
        Admin Dashboard
      </Typography>

      <Typography 
        variant="body1" 
        color="text.secondary" 
        gutterBottom
        sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
      >
        Real-time admin insights with borrowing trends, activity stream, and overdue risk alerts.
      </Typography>

      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Books"
            value={stats.totalBooks}
            icon={<LibraryBooksIcon />}
            color="#3B82F6"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Issued Books"
            value={stats.issuedBooks}
            icon={<MenuBookIcon />}
            color="#F59E0B"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Available Books"
            value={stats.availableBooks}
            icon={<CheckCircleIcon />}
            color="#10B981"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Overdue Alerts"
            value={stats.overdueBooks}
            icon={<WarningAmberIcon />}
            color="#EF4444"
          />
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ 
            borderRadius: 2.5, 
            boxShadow: "0 8px 32px rgba(0,0,0,0.1), 0 0 32px rgba(59, 130, 246, 0.05)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.12), 0 0 40px rgba(59, 130, 246, 0.08)"
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ xs: "flex-start", sm: "center" }} spacing={1} mb={3}>
                <TimelineIcon color="primary" />
                <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}>
                  Books Borrowed Over Last 7 Days
                </Typography>
              </Stack>

              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  background: "linear-gradient(180deg, #EEF2FF 0%, #FFFFFF 100%)",
                  border: "1px solid #E5E7EB",
                  overflowX: "auto"
                }}
              >
                <Stack direction="row" spacing={0.5} alignItems="flex-end" sx={{ minHeight: { xs: 140, sm: 180 }, minWidth: "100%" }}>
                  {trend.map((point) => {
                    const count = point.count || 0;
                    const height = Math.max(12, Math.round((count / maxTrendValue) * 140));
                    return (
                      <Box key={point.date} sx={{ flex: 1, minWidth: { xs: 30, sm: 0 } }}>
                        <Box
                          sx={{
                            height,
                            borderRadius: "10px 10px 4px 4px",
                            background: "linear-gradient(180deg, #3B82F6 0%, #1D4ED8 100%)",
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "center",
                            color: "white",
                            fontWeight: 700,
                            fontSize: { xs: 10, sm: 12 },
                            pt: 0.5,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              filter: "brightness(1.1)"
                            }
                          }}
                        >
                          {count}
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: "0.6rem", sm: "0.75rem" } }}>
                          {String(point.date).slice(5)}
                        </Typography>
                      </Box>
                    );
                  })}
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ 
            borderRadius: 2.5, 
            boxShadow: "0 8px 32px rgba(0,0,0,0.1), 0 0 32px rgba(59, 130, 246, 0.05)",
            height: "100%",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.12), 0 0 40px rgba(59, 130, 246, 0.08)"
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography 
                variant="h6" 
                fontWeight={700} 
                gutterBottom
                sx={{ fontSize: { xs: "1rem", sm: "1.1rem" }, mb: 2 }}
              >
                Recent Activity
              </Typography>
              <List sx={{ maxHeight: { xs: 300, sm: 400 }, overflow: "auto" }}>
                {recentActivity.length === 0 && (
                  <Typography color="text.secondary" variant="body2">
                    No recent activity yet.
                  </Typography>
                )}

                {recentActivity.map((activity, index) => (
                  <Box key={`${activity.id}-${index}`}>
                    <ListItem disableGutters>
                      <ListItemText
                        primary={`${activity.username} ${activity.action === "BORROW" ? "borrowed" : "returned"} ${activity.bookTitle}`}
                        secondary={new Date(activity.timestamp).toLocaleString()}
                        primaryTypographyProps={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                        secondaryTypographyProps={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                      />
                      <Chip
                        size="small"
                        color={activity.action === "BORROW" ? "warning" : "success"}
                        label={activity.action}
                        sx={{ fontSize: { xs: "0.6rem", sm: "0.75rem" } }}
                      />
                    </ListItem>
                    {index < recentActivity.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ 
            borderRadius: 2.5, 
            boxShadow: "0 8px 32px rgba(0,0,0,0.1), 0 0 32px rgba(59, 130, 246, 0.05)",
            height: "100%",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.12), 0 0 40px rgba(59, 130, 246, 0.08)"
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography 
                variant="h6" 
                fontWeight={700} 
                gutterBottom
                sx={{ fontSize: { xs: "1rem", sm: "1.1rem" }, mb: 2 }}
              >
                Overdue Books Alert
              </Typography>

              {overdueBooks.length === 0 ? (
                <Chip color="success" label="No overdue books right now" />
              ) : (
                <List sx={{ maxHeight: { xs: 300, sm: 400 }, overflow: "auto" }}>
                  {overdueBooks.slice(0, 8).map((book, index) => (
                    <Box key={`${book.id}-${index}`}>
                      <ListItem disableGutters>
                        <ListItemText
                          primary={`${book.title} (${book.author})`}
                          secondary={`Issued to ${book.issuedTo || "unknown"} | Fine ${Number(book.fineAmount || 0).toFixed(2)}`}
                          primaryTypographyProps={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                          secondaryTypographyProps={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                        />
                        <Chip color="error" size="small" label="Overdue" sx={{ fontSize: { xs: "0.6rem", sm: "0.75rem" } }} />
                      </ListItem>
                      {index < Math.min(overdueBooks.length, 8) - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}
