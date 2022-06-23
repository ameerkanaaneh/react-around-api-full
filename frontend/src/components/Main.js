import React from "react";
import Card from "./Card.js";
import CurrentUserContext from "../contexts/CurrentUserContext.js";

export default function Main(props) {
  const currentUser = React.useContext(CurrentUserContext);
  const { name, about, avatar } = currentUser;

  return (
    <main>
      <section className="profile">
        <div className="profile__container">
          <div
            className="profile__overlay-container"
            onClick={props.onEditAvatarClick}
          >
            <img
              src={avatar}
              alt="profile picture"
              className="profile__image"
            />
            <div className="profile__overlay"></div>
          </div>

          <div className="profile__info">
            <div className="profile__head">
              <h1 className="profile__name">{name}</h1>
              <button
                onClick={props.onEditProfileClick}
                type="button"
                className="profile__edit-button"
                src="./images/EditButton.png"
              ></button>
            </div>

            <p className="profile__interest">{about}</p>
          </div>
        </div>

        <button
          onClick={props.onAddPlaceClick}
          type="button"
          className="profile__add-button"
        ></button>
      </section>
      <section className="elements">
        {props.cards.map((card) => (
          <Card
            key={card._id}
            card={card}
            onCardClick={props.onCardClick}
            onCardLike={props.onCardLike}
            onCardDelete={props.onCardDelete}
          />
        ))}
      </section>
      {props.children}
    </main>
  );
}
