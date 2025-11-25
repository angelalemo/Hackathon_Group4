import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  /* Import fonts */
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Prompt:wght@400;500;600;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    background-color: #ffffff;
    line-height: 1.5;
    color: #333;
    font-family: 'Montserrat', 'Prompt', sans-serif;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    font-family: inherit;
    cursor: pointer;
  }
`;
