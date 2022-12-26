import { useDispatch } from "react-redux";
import { setToken, setIsLoggedIn } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import fot3 from "../../assets/fot3.png";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(setToken(""));
    dispatch(setIsLoggedIn(false));
    navigate("/");
  };

  return (
    <section className="w-screen h-screen bg-[#F1EDE9]">
      <nav className="h-[11vh] flex justify-between items-center px-10">
        <h2 className="text-2xl">
          Note<span className="font-bold">Share</span>
        </h2>
        <ul className="flex justify-evenly w-[30vw]">
          <li className="cursor-pointer font-bold">Your notes</li>
          <li className="cursor-pointer">Public notes</li>
          <li onClick={logoutHandler} className="cursor-pointer">
            Log out
          </li>
        </ul>
      </nav>
      <main>
        <section>
          <div>
            <h2>Your notes</h2>
            <div>Add</div>
          </div>
          <article>
            <div>Lesson 1</div>
            <div>Lesson 2</div>
            <div>Lesson 3</div>
          </article>
        </section>
        <img src={fot3} className="w-[30%]" />
      </main>
    </section>
  );
};

export default Home;
