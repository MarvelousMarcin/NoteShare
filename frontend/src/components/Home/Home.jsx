import { useDispatch } from "react-redux";
import { setToken, setIsLoggedIn } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import fot3 from "../../assets/fot3.png";
import Note from "../Note/Note";
import { useEffect } from "react";
import { useState } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import plus from "../../assets/plus.png";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Markdown from "react-markdown";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [notes, setNotes] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const [clickedNote, setClickedNote] = useState({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareError, setShareError] = useState("");
  const [cipherError, setCipherError] = useState("");
  const [userShare, setUserShare] = useState("");
  const [password, setPassword] = useState("");

  const logoutHandler = () => {
    dispatch(setToken(""));
    dispatch(setIsLoggedIn(false));
    navigate("/");
  };

  const loadNotes = async () => {
    const response = await fetch("/api/getnote", {
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

  const onNoteClick = (e) => {
    setPreviewOpen((prev) => !prev);
    const idValue = e.target.getAttribute("id");

    const found = notes.find((item) => {
      if (item.note_id == idValue) {
        return item;
      }
    });
    setClickedNote(found);
  };

  const onShareClick = (e) => {
    setShareOpen((prev) => !prev);
    const idValue = e.target.getAttribute("id");

    const found = notes.find((item) => {
      if (item.note_id == idValue) {
        return item;
      }
    });
    setClickedNote(found);
  };

  const makePublic = async () => {
    await fetch("/api/makepublic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, key: clickedNote.note_id }),
    });
    loadNotes();
  };

  const shareNote = async () => {
    if (clickedNote.locked === "Y") {
      return setShareError("You cannot share encrypted note");
    }

    const response = await fetch("/api/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        note_id: clickedNote.note_id,
        user_to: userShare,
      }),
    });
    const data = await response.json();
    setShareError(data.error);
  };

  const deleteNote = async () => {
    await fetch("/api/note", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, note_id: clickedNote.note_id }),
    });
    loadNotes();
    setShareOpen((prev) => !prev);
  };

  const cipherNote = async () => {
    const response = await fetch("/api/secure", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        note_id: clickedNote.note_id,
        key: password,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      setCipherError(data.msg);
      clickedNote.locked = clickedNote.locked === "Y" ? "N" : "Y";
    } else {
      setCipherError(data.error);
    }
    loadNotes();
  };

  return (
    <>
      <section className="w-screen h-screen bg-[#F1EDE9]">
        <nav className="h-[11vh] flex justify-between items-center px-10">
          <h2 className="text-2xl">
            Note<span className="font-bold">Share</span>
          </h2>
          <ul className="flex justify-evenly w-[38vw]">
            <li className="cursor-pointer font-bold">Your notes</li>
            <li className="cursor-pointer">
              <Link to="/shared">Shared to me</Link>
            </li>
            <li className="cursor-pointer">
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
          <section>
            <div className="flex flex-row justify-between w-[30vw] mb-10">
              <h2 className="font-bold text-2xl">
                <Link to="/home">Your notes</Link>
              </h2>

              <div>
                <Link to="/newnote">
                  <LazyLoadImage className="w-[2rem]" src={plus} />
                </Link>
              </div>
            </div>
            <article className="whitespace-nowrap overflow-auto scrollbar-hide h-[35vh] overflow-x-hidden">
              {notes.map((item) => (
                <Note
                  onShareClick={onShareClick}
                  onClick={onNoteClick}
                  id={item.note_id}
                  title={item.title}
                />
              ))}
            </article>
          </section>
          <LazyLoadImage src={fot3} className="w-[25rem] hidden md:block" />
        </main>
        {previewOpen && (
          <section
            onClick={() => {
              setPreviewOpen((prev) => !prev);
            }}
            className="w-[100vw] h-[100vh] opacity-50 bg-black fixed  left-0 top-0"
          ></section>
        )}

        {shareOpen && (
          <section
            onClick={() => {
              setShareOpen((prev) => !prev);
              setShareError("");
              setCipherError("");
            }}
            className="w-[100vw] h-[100vh] opacity-50 bg-black fixed  left-0 top-0"
          ></section>
        )}
        {previewOpen && (
          <section className="rounded-md  p-20 fixed w-[50rem] h-[40rem] bg-[#F1EDE9] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
            {clickedNote.locked === "Y" && (
              <h2 className="font-bold text-red-800">Encrypted</h2>
            )}
            <h1 className="text-3xl">{clickedNote.title}</h1>
            <div className="prose break-words w-[20rem]">
              <Markdown children={clickedNote.content} />
            </div>
          </section>
        )}
        {shareOpen && (
          <section className="rounded-md p-20 fixed w-[50rem] h-[95%] bg-[#F1EDE9] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
            <h1 className="text-2xl  mb-10 font-bold">Make public</h1>
            <FormGroup>
              {clickedNote.public === "Y" && (
                <FormControlLabel
                  control={<Switch onClick={makePublic} defaultChecked />}
                  label="Public"
                />
              )}
              {clickedNote.public === "N" && (
                <FormControlLabel
                  control={<Switch onClick={makePublic} />}
                  label="Public"
                />
              )}
            </FormGroup>
            <section className="flex flex-col h-[40%] justify-around">
              <h1 className="text-2xl font-bold">Share to a friend</h1>
              <input
                onChange={(e) => setUserShare(e.target.value)}
                type="text"
                placeholder="Friend email"
                className="bg-transparent w-[20rem] placeholder-[#e1d9d1] outline-none border-2 rounded-md border-[#d7d0c8] px-4 py-3"
              />
              <button
                className="bg-[#181818] text-white w-[10rem] h-[2.5rem] font-bold"
                onClick={shareNote}
              >
                Share
              </button>
              <p>{shareError}</p>
            </section>

            <section className="flex flex-col h-[30%] justify-around">
              <h1 className="text-2xl font-bold">
                {clickedNote.locked === "N" ? "Encrypt" : "Decrypt"}
              </h1>

              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Secret key"
                className="bg-transparent w-[20rem] placeholder-[#e1d9d1] outline-none border-2 rounded-md border-[#d7d0c8] px-4 py-3"
              />
              <button
                onClick={cipherNote}
                className="bg-[#181818] text-white w-[10rem] h-[2.5rem] font-bold mt-4"
              >
                {clickedNote.locked === "N" ? "Encrypt" : "Decrypt"}
              </button>
              {cipherError}
            </section>

            <section className="flex flex-col h-[20%] justify-around">
              <h1 className="text-2xl ">Delete</h1>

              <button
                className="bg-[#181818] text-white w-[10rem] h-[2.5rem] font-bold"
                onClick={deleteNote}
              >
                Delete
              </button>
            </section>
          </section>
        )}
      </section>
    </>
  );
};

export default Home;
