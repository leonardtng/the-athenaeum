import React, { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  SwipeableDrawer,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { useWeb3Context } from "../utils/hooks/useWeb3Context";
import { Link } from "react-router-dom";
import {
  AccountBalanceRounded,
  AccountBalanceWalletRounded,
  AccountCircleRounded,
  CloseRounded,
  LogoutRounded,
} from "@mui/icons-material";
import ThemeSwitch from "./ThemeSwitch";

const NavBar: React.FC = () => {
  const theme = useTheme();
  const { address, connect, connected, disconnect, balance } = useWeb3Context();
  const [accountDrawerOpen, setAccountDrawerOpen] = useState(false);

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: theme.palette.background.default,
        boxShadow: "none",
        backgroundImage: "none",
        px: {
          xs: 0,
          md: 6,
        },
        zIndex: 2,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          height: {
            xs: 80,
            md: 120,
          },
        }}
      >
        <Link
          to="/"
          style={{ textDecoration: "none", color: theme.palette.text.primary }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AccountBalanceRounded
              sx={{
                height: theme.spacing(4),
                width: theme.spacing(4),
                mr: 1,
              }}
            />
            <Typography variant="h5" noWrap>
              The Athenaeum
            </Typography>
          </Box>
        </Link>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ThemeSwitch />
          <IconButton
            size="large"
            onClick={connected ? () => setAccountDrawerOpen(true) : connect}
            sx={{
              backgroundColor: theme.palette.primary.main,
              ":hover": {
                backgroundColor: `${theme.palette.primary.main}80`,
              },
              "& .MuiSvgIcon-root": {
                color: `#ffffff`,
              },
            }}
          >
            {connected ? (
              <AccountCircleRounded />
            ) : (
              <AccountBalanceWalletRounded />
            )}
          </IconButton>
        </Box>

        <SwipeableDrawer
          anchor="right"
          open={accountDrawerOpen}
          onClose={() => setAccountDrawerOpen(false)}
          onOpen={() => setAccountDrawerOpen(true)}
          sx={{
            "& .MuiPaper-root": {
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: window.innerHeight,
              backgroundColor: `${theme.palette.background.default} !important`,
              backgroundImage: "none",
              p: 1,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Toolbar
              sx={{
                display: "flex",
                justifyContent: "space-between",
                height: 80,
                width: {
                  xs: "100vw",
                  sm: 524,
                },
              }}
            >
              <IconButton
                onClick={() => setAccountDrawerOpen(false)}
                sx={{ mr: { xs: 2, sm: 0 } }}
              >
                <CloseRounded />
              </IconButton>
            </Toolbar>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 2,
              }}
            >
              <AccountCircleRounded fontSize="large" />
              <Typography variant="h5" sx={{ mt: 1 }}>
                {address.slice(-7)}
              </Typography>
              <Button
                sx={{ mt: 1, color: theme.palette.text.secondary }}
                onClick={disconnect}
                endIcon={<LogoutRounded />}
              >
                Log out
              </Button>
            </Box>
            <Box
              sx={{
                width: "75%",
                border: "solid 1px",
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 2,
                mt: 2,
              }}
            >
              <Typography variant="subtitle1" color="textSecondary">
                Total Balance
              </Typography>
              <Typography variant="h6">
                {Math.round(Number(balance) * 100000) / 100000} ETH
              </Typography>
            </Box>
          </Box>
        </SwipeableDrawer>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
