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
  const [workspaceId, setWorkspaceId] = useState<string>("");

  const getTeamIdFromObject = (data: any) => {
    if(data !== undefined) {
      console.log('from app', typeof data.id)
      setWorkspaceId(data.id);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" index element={<Layout />}></Route>
        <Route path="/oauth" element={<OAuthClickUp />}></Route>
        <Route path="/oauth/success" element={<OAuthClickUp />}></Route>
        <Route path="/automations" element={<Automations teamId={workspaceId} />}></Route>
        <Route path="/workspace/:token" element={<Workspace teamCallback={getTeamIdFromObject} />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
