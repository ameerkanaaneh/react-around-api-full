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
  }, []);

  // componentDidMount?
  React.useEffect(() => {
    // load cards
    api
      .getInitialCards()
      .then((loadedCards) => {
        setCards([...cards, ...loadedCards]);
      })
      .catch((err) => console.log(err));
  }, []);

  React.useEffect(() => {
    api
      .loadUserInfo()
      .then((data) => {
        console.log(data);
        setCurrentUser(data);
      })
      .catch((err) => console.log(err));
  }, []);

  function tokenCheck() {
    if (localStorage.getItem("token")) {
      const token = localStorage.getItem("token");
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
      .editProfileData(name, about)
      .then((user) => {
        setCurrentUser(user);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateAvatar({ avatar }) {
    api
      .changeProfileAvatar(avatar)
      .then((user) => {
        setCurrentUser(user);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((user) => user._id === currentUser._id);
    isLiked
      ? api
          .unlikeCard(card._id)
          .then((newCard) =>
            setCards((state) =>
              state.map((currentCard) =>
                currentCard._id === card._id ? newCard : currentCard
              )
            )
          )
          .catch((err) => console.log(err))
      : api
          .likeCard(card._id)
          .then((newCard) =>
            setCards((state) =>
              state.map((currentCard) =>
                currentCard._id === card._id ? newCard : currentCard
              )
            )
          )
          .catch((err) => console.log(err));
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) =>
          state.filter((currentCard) => currentCard._id !== card._id)
        );
      })
      .catch((err) => console.log(err));
  }

  function handleAddPlaceSubmit({ title, url }) {
    api
      .addNewCard(title, url)
      .then((newCard) => {
        setCards([newCard, ...cards]);
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
