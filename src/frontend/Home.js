import React from 'react';
import styled from 'styled-components';

export default function Home() {  
  return (
    <Container>
        <h1>Welcome to the Home Page</h1>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
`;