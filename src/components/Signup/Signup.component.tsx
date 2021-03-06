import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { gql, useMutation } from "@apollo/client";
import { Redirect } from "react-router-dom";

const Signup = () => {
  // 회원가입
  const [inputs, setInputs] = useState({
    user_email: "",
    user_password: "",
    user_confirm_password: "",
  });
  const { user_email, user_password, user_confirm_password } = inputs;

  const inputHandler = (e: any) => {
    const { name, value } = e.target;

    setInputs({
      ...inputs,
      [name]: value,
    });
  };
  const POST_SIGNUP = gql`
    mutation createAccount(
      $userName: String
      $email: String!
      $password: String!
    ) {
      createAccount(userName: $userName, email: $email, password: $password) {
        ok
        error
      }
    }
  `;
  const [signUpOk, setSignUpOk] = useState(false);

  const [duplication, setDuplication] = useState(false);

  const [createAccount] = useMutation(POST_SIGNUP, {
    onCompleted: (data) => {
      if (data.createAccount.ok === true) {
        setSignUpOk(true);
        return;
      }
      setDuplication(true);
      return;
    },
  });

  const [validation, setValidation] = useState(true);

  const signupBtnHandler = (e: any) => {
    e.preventDefault();
    if (user_password === user_confirm_password) {
      createAccount({
        variables: {
          email: user_email,
          password: user_password,
        },
      });
      setValidation(true);
      return;
    }
    setValidation(false);
    return;
  };

  // 유효성 검사

  return (
    <React.Fragment>
      {signUpOk ? <Redirect to="/login" /> : ""}
      <Container fluid={true}>
        <Row>
          <Col md={4} lg={6} className="bg-image" />
          <Col md={8} lg={6}>
            <div className="login d-flex align-items-center py-5">
              <Container>
                <Row>
                  <Col md={9} lg={8} className="mx-auto">
                    <h3 className="login-heading mb-4">Sign Up</h3>
                    <Form>
                      <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Email"
                          name="user_email"
                          onChange={(e) => inputHandler(e)}
                        />
                      </Form.Group>
                      <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Password"
                          name="user_password"
                          onChange={(e) => inputHandler(e)}
                        />
                      </Form.Group>
                      <Form.Group controlId="formBasicPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Password"
                          name="user_confirm_password"
                          onChange={(e) => inputHandler(e)}
                        />
                        <Form.Label className="mt-1 text-danger">
                          {!validation
                            ? "* Confirm Password"
                            : duplication
                            ? "* Email Duplication"
                            : ""}
                        </Form.Label>
                      </Form.Group>
                      <Button
                        variant="dark"
                        size="lg"
                        block
                        className="btn-login text-uppercase font-weight-bold mb-2"
                        type="submit"
                        onClick={(e) => signupBtnHandler(e)}
                      >
                        Sign Up
                      </Button>
                    </Form>
                  </Col>
                </Row>
              </Container>
            </div>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default Signup;
