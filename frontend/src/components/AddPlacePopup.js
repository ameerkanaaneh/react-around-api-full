import React from "react";

import PopupWithForm from "./PopupWithForm";

export default function AddPlacePopup(props) {
  const [title, setTitle] = React.useState("");
  const [url, setUrl] = React.useState("");

  function handleTitleChange(evt) {
    setTitle(evt.target.value);
  }

  function handleUrlChange(evt) {
    setUrl(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();

    props.onAddPlaceSubmit({ title, url });
  }

  return (
    <PopupWithForm
      isOpen={props.isOpen}
      onClose={props.onClose}
      title="New place"
      name="card"
      buttonText="Create"
      onSubmit={handleSubmit}
    >
      <input
        className="popup__input popup__input_type_title"
        placeholder="Title"
        type="text"
        id="title-input"
        required
        name="title"
        minLength="1"
        maxLength="30"
        value={title}
        onChange={handleTitleChange}
      />
      <span className="title-input-error popup__input-error"></span>

      <input
        placeholder="Image link"
        className="popup__input popup__input_type_link"
        type="url"
        id="image-link-input"
        required
        name="image_link"
        value={url}
        onChange={handleUrlChange}
      />
      <span className="image-link-input-error popup__input-error"></span>
    </PopupWithForm>
  );
}
