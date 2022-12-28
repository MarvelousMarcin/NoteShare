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

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [notes, setNotes] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const [clickedNote, setClickedNote] = useState({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

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
    await fetch("http://localhost:4000/makepublic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, key: clickedNote.note_id }),
    });
    loadNotes();
  };

  return (
    <>
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
            <div className="flex flex-row justify-between w-[30vw] mb-10">
              <h2 className="font-bold text-2xl">
                <Link to="/home">Your notes</Link>
              </h2>
              <div>
                <Link to="/newnote">Add</Link>
              </div>
            </div>
            <article className="h-[35vh] overflow-y-scroll overflow-x-hidden">
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
          <img src={fot3} className="w-[30rem]" />
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
            }}
            className="w-[100vw] h-[100vh] opacity-50 bg-black fixed  left-0 top-0"
          ></section>
        )}
        {previewOpen && (
          <section className=" p-20 fixed w-[50rem] h-[40rem] bg-[#F1EDE9] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
            <h1 className="text-3xl">{clickedNote.title}</h1>
            <p className=" text-2xl mt-10">{clickedNote.content}</p>
          </section>
        )}
        {shareOpen && (
          <section className=" p-20 fixed w-[50rem] h-[40rem] bg-[#F1EDE9] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
            <h1 className=" text-3xl mb-20">Share</h1>
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
          </section>
        )}
      </section>
    </>
  );
};

export default Home;
