import { useDispatch } from "react-redux";
import { setToken, setIsLoggedIn } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import fot3 from "../../assets/fot3.png";
import Note from "../Note/Note";
import { useEffect } from "react";
import { useState } from "react";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [notes, setNotes] = useState([]);
  const token = useSelector((state) => state.auth.token);

  const logoutHandler = () => {
    dispatch(setToken(""));
    dispatch(setIsLoggedIn(false));
    navigate("/");
  };

  const loadNotes = async () => {
    const response = await fetch("http://localhost:4000/getnote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await response.json();
    setNotes(data);
  };
  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <section className="w-screen h-screen bg-[#F1EDE9]">
      <nav className="h-[11vh] flex justify-between items-center px-10">
        <h2 className="text-2xl">
          Note<span className="font-bold">Share</span>
        </h2>
        <ul className="flex justify-evenly w-[30vw]">
          <li className="cursor-pointer font-bold">Your notes</li>
          <li className="cursor-pointer">
            <Link to="/public">Public notes</Link>
          </li>
          <li onClick={logoutHandler} className="cursor-pointer">
            Log out
          </li>
        </ul>
      </nav>
      <main className="flex flex-row items-center justify-evenly h-[89vh]">
        <section>
          <div className="flex flex-row justify-between w-[30vw]  mb-10">
            <h2 className="font-bold text-2xl">
              <Link to="/home">Your notes</Link>
            </h2>
            <div>
              <Link to="/newnote">Add</Link>
            </div>
          </div>
          <article className="h-[35vh] overflow-y-scroll overflow-x-hidden">
            {notes.map((item) => (
              <Note title={item.title} />
            ))}
          </article>
        </section>
        <img src={fot3} className="w-[30rem]" />
      </main>
    </section>
  );
};

export default Home;
