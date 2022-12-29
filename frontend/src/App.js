import "./App.css";

import Login from "./components/Login/Login";
import { Routes, Route } from "react-router-dom";
import Register from "./components/Register/Register";
import { useSelector } from "react-redux";
import Public from "./components/Public/Public";
import Home from "./components/Home/Home";
import NewNote from "./components/NewNote/NewNote";
import Shared from "./components/Shared/Shared";
function App() {
  const isLogged = useSelector((state) => state.auth.isLoggedIn);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route
          path="/home"
          element={isLogged ? <Home /> : <div>Auth needed</div>}
        />
        <Route
          path="/public"
          element={isLogged ? <Public /> : <div>Auth needed</div>}
        />
        <Route
          path="/newnote"
          element={isLogged ? <NewNote /> : <div>Auth needed</div>}
        />
        <Route
          path="/shared"
          element={isLogged ? <Shared /> : <div>Auth needed</div>}
        />
      </Routes>
    </div>
  );
}

export default App;
