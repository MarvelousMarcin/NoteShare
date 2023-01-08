import fot1 from "../../assets/fot1.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setToken, setIsLoggedIn } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    console.log(response);
    if (response.ok) {
      const data = await response.json();
      dispatch(setToken(data.token));
      dispatch(setIsLoggedIn(true));
      navigate("/home");
    } else {
      const data = await response.json();
      setError(data.error);
    }
  };

  return (
    <section className="w-screen h-screen bg-[#F1EDE9]">
      <nav className="h-[10vh] flex  items-center px-12">
        <h2 className="text-2xl">
          Note<span className="font-bold">Share</span>
        </h2>
      </nav>
      <main className="flex flex-row w-screen h-[90vh] justify-evenly items-center">
        <form
          onSubmit={onSubmit}
          className="flex flex-col h-[30rem] justify-evenly"
        >
          <article>
            <h1 className="text-5xl text-center">Welcome back</h1>
            <p className="text-center text-xl text-[#565454] font-medium">
              Please enter your details
            </p>
          </article>
          <article className="flex flex-col">
            <label className="text-lg" for="email">
              Email
            </label>
            <input
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
              className="bg-transparent placeholder-[#d9d3cd] outline-none border-2 rounded-md border-[#d9d3cd] px-4 py-3"
              id="email"
              type="text"
              placeholder="Enter your email"
            />
          </article>
          <article className="flex flex-col">
            <label className="text-lg" for="password">
              Password
            </label>
            <input
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              value={password}
              className="bg-transparent placeholder-[#e1d9d1] outline-none border-2 rounded-md border-[#d7d0c8] px-4 py-3"
              id="password"
              type="password"
              placeholder="Enter your password"
            />
          </article>
          <article className="flex flex-row justify-between">
            <h2 className="text-red-800 font-bold">{error}</h2>
          </article>
          <button
            onClick={onSubmit}
            className="bg-[#181818] text-white w-[100%] h-[2.5rem] font-bold"
          >
            Sign in
          </button>
          <h2 className="text-center">
            Don’t have an account?{" "}
            <span className="font-bold">
              <Link to="/signup">Sign up</Link>
            </span>
          </h2>
        </form>
        <section>
          <img className="w-[22rem] hidden md:block" src={fot1} />
        </section>
      </main>
    </section>
  );
};

export default Login;
