import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Stack,
  CircularProgress,
  TextField,
  useMediaQuery,
  useTheme
} from "@mui/material";
import Layout from "../layout/Layout";
import api from "../services/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => String(u.username || "").toLowerCase().includes(q));
  }, [users, query]);

  const updateRole = async (user) => {
    const nextRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    await api.put(`/admin/users/${user.id}/role`, null, { params: { role: nextRole } });
    await loadUsers();
  };

  const updateEnabled = async (user) => {
    await api.put(`/admin/users/${user.id}/enabled`, null, { params: { enabled: !user.enabled } });
    await loadUsers();
  };

  const deleteUser = async (user) => {
    await api.delete(`/admin/users/${user.id}`);
    await loadUsers();
  };

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
            Loading users...
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
        sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" } }}
      >
        Manage Users
      </Typography>

      <Typography 
        variant="body1" 
        color="text.secondary" 
        mb={2}
        sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
      >
        Promote users to admin, disable suspicious accounts, and remove users as needed.
      </Typography>

      <Card sx={{ 
        borderRadius: 3, 
        boxShadow: "0 8px 32px rgba(0,0,0,0.1), 0 0 32px rgba(59, 130, 246, 0.05)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          boxShadow: "0 12px 40px rgba(0,0,0,0.12), 0 0 40px rgba(59, 130, 246, 0.08)"
        }
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box mb={3}>
            <TextField
              fullWidth
              label="Search by username"
              size="small"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  transition: "all 0.3s ease"
                }
              }}
            />
          </Box>

          {filteredUsers.length === 0 ? (
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
              <Typography variant="h6" fontWeight={600} color="text.secondary" mb={1}>
                No users found
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Adjust your search filter to find users
              </Typography>
            </Box>
          ) : isMobile ? (
            <Stack spacing={2}>
              {filteredUsers.map((user) => (
                <Card 
                  key={user.id} 
                  variant="outlined"
                  sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.1)"
                    }
                  }}
                >
                  <Stack spacing={1.5}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Username
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {user.username}
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Role
                        </Typography>
                        <Chip
                          label={user.role}
                          color={user.role === "ADMIN" ? "secondary" : "primary"}
                          size="small"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Status
                        </Typography>
                        <Chip
                          label={user.enabled ? "Enabled" : "Disabled"}
                          color={user.enabled ? "success" : "default"}
                          size="small"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    </Stack>

                    <Stack spacing={1}>
                      <Typography variant="body2" color="text.secondary">
                        Actions
                      </Typography>
                      <Stack direction="column" spacing={0.75}>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          fullWidth
                          onClick={() => updateRole(user)}
                          sx={{
                            borderRadius: 1.5,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "scale(1.02)",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                            }
                          }}
                        >
                          {user.role === "ADMIN" ? "Make User" : "Make Admin"}
                        </Button>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          fullWidth
                          color="warning" 
                          onClick={() => updateEnabled(user)}
                          sx={{
                            borderRadius: 1.5,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "scale(1.02)",
                              boxShadow: "0 4px 12px rgba(245, 158, 11, 0.2)"
                            }
                          }}
                        >
                          {user.enabled ? "Disable" : "Enable"}
                        </Button>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          fullWidth
                          color="error" 
                          onClick={() => deleteUser(user)}
                          sx={{
                            borderRadius: 1.5,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "scale(1.02)",
                              boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)"
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </Stack>
                  </Stack>
                </Card>
              ))}
            </Stack>
          ) : (
            // Desktop Table View
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#F9FAFB" }}>
                    <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Username</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow 
                      key={user.id} 
                      hover
                      sx={{
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: "#F3F4F6"
                        }
                      }}
                    >
                      <TableCell>{user.id}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{user.username}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          color={user.role === "ADMIN" ? "secondary" : "primary"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.enabled ? "Enabled" : "Disabled"}
                          color={user.enabled ? "success" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end" sx={{ flexWrap: "wrap" }}>
                          <Button 
                            size="small" 
                            variant="outlined" 
                            onClick={() => updateRole(user)}
                            sx={{
                              borderRadius: 1.5,
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: "scale(1.05)",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                              }
                            }}
                          >
                            {user.role === "ADMIN" ? "Make User" : "Make Admin"}
                          </Button>
                          <Button 
                            size="small" 
                            variant="outlined" 
                            color="warning" 
                            onClick={() => updateEnabled(user)}
                            sx={{
                              borderRadius: 1.5,
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: "scale(1.05)",
                                boxShadow: "0 4px 12px rgba(245, 158, 11, 0.2)"
                              }
                            }}
                          >
                            {user.enabled ? "Disable" : "Enable"}
                          </Button>
                          <Button 
                            size="small" 
                            variant="outlined" 
                            color="error" 
                            onClick={() => deleteUser(user)}
                            sx={{
                              borderRadius: 1.5,
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: "scale(1.05)",
                                boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)"
                              }
                            }}
                          >
                            Delete
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
}
