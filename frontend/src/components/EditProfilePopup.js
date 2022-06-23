import React from "react";
import PopupWithForm from "./PopupWithForm.js";
import CurrentUserContext from "../contexts/CurrentUserContext.js";

export default function EditProfilePopup(props) {
  const { isOpen, onClose } = props;
  const currentUser = React.useContext(CurrentUserContext);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, isOpen]);

  function handleNameInputChange(evt) {
    setName(evt.target.value);
  }

  function handleDescriptionInputChange(evt) {
    setDescription(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();

    props.onUpdateUser({ name, about: description });
  }

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      title="Edit profile"
      name="profile"
      buttonText="Save"
      onSubmit={handleSubmit}
    >
      <input
        className="popup__input popup__input_type_name"
        value={name || ""}
        onChange={handleNameInputChange}
        type="text"
        id="name-input"
        name="name"
        required
        minLength="2"
        maxLength="40"
      />
      <span className="name-input-error popup__input-error"></span>

      <input
        className="popup__input popup__input_type_hobby"
        value={description || ""}
        onChange={handleDescriptionInputChange}
        type="text"
        id="hobby-input"
        name="hobby"
        required
        minLength="2"
        maxLength="200"
      />
      <span className="hobby-input-error popup__input-error"></span>
    </PopupWithForm>
  );
}
