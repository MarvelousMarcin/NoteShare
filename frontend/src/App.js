import "./App.css";

import Login from "./components/Login/Login";
import { Routes, Route } from "react-router-dom";
import Register from "./components/Register/Register";
import { useSelector, useDispatch } from "react-redux";
import Home from "./components/Home/Home";

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
      </Routes>
    </div>
  );
}

export default App;
