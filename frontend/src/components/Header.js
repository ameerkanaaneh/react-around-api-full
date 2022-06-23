import { NavLink, useNavigate } from "react-router-dom";
import logo from "../images/Vector(1).svg";
export default function Header(props) {
  const navigate = useNavigate();
  function handleLogout() {
    localStorage.removeItem("token");
    props.setIsLoggedIn(false);
    props.setData({ email: "", password: "" });
    navigate("/signin");
  }
  return (
    <header className="header">
      <img className="header__title" src={logo} alt="around the us" />
      {props.page ? (
        <NavLink className="header__navLink" to={`/${props.page}`}>
          {props.page === "signup" ? "Sign up" : "Log in"}
        </NavLink>
      ) : (
        <div className="header__about">
          <p className="header__email">{props.email}</p>
          <NavLink
            onClick={handleLogout}
            className="header__navLink"
            to={`/signin`}
          >
            Log out
          </NavLink>
        </div>
      )}
    </header>
  );
}
