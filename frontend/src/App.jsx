import React from "react";
import { Routes, Route } from "react-router-dom";

import MainLayout from "./component/layout/layout";
import Chatarea from "./component/chatarea/chatarea";
import Tools from "./component/tools/tools";
import Url from "./component/tools/url";


function App() {
  return (
    <Routes>

      {/* Permanent Layout */}
      <Route element={<MainLayout />}>

        {/* Chat */}
        <Route path="/" element={<Chatarea />} />

        {/* Tools */}
        <Route path="/tools" element={<Tools />} />
        <Route path="/url-scanner" element={<Url />} />
        <Route path="/email-checker" element={<EmailChecker />} />
      </Route>

    </Routes>
  );
}

export default App;
