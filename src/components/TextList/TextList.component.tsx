import React from "react";
import CardSlider from "../CardList/CardSlider.component";
import { Container } from "react-bootstrap";

const TextList = () => {
  return (
    <>
      <Container fluid className="vh-93 pt-5">
        <CardSlider></CardSlider>
      </Container>
    </>
  );
};

export default TextList;