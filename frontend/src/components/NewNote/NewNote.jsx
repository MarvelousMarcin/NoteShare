import { useDispatch } from "react-redux";
import { setToken, setIsLoggedIn } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const NewNote = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const token = useSelector((state) => state.auth.token);

  const logoutHandler = () => {
    dispatch(setToken(""));
    dispatch(setIsLoggedIn(false));
    navigate("/");
  };

  const addNoteHandler = async () => {
    if (!title || !content) {
      return;
    }

    await fetch("/api/note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, token }),
    });
    navigate("/home");
  };

  return (
    <section className="w-screen h-screen bg-[#F1EDE9]">
      <nav className="h-[11vh] flex justify-between items-center px-10">
        <h2 className="text-2xl">
          Note<span className="font-bold">Share</span>
        </h2>
        <ul className="flex justify-evenly w-[30vw]">
          <li className="cursor-pointer font-bold">
            {" "}
            <Link to="/home">Your notes</Link>
          </li>
          <li className="cursor-pointer">
            <Link to="/shared">Shared to me</Link>
          </li>
          <li className="cursor-pointer">
            <Link to="/public">Public notes</Link>
          </li>
          <li onClick={logoutHandler} className="cursor-pointer">
            Log out
          </li>
        </ul>
      </nav>
      <main className="flex flex-col items-center justify-evenly h-[89vh]">
        <input
          className="bg-transparent text-3xl outline-none text-center"
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          focus
        />
        <textarea
          className="w-[30rem] h-[30rem] rounded-xl resize-none outline-none p-5"
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <motion.button
          className="bg-[#181818] text-white w-[12rem] h-[2.5rem] font-bold"
          onClick={addNoteHandler}
          whileHover={{ width: "13rem" }}
        >
          Add
        </motion.button>
      </main>
    </section>
  );
};

export default NewNote;
