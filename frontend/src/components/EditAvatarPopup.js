import React from "react";
import PopupWithForm from "./PopupWithForm";

export default function EditAvatarPopup(props) {
  const inputRef = React.useRef();

  function handleSubmit(evt) {
    evt.preventDefault();

    props.onUpdateAvatar({
      avatar: inputRef.current.value,
    });
  }

  return (
    <PopupWithForm
      isOpen={props.isOpen}
      onClose={props.onClose}
      title="Change profile picture"
      name="avatar"
      buttonText="Save"
      onSubmit={handleSubmit}
    >
      <input
        className="popup__input popup__input_type_url"
        placeholder="profile image link"
        type="url"
        id="url-input"
        required
        name="url"
        ref={inputRef}
      />
      <span className="url-input-error popup__input-error"></span>
    </PopupWithForm>
  );
}
