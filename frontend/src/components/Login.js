import React from "react";
import { Link, useNavigate } from "react-router-dom";
import fail from "../images/UnionFail.svg";
import * as auth from "../utils/auth";

export default function Login(props) {
  const navigate = useNavigate();
  const {
    data,
    state,
    setData,
    isLoggedIn,
    setImageUrl,
    setMessage,
    setState,
    handleLogin,
    setToken,
  } = props;

  React.useEffect(() => {
    setData({ ...data, email: "", password: "" });
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!data.password || !data.email) {
      return;
    }

    auth
      .authorize(data.email, data.password)
      .then((data) => {
        if (data) {
          if (data.token) {
            setState(false);
            setToken(data.token);
            localStorage.setItem("token", data.token);
            return;
          }
        } else {
          setImageUrl(fail);
          setMessage("Oops, something went wrong! Please try again.");
          setState(true);
          throw new Error("email or password is not correct");
        }
      })
      .then(() => {
        if (!state) {
          handleLogin(e);
          console.log(isLoggedIn);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        if (isLoggedIn) navigate("/");
      });
  }
  return (
    <section className="entry">
      <h2 className="entry__header">Log in</h2>
      <form onSubmit={handleSubmit} className="entry__form">
        <input
          className="entry__input"
          name="email"
          onChange={handleChange}
          value={data.email}
          type="email"
          placeholder="Email"
          required
        ></input>
        <input
          className="entry__input"
          name="password"
          onChange={handleChange}
          value={data.password}
          type="password"
          placeholder="Password"
          required
        ></input>
        <button className="entry__submit" type="submit">
          Log in
        </button>
      </form>
      <Link className="entry__link" to="/signup">
        Not a member yet? Sign up here!
      </Link>
    </section>
  );
}
