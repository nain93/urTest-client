import React, { useState } from "react";
import { gql, useQuery, useMutation, useReactiveVar } from "@apollo/client";
import { isLoginVar } from "../../common/graphql/client";
import { LinkContainer } from "react-router-bootstrap";
import { Container, Card, CardDeck, Button, Nav } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const TextGame = (props: any) => {
  // 전역 변수
  const isLogin = useReactiveVar(isLoginVar);
  const location = useLocation();
  console.log(location.pathname);

  const GET_CONTENTS = gql`
    query getContent($id: Int!) {
      getContent(id: $id) {
        bookMarks
        question {
          id
          questionBody
          answer {
            id
            body
            winCount
          }
        }
      }
    }
  `;

  const POST_TEXT = gql`
    mutation addCountTxt($id: Int!) {
      addCountTxt(id: $id) {
        ok
        error
      }
    }
  `;

  const POST_BOOKMARK = gql`
    mutation addBookMark($id: Int!) {
      addBookMark(id: $id) {
        ok
        error
      }
    }
  `;

  const [bookMark, setBookMark] = useState([] as any);

  const [addCountTxt] = useMutation(POST_TEXT);
  const [addBookMark] = useMutation(POST_BOOKMARK, {
    onCompleted: (data) => {
      console.log(data.addBookMark.error);
      setBookMark(data.addBookMark);
    },
  });

  const [questions, setQuestions] = useState([] as any);
  const [answers, setAnswers] = useState([] as any);
  const [rating, setRating] = useState(false);
  const [lastPick, setLastPick] = useState(false);

  useQuery(GET_CONTENTS, {
    variables: {
      id: +props.gameid,
    },
    onCompleted: (data) => {
      setQuestions(data.getContent.question);
      setAnswers([
        data.getContent.question[0].answer[0],
        data.getContent.question[0].answer[1],
      ]);
    },
  });

  const clickHandler = (pick: any) => {
    addCountTxt({
      variables: {
        id: pick.id,
      },
    });
    if (questions.length === 1) {
      setRating(false);
      setLastPick(true);
      return;
    }
    const nextQuestions = [...questions];
    nextQuestions.shift();
    setQuestions(nextQuestions);
    setAnswers([nextQuestions[0].answer[0], nextQuestions[0].answer[1]]);
    setRating(false);
    return;
  };

  const ratingHandler = () => {
    if (!rating) {
      setRating(true);
      return;
    }
    setRating(false);
    return;
  };

  const copyHandler = () => {
    document.execCommand(`http://localhost:3000${location.pathname}`);
    alert(`http://localhost:3000${location.pathname}`);
  };

  const bookMarkBtnHandler = () => {
    addBookMark({
      variables: {
        id: +props.gameid,
      },
    });
    if (bookMark.ok) {
      alert("즐겨찾기에 추가되었습니다.");
      return;
    } else if (bookMark.error) {
      alert("이미 추가된 컨텐츠 입니다.");
      return;
    }
  };

  return (
    <>
      {questions.length === 0 ? (
        "loading..."
      ) : (
        <Container>
          <Nav>
            {isLogin ? (
              <Button onClick={() => bookMarkBtnHandler()}>즐겨찾기</Button>
            ) : (
              ""
            )}
            <LinkContainer to={`/analytics/${+props.gameid}/`}>
              <Button>랭킹보기</Button>
            </LinkContainer>
            <Button onClick={() => copyHandler()}>공유하기</Button>
          </Nav>
          {lastPick ? (
            <Card>
              <Card.Text>게임이 종료되었습니다.</Card.Text>
            </Card>
          ) : (
            <>
              <h1>{questions[0].questionBody}</h1>
              <Button onClick={() => ratingHandler()}>선택률 보기</Button>
              <CardDeck>
                {answers.map((pick: any) => {
                  return (
                    <Card
                      key={pick.id}
                      onClick={() => clickHandler(pick)}
                      className="card-size"
                    >
                      <Card.Text>{pick.body}</Card.Text>
                      {rating ? (
                        <Card.Text>{`선택률 ${(
                          (pick.winCount /
                            (answers[0].winCount + answers[1].winCount)) *
                          100
                        ).toFixed(2)}%`}</Card.Text>
                      ) : (
                        ""
                      )}
                    </Card>
                  );
                })}
              </CardDeck>
            </>
          )}
        </Container>
      )}
    </>
  );
};

export default TextGame;