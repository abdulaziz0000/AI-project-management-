import { useEffect, useState } from "react";
import api from "../services/api";

import {
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Avatar,
  Chip,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";

function User() {

  const theme = useTheme();

  const isMobile = useMediaQuery(
    theme.breakpoints.down("sm")
  );

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const organizationId =
    localStorage.getItem("organizationId");

  const organizationName =
    localStorage.getItem("organizationName");


  /*
   * ==========================================
   * FETCH USERS
   * ==========================================
   */

  useEffect(() => {

    if (!organizationId) {
      console.error("Organization ID not found");
      setLoading(false);
      return;
    }

    api
      .get(`/users/organization/${organizationId}`)
      .then((res) => {

        setUsers(res.data);

      })
      .catch((error) => {

        console.error(
          "Failed to fetch users:",
          error
        );

      })
      .finally(() => {

        setLoading(false);

      });

  }, [organizationId]);


  /*
   * ==========================================
   * LOADING
   * ==========================================
   */

  if (loading) {

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 250,
        }}
      >
        <CircularProgress />
      </Box>
    );

  }


  return (

    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >

      {/* ==========================================
          HEADER
      ========================================== */}

      <Paper
        sx={{
          p: {
            xs: 2.5,
            sm: 3,
            md: 4,
          },

          mb: {
            xs: 2.5,
            sm: 3,
            md: 4,
          },

          borderRadius: {
            xs: 3,
            sm: 4,
          },

          background:
            "linear-gradient(135deg,#2563EB,#4F46E5)",

          color: "white",

          overflow: "hidden",
        }}
      >

        <Typography
          sx={{
            fontSize: {
              xs: "1.25rem",
              sm: "1.75rem",
              md: "2.125rem",
            },

            fontWeight: 700,

            overflow: "hidden",

            textOverflow: "ellipsis",

            whiteSpace: "nowrap",
          }}
        >
          {organizationName || "Organization"}
        </Typography>


        <Typography
          sx={{
            mt: 0.5,

            fontSize: {
              xs: "1.15rem",
              sm: "1.5rem",
              md: "2.125rem",
            },

            fontWeight: 700,
          }}
        >
          All Project Members
        </Typography>


        <Typography
          sx={{
            mt: 1,

            opacity: 0.85,

            fontSize: {
              xs: 13,
              sm: 14,
              md: 16,
            },
          }}
        >
          Manage all members of your organization
        </Typography>

      </Paper>


      {/* ==========================================
          USER TABLE
      ========================================== */}

      <Paper
        sx={{
          width: "100%",

          borderRadius: {
            xs: 2.5,
            sm: 4,
          },

          overflow: "hidden",

          boxShadow:
            "0 6px 20px rgba(0,0,0,.08)",
        }}
      >

        <TableContainer
          sx={{
            width: "100%",

            overflowX: "auto",

            WebkitOverflowScrolling: "touch",

            "&::-webkit-scrollbar": {
              height: 6,
            },

            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#CBD5E1",
              borderRadius: 10,
            },
          }}
        >

          <Table
            sx={{
              minWidth: isMobile ? 750 : 700,
            }}
          >

            {/* ==========================================
                TABLE HEADER
            ========================================== */}

            <TableHead
              sx={{
                backgroundColor: "#EEF2FF",
              }}
            >

              <TableRow>

                <TableCell
                  sx={{
                    fontWeight: 700,
                    minWidth: 220,
                    whiteSpace: "nowrap",
                    py: 2,
                  }}
                >
                  Employee
                </TableCell>


                <TableCell
                  sx={{
                    fontWeight: 700,
                    minWidth: 230,
                    whiteSpace: "nowrap",
                  }}
                >
                  Email
                </TableCell>


                <TableCell
                  sx={{
                    fontWeight: 700,
                    minWidth: 150,
                    whiteSpace: "nowrap",
                  }}
                >
                  Role
                </TableCell>


                


                <TableCell
                  sx={{
                    fontWeight: 700,
                    minWidth: 120,
                    whiteSpace: "nowrap",
                  }}
                >
                  Status
                </TableCell>

              </TableRow>

            </TableHead>


            {/* ==========================================
                TABLE BODY
            ========================================== */}

            <TableBody>

              {users.length === 0 ? (

                <TableRow>

                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{
                      py: 5,
                      color: "text.secondary",
                    }}
                  >
                    No organization members found.
                  </TableCell>

                </TableRow>

              ) : (

                users.map((user) => (

                  <TableRow
                    key={user.id}
                    hover
                  >

                    {/* EMPLOYEE */}

                    <TableCell>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          minWidth: 190,
                        }}
                      >

                        <Avatar
                          sx={{
                            bgcolor: "#2563EB",

                            width: {
                              xs: 36,
                              sm: 40,
                            },

                            height: {
                              xs: 36,
                              sm: 40,
                            },

                            fontSize: {
                              xs: 14,
                              sm: 16,
                            },
                          }}
                        >
                          {user.firstName
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}
                        </Avatar>


                        <Typography
                          fontWeight={600}
                          sx={{
                            whiteSpace: "nowrap",
                          }}
                        >
                          {user.firstName}{" "}
                          {user.lastName}
                        </Typography>

                      </Box>

                    </TableCell>


                    {/* EMAIL */}

                    <TableCell>

                      <Typography
                        sx={{
                          whiteSpace: "nowrap",
                          fontSize: {
                            xs: 13,
                            sm: 14,
                          },
                        }}
                      >
                        {user.email}
                      </Typography>

                    </TableCell>


                    {/* ROLE */}

                    <TableCell>

                      <Chip
                        label={user.role}
                        size={isMobile ? "small" : "medium"}
                        color={
                          user.role === "SUPER_ADMIN"
                            ? "error"
                            : user.role === "MANAGER"
                              ? "primary"
                              : "success"
                        }
                        sx={{
                          fontWeight: 600,
                        }}
                      />

                    </TableCell>




                    {/* STATUS */}

                    <TableCell>

                      <Chip
                        label={user.status}
                        size={isMobile ? "small" : "medium"}
                        color={
                          user.status === "ACTIVE"
                            ? "success"
                            : "warning"
                        }
                        sx={{
                          fontWeight: 600,
                        }}
                      />

                    </TableCell>

                  </TableRow>

                ))

              )}

            </TableBody>

          </Table>

        </TableContainer>


        {/* MOBILE HINT */}

        {isMobile && users.length > 0 && (

          <Box
            sx={{
              px: 2,
              py: 1,

              borderTop:
                "1px solid #E5E7EB",

              backgroundColor:
                "#F8FAFC",

              textAlign: "center",
            }}
          >

            <Typography
              variant="caption"
              color="text.secondary"
            >
              ← Swipe horizontally to view all columns →
            </Typography>

          </Box>

        )}

      </Paper>

    </Box>

  );
}

export default User;

