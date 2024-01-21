import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OAuthClickUp from "./components/oauth";
import Layout from "./components/Layout";
import Automations from "./components/Automations/automations";
import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "./models/socket";
import { access } from "fs";
import Workspace from "./components/workspace";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "http://localhost:3002"
);

const App: React.FC<{}> = () => {
  // client-side
  socket.on("connect", () => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  });

  const [token, setToken] = useState<string>("");
  const [workspaceData, setWorkspaceData] = useState<string>("");

  const testFunction = (data: any) => {
    console.log(data[0].id);
    setWorkspaceData(data[0].id);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" index element={<Layout />}></Route>
        <Route path="/oauth" element={<OAuthClickUp />}></Route>
        <Route path="/oauth/success" element={<OAuthClickUp />}></Route>
        <Route path="/automations" element={<Automations firstProp={workspaceData} />}></Route>
        <Route path="/workspace/:token" element={<Workspace firstProp={testFunction} />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
