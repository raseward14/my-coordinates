import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function BasicAuth() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [teams, setTeams] = useState<any>();
  const navigate = useNavigate();

  const GetJWT = async (): Promise<void> => {
    await axios
      .post(`http://localhost:3001/auth/basic`, {
        email: email,
        password: password,
      })
      .then((resp) => {
        setToken(JSON.stringify(resp.data.token));
        setTeams(resp.data.teams)
      })
      .catch((error) => {
        console.log(error);
      });
    return;
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    GetJWT();
  };

  useEffect(() => {
    // if(teams !== undefined) {
    console.log(teams)
    // }
  }, [teams])

  useEffect(() => {
    if (token !== "") {
      localStorage.setItem('token', token)
    }
  }, [token]);

  const style = {
    button: {
      width: "auto", // Make the button only as wide as needed
      marginTop: "10px", // Optional: Add margin for spacing
    },
  };


  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
      <h1>{token}</h1>
      {teams ?
      <>
      <h1>Select a Team</h1>
      {teams?.map((team: any, i: number) => {
        <Button key={i}>
{`${team.name}`}
        </Button>
      })}
      </>
        :
        <></>
      }
    </Form>
  );
}
