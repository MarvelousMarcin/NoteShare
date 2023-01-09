import { useDispatch } from "react-redux";
import { setToken, setIsLoggedIn } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import fot3 from "../../assets/fot4.png";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Note from "../Note/Note";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Markdown from "react-markdown";

const Public = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [publicNotes, setPublicNotes] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const [clickedNote, setClickedNote] = useState({});

  const logoutHandler = () => {
    dispatch(setToken(""));
    dispatch(setIsLoggedIn(false));
    navigate("/");
  };

  const getPublicNotes = async () => {
    const response = await fetch("/api/notepublic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await response.json();
    setPublicNotes(data);
  };

  useEffect(() => {
    getPublicNotes();
  }, []);

  const onNoteClick = (e) => {
    setPreviewOpen((prev) => !prev);
    const idValue = e.target.getAttribute("id");

    const found = publicNotes.find((item) => {
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
        <ul className="flex justify-evenly w-[38vw]">
          <li className="cursor-pointer">
            <Link to="/home">Your notes</Link>
          </li>
          <li className="cursor-pointer">
            <Link to="/shared">Shared to me</Link>
          </li>
          <li className="cursor-pointer font-bold">
            <Link to="/public">Public notes</Link>
          </li>
          <li className="cursor-pointer">
            <Link to="/settings">Settings</Link>
          </li>
          <li onClick={logoutHandler} className="cursor-pointer">
            Log out
          </li>
        </ul>
      </nav>
      <main className="flex flex-row items-center justify-evenly h-[89vh]">
        <LazyLoadImage src={fot3} className="w-[20rem] hidden md:block" />
        <section>
          <div className="flex flex-row justify-between w-[30vw] mb-10">
            <h2 className="font-bold text-2xl">Public notes</h2>
          </div>
          <article className="h-[35vh] w-[34rem] overflow-y-scroll overflow-x-hidden whitespace-nowrap overflow-auto scrollbar-hide">
            {publicNotes.map((item) => (
              <Note
                onClick={onNoteClick}
                id={item.note_id}
                title={item.title}
                user={item.user}
                isPublic={true}
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
        <section className="rounded-md p-20 fixed w-[50rem] h-[40rem] bg-[#F1EDE9] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <h1 className="text-3xl">{clickedNote.title}</h1>
          <p className="break-words">
            <div className="prose break-words w-[20rem]">
              <Markdown children={clickedNote.content} />
            </div>
          </p>
        </section>
      )}
    </section>
  );
};

export default Public;
