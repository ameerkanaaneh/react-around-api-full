import React from "react";
import { Navigate, useNavigate, Route, Routes } from "react-router-dom";

import "../index.css";
import Header from "./Header.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
import PopupWithForm from "./PopupWithForm.js";
import ImagePopup from "./ImagePopup.js";
import api from "../utils/api.js";
import CurrentUserContext from "./../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup.js";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import Register from "./Register.js";
import Login from "./Login.js";
import ProtectedRoute from "./ProtectedRoute.js";
import InfoTootip from "./InfoTooltip";
import * as auth from "../utils/auth";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] =
    React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({
    name: "",
    link: "",
  });
  const [isRegistered, setIsRegistered] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState("");
  const [message, setMessage] = React.useState("");

  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [token, setToken] = React.useState(localStorage.getItem("token"));

  const [data, setData] = React.useState({
    email: "",
    password: "",
  });

  function handleLogin(e) {
    e.preventDefault();
    setIsLoggedIn(true);
  }
  React.useEffect(() => {
    tokenCheck();
  }, [token]);

  // componentDidMount?
  React.useEffect(() => {
    // load cards
    if (token) {
      api
        .getInitialCards(token)
        .then((loadedCards) => {
          setCards([...cards, ...loadedCards.data]);
        })
        .catch((err) => console.log(err));
    }
  }, [token]);

  React.useEffect(() => {
    if (token) {
      api
        .loadUserInfo(token)
        .then((user) => {
          setCurrentUser(user.data);
        })
        .catch((err) => console.log(err));
    }
  }, [token]);

  function tokenCheck() {
    if (token) {
      auth
        .checkToken(token)
        .then((res) => {
          if (res) {
            setData({ ...data, email: res.data.email });
            setIsLoggedIn(true);
          }
        })
        .then(() => {
          navigate("/");
        })
        .catch((err) => console.log(err));
    } else {
      setIsLoggedIn(false);
    }
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsInfoTooltipPopupOpen(false);
    setSelectedCard({ name: "", link: "" });
  }

  function handleUpdateUser({ name, about }) {
    api
      .editProfileData(name, about, token)
      .then((user) => {
        setCurrentUser(user.data);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateAvatar({ avatar }) {
    api
      .changeProfileAvatar(avatar, token)
      .then((user) => {
        setCurrentUser(user.data);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleCardLike(card) {
    const isLiked = card.likes.includes(currentUser._id);
    isLiked
      ? api
          .unlikeCard(card._id, token)
          .then((newCard) => {
            const newCards = cards.map((c) =>
              c._id === card._id ? newCard.data : c
            );
            setCards(newCards);
          })

          .catch((err) => console.log(err))
      : api
          .likeCard(card._id, token)
          .then((newCard) => {
            const newCards = cards.map((c) =>
              c._id === card._id ? newCard.data : c
            );
            setCards(newCards);
          })
          .catch((err) => console.log(err));
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id, token)
      .then(() => {
        setCards(cards.filter((c) => c._id !== card._id));
      })
      .catch((err) => console.log(err));
  }

  function handleAddPlaceSubmit({ title, url }) {
    api
      .addNewCard(title, url, token)
      .then((newCard) => {
        setCards([...cards, newCard.data]);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <InfoTootip
        onClose={() => {
          closeAllPopups();
          if (isRegistered) {
            setData({ password: "", email: "" });
            navigate("/signin");
            setIsRegistered(false);
          }
        }}
        isOpen={isInfoTooltipPopupOpen}
        imageUrl={imageUrl}
        message={message}
      />
      <Routes>
        <Route
          path="signup"
          element={
            <div className="pageEntry">
              <Header page="signin" />
              <Register
                setIsRegistered={setIsRegistered}
                setImageUrl={setImageUrl}
                setMessage={setMessage}
                setState={setIsInfoTooltipPopupOpen}
                data={data}
                setData={setData}
              />
            </div>
          }
        />
        <Route
          path="signin"
          element={
            <div className="pageEntry">
              <Header page="signup" />
              <Login
                state={isInfoTooltipPopupOpen}
                setImageUrl={setImageUrl}
                setMessage={setMessage}
                setState={setIsInfoTooltipPopupOpen}
                data={data}
                setData={setData}
                setToken={setToken}
                isLoggedIn={isLoggedIn}
                handleLogin={handleLogin}
              />
            </div>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute path="/" loggedIn={isLoggedIn}>
              <div className="page">
                <Header
                  setData={setData}
                  setIsLoggedIn={setIsLoggedIn}
                  email={data.email}
                />
                <Main
                  onEditAvatarClick={handleEditAvatarClick}
                  onEditProfileClick={handleEditProfileClick}
                  onAddPlaceClick={handleAddPlaceClick}
                  onCardClick={handleCardClick}
                  cards={cards}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                >
                  <EditProfilePopup
                    onUpdateUser={handleUpdateUser}
                    isOpen={isEditProfilePopupOpen}
                    onClose={closeAllPopups}
                  />

                  <AddPlacePopup
                    isOpen={isAddPlacePopupOpen}
                    onClose={closeAllPopups}
                    onAddPlaceSubmit={handleAddPlaceSubmit}
                  />

                  <PopupWithForm
                    title="Are you sure?"
                    name="confirm"
                    modifier="confirm"
                    buttonText="Save"
                  ></PopupWithForm>

                  <EditAvatarPopup
                    onUpdateAvatar={handleUpdateAvatar}
                    isOpen={isEditAvatarPopupOpen}
                    onClose={closeAllPopups}
                  />
                  <ImagePopup onClose={closeAllPopups} card={selectedCard} />
                </Main>
                <Footer />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={isLoggedIn ? <Navigate to="/" /> : <Navigate to="/signin" />}
        />
      </Routes>
    </CurrentUserContext.Provider>
  );
}

export default App;
