// src/pages/LoginPage.jsx
import React from "react";
import styled from "styled-components";
import RegisterForm from "../Components/RegisterForm";
const RegisterPage = () => {
  return (
    <PageWrapper>
      <RegisterForm />
    </PageWrapper>
  );
};

export default RegisterPage;

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f6f7f9; /* off-white */
  display: flex;
  align-items: center;
  justify-content: center;
`;
