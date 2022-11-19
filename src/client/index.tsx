import React from 'react';
import { createRoot } from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ApolloProvider, ApolloClient, InMemoryCache, gql } from '@apollo/client';

//  Q: CssBaseline in index or app to best create global styles and layout
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import App from './App';

const container = document.getElementById('root')!;
const root = createRoot(container);

const client = new ApolloClient({
  uri: 'http://localhost:3000/',
  cache: new InMemoryCache(),
});  

const theme = createTheme({
    palette: {
      primary: {
        light: '#8ad297',
        main: '#5aa069',
        dark: '#2a713e',
        contrastText: '#fff',
      },
      secondary: {
        light: '#dbffff',
        main: '#a7ffeb',
        dark: '#75ccb9',
        contrastText: '#000',
      },
    },

    typography: {
      fontFamily: [
        'Roboto',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Segoe UI Symbol"',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
      ].join(','),
    },
  });

  // client
  // .query({
  //   query: gql`
  //     query Broker {
  //       id
  //       port
  //       host
  //     }
  //   `,
  // })
  // .then((result) => console.log('The result is...',result));

root.render(
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <ApolloProvider client={client}>      
        <App />
      </ApolloProvider>
    </ThemeProvider>
)

