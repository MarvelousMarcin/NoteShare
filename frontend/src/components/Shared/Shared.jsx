import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { setToken, setIsLoggedIn } from "../../features/auth/authSlice";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import fot from "../../assets/fot5.png";
import ReactMarkdown from "https://esm.sh/react-markdown@7";
import remarkGfm from "remark-gfm";

import Note from "../Note/Note";
const Shared = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sharedNotes, setSharedNotes] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const [clickedNote, setClickedNote] = useState({});
  const [previewOpen, setPreviewOpen] = useState(false);

  const getSharedNotes = async () => {
    const response = await fetch("http://localhost:4000/getshared", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await response.json();

    setSharedNotes(data);
  };

  useEffect(() => {
    getSharedNotes();
  }, []);

  const logoutHandler = () => {
    dispatch(setToken(""));
    dispatch(setIsLoggedIn(false));
    navigate("/");
  };

  const onNoteClick = (e) => {
    setPreviewOpen((prev) => !prev);
    const idValue = e.target.getAttribute("id");

    const found = sharedNotes.find((item) => {
      if (item.note_id == idValue) {
        return item;
      }
    });
    setClickedNote(found);
  };

  return (
    <section className="w-screen h-screen bg-[#F1EDE9]">
      <nav className="h-[11vh] flex justify-between items-center px-10">
        <h2 className="text-2xl">
          Note<span className="font-bold">Share</span>
        </h2>
        <ul className="flex justify-evenly w-[30vw]">
          <li className="cursor-pointer ">
            {" "}
            <Link to="/home">Your notes</Link>
          </li>
          <li className="cursor-pointer font-bold">
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
      <main className="flex flex-row items-center justify-evenly h-[89vh]">
        <img alt="pic" src={fot} className="w-[30rem]" />

        <section className="w-[35rem]">
          <h1 className="font-bold text-2xl">Notes shared to me</h1>
          <article className="h-[35vh] overflow-y-scroll overflow-x-hidden whitespace-nowrap overflow-auto scrollbar-hide">
            {sharedNotes.map((item) => (
              <Note
                id={item.note_id}
                title={item.title}
                user={item.user}
                isPublic={true}
                onClick={onNoteClick}
              />
            ))}
          </article>
        </section>
      </main>
      {previewOpen && (
        <section
          onClick={() => {
            setPreviewOpen((prev) => !prev);
          }}
          className="w-[100vw] h-[100vh] opacity-50 bg-black fixed  left-0 top-0"
        ></section>
      )}
      {previewOpen && (
        <section className=" p-20 fixed w-[50rem] h-[40rem] bg-[#F1EDE9] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <h1 className="text-3xl">{clickedNote.title}</h1>
          <p className="break-words	">
            <ReactMarkdown
              children={clickedNote.content}
              remarkPlugins={[remarkGfm]}
            />
          </p>
        </section>
      )}
    </section>
  );
};

export default Shared;
