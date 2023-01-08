import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setToken, setIsLoggedIn } from "../../features/auth/authSlice";
import { useEffect } from "react";

const Settings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [stats, setStats] = useState([]);
  const token = useSelector((state) => state.auth.token);

  const logoutHandler = () => {
    dispatch(setToken(""));
    dispatch(setIsLoggedIn(false));
    navigate("/");
  };

  const getStats = async () => {
    const response = await fetch("http://localhost:4000/get_stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await response.json();
    console.log(data);
    setStats(data);
  };

  const getNormalTime = (time) => {
    if (!time) return "";
    const date = new Date(Number(time));
    let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let month =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;

    let timeValue = `${
      date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
    }:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()} `;

    const formatted = `${day}/${month}/${date.getFullYear()} ${timeValue}`;
    return formatted;
  };

  useEffect(() => {
    getStats();
  }, []);

  return (
    <section className="w-screen h-screen bg-[#F1EDE9]">
      <nav className="h-[11vh] flex justify-between items-center px-10">
        <h2 className="text-2xl">
          Note<span className="font-bold">Share</span>
        </h2>
        <ul className="flex justify-evenly w-[38vw]">
          <li className="cursor-pointer ">
            {" "}
            <Link to="/home">Your notes</Link>
          </li>
          <li className="cursor-pointer">
            <Link to="/shared">Shared to me</Link>
          </li>
          <li className="cursor-pointer">
            <Link to="/public">Public notes</Link>
          </li>
          <li className="cursor-pointer font-bold">
            <Link to="/settings">Settings</Link>
          </li>
          <li onClick={logoutHandler} className="cursor-pointer">
            Log out
          </li>
        </ul>
      </nav>
      <main className="flex justify-center items-center w-screen flex-col">
        <h1 className="text-3xl mb-10">Last logged from</h1>
        {stats?.map((item) => (
          <article className="flex flex-row w-[25rem] justify-between">
            <div className="text-2xl">{item.ip}</div>
            <div className="text-2xl">{getNormalTime(item.time)}</div>
          </article>
        ))}
      </main>
    </section>
  );
};

export default Settings;
