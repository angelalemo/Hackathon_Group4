import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  /* Import fonts */
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Prompt:wght@400;500;600;700&display=swap');

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background-color: #ffffffff;
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
