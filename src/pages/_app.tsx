import type { AppProps } from "next/app";
import {
  createTheme,
  ThemeProvider,
  Container,
  Box,
  CssBaseline,
} from "@material-ui/core";
import { deepOrange, yellow } from "@material-ui/core/colors";

const darkTheme = createTheme({
  palette: {
    type: "dark",
    primary: deepOrange,
    secondary: yellow,
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={darkTheme}>
      <Container>
        <Box marginY={2}>
          <CssBaseline />
          <Component {...pageProps} />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default MyApp;
