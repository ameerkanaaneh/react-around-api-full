import React from "react";
import { Link } from "react-router-dom";
import success from "../images/Union.svg";
import fail from "../images/UnionFail.svg";
import * as auth from "../utils/auth";

export default function Register(props) {
  const { data, setData, setState, setMessage, setImageUrl, setIsRegistered } =
    props;

  React.useEffect(() => {
    setData({ ...data, email: "", password: "" });
  }, []);

  const handleSubmit = function (e) {
    e.preventDefault();
    auth
      .register(data.email, data.password)
      .then((res) => {
        if (!res.data) {
          setImageUrl(fail);
          setMessage("Oops, something went wrong! Please try again.");
          setState(true);
        } else {
          setImageUrl(success);
          setMessage("Success! You have now been registered.");
          setIsRegistered(true);
          setState(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setImageUrl(fail);
        setMessage("Oops, something went wrong! Please try again.");
      });
  };

  const handleChange = function (e) {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  return (
    <section className="entry">
      <h2 className="entry__header">Sign up</h2>
      <form onSubmit={handleSubmit} className="entry__form">
        <input
          className="entry__input"
          name="email"
          type="email"
          placeholder="Email"
          value={data.email}
          onChange={handleChange}
          required
        ></input>
        <input
          className="entry__input"
          name="password"
          placeholder="Password"
          value={data.password}
          type="password"
          onChange={handleChange}
          required
        ></input>
        <button className="entry__submit" type="submit">
          Sign up
        </button>
      </form>
      <Link className="entry__link" to="/signin">
        Already a member? Log in here!
      </Link>
    </section>
  );
}
