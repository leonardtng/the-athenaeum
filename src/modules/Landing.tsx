import React, { useEffect } from "react";
import { Box, Button, Fade, Grid, Typography, useTheme } from "@mui/material";
import NavBar from "../components/NavBar";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchOwnedNftsList,
  selectOwnedNftsList,
} from "../features/ownedNftListSlice";
import { useWeb3Context } from "../utils/hooks/useWeb3Context";
import { OwnedNft } from "../models";
import { NftCard } from "../components";
import { selectAppState } from "../features/appStateSlice";

const Landing: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { address, connect, connected } = useWeb3Context();
  const { darkMode } = useAppSelector(selectAppState);
  const ownedNftsList = useAppSelector(selectOwnedNftsList);

  useEffect(() => {
    if (address) {
      dispatch(fetchOwnedNftsList(address));
    }
  }, [dispatch, address]);

  return (
    <Box
      sx={{
        height: window.innerHeight,
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Fade in={true} timeout={600}>
        <Box sx={{ height: "100%" }}>
          <NavBar />

          {connected ? (
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 9, md: 12, lg: 15, xl: 20 }}
              sx={{
                mt: {
                  xs: "80px",
                  md: "120px",
                },
                px: {
                  xs: 2,
                  md: 12,
                  lg: 24,
                  xl: 36,
                },
              }}
            >
              {ownedNftsList.value?.ownedNfts.map(
                (ownedNft: OwnedNft, index: number) => (
                  <Grid item xs={2} sm={3} md={3} lg={3} xl={4} key={index}>
                    <NftCard ownedNft={ownedNft} />
                  </Grid>
                )
              )}
            </Grid>
          ) : (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "1px solid",
                  px: 16,
                  py: 6,
                  borderRadius: 3,
                  backgroundColor: darkMode
                    ? theme.palette.primary.main
                    : theme.palette.background.paper,
                }}
              >
                <Typography variant="h6" mb={2}>
                  Sign in
                </Typography>
                <Button
                  variant="contained"
                  onClick={connect}
                  sx={{
                    backgroundColor: darkMode
                      ? theme.palette.background.paper
                      : theme.palette.primary.main,
                    ":hover": {
                      backgroundColor: darkMode
                        ? `${theme.palette.background.paper}80`
                        : `${theme.palette.primary.main}80`,
                    },
                  }}
                >
                  <Typography variant="h6">Connect Wallet</Typography>
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Fade>
    </Box>
  );
};

export default Landing;
