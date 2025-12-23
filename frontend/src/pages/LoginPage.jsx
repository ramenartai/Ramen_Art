// src/pages/LoginPage.jsx
import React from "react";
import styled from "styled-components";
import LoginForm from "../Components/LoginForm.jsx";

const LoginPage = () => {
  return (
    <PageWrapper>
      <LoginForm />
    </PageWrapper>
  );
};

export default LoginPage;

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f6f7f9; /* off-white */
  display: flex;
  align-items: center;
  justify-content: center;
`;
