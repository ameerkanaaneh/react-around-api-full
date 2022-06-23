import CurrentUserContext from "../contexts/CurrentUserContext";
import React from "react";

export default function Card(props) {
  const { card } = props;

  const currentUser = React.useContext(CurrentUserContext);
  const isOwn = card.owner._id === currentUser._id;
  const isLiked = card.likes.some((user) => user._id === currentUser._id);

  function handleClick() {
    props.onCardClick(card);
  }

  function handleLikeClick() {
    props.onCardLike(card);
  }

  function handleDeleteClick() {
    props.onCardDelete(card);
  }

  return (
    <div className="element">
      <button
        type="button"
        className={`element__delete-button ${
          isOwn && "element__delete-button_visible"
        }`}
        onClick={handleDeleteClick}
      ></button>
      <img
        className="element__image"
        onClick={handleClick}
        src={card.link}
        alt={card.name}
      />
      <div className="element__box">
        <h2 className="element__name">{card.name}</h2>
        <div className="element__likes-wrapper">
          <button
            onClick={handleLikeClick}
            type="button"
            className={`element__like ${isLiked && "element__like_active"}`}
          ></button>
          <p className="element__count">{card.likes.length}</p>
        </div>
      </div>
    </div>
  );
}
