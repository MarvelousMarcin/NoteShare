import fot1 from "../../assets/fot2.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!password || !email || !name) {
      return setError("Empty inputs");
    }

    const response = await fetch("http://localhost:4000/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password, email }),
    });

    if (response.ok) {
      navigate("/");
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
        <section>
          <img className="w-[30rem]" src={fot1} />
        </section>
        <form
          onSubmit={onSubmit}
          className="flex flex-col h-[35rem] justify-evenly w-[23rem]"
        >
          <article>
            <h1 className="text-5xl text-center">Join to us</h1>
            <p className="text-center text-xl text-[#565454] font-medium">
              Use best note app ever
            </p>
          </article>
          <article className="flex flex-col">
            <label className="text-lg" for="password">
              Name
            </label>
            <input
              onChange={(e) => {
                setName(e.target.value);
              }}
              value={name}
              className="bg-transparent placeholder-[#e1d9d1] outline-none border-2 rounded-md border-[#d7d0c8] px-4 py-3"
              id="password"
              type="text"
              placeholder="Enter your Name"
            />
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

          {error && <div className="text-red-600">{error}</div>}

          <button
            onClick={onSubmit}
            className="bg-[#181818] text-white w-[100%] h-[2.5rem] font-bold"
          >
            Sign up
          </button>
          <h2 className="text-center">
            Already a user?{" "}
            <span className="font-bold">
              <Link to="/">Sign in</Link>
            </span>
          </h2>
        </form>
      </main>
    </section>
  );
};

export default Register;
