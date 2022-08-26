import React from "react";
import { CssBaseline, responsiveFontSizes } from "@mui/material";
import {
  createTheme,
  Theme,
  ThemeOptions,
  ThemeProvider,
} from "@mui/material/styles";
import Router from "./Router";
import { Web3ChainProvider } from "./utils/hooks/useWeb3Chain";
import { Web3ContextProvider } from "./utils/hooks/useWeb3Context";
import { useAppSelector } from "./app/hooks";
import { selectAppState } from "./features/appStateSlice";

const App: React.FC = () => {
  const appState = useAppSelector(selectAppState);

  const common: ThemeOptions = {
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
    typography: {
      fontFamily: "'Outfit', sans-serif",
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
          },
        },
      },
    },
  };

  const dark: Theme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#242424",
      },
      secondary: {
        main: "#000000",
      },
      background: {
        default: "#0f0f0f",
        paper: "#4f4f4f",
      },
      text: {
        primary: "#ffffff",
        secondary: "#555555",
      },
    },
    ...common,
  });

  const light: Theme = createTheme({
    palette: {
      primary: {
        main: "#242424",
      },
      secondary: {
        main: "#000000",
      },
      background: {
        default: "#ffffff",
        paper: "#ededed",
      },
      text: {
        primary: "#000000",
        secondary: "#353840",
      },
    },
    ...common,
  });

  return (
    <Web3ChainProvider>
      <Web3ContextProvider>
        <ThemeProvider
          theme={responsiveFontSizes(appState.darkMode ? dark : light)}
        >
          <CssBaseline />
          <Router />
        </ThemeProvider>
      </Web3ContextProvider>
    </Web3ChainProvider>
  );
};

export default App;
