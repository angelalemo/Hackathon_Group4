import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 10;
    padding: 10;
    box-sizing: border-box;
  }

  html, body {
    font-family: 'Lato', 'Kanit', 'Italiana', 'Keania One', sans-serif;
    background-color: #f2f2f2ff;
    color: #333;
  }

  input, button, textarea {
    font-family: 'Lato', 'Kanit', sans-serif;
  }
`;
