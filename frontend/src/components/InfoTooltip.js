import React from "react";

export default function InfoTootip(props) {
  return (
    <section
      className={`popup popup_type_image ${props.isOpen && "popup_opened"}`}
    >
      <div className="popup__container">
        <button
          onClick={props.onClose}
          type="button"
          className="popup__close"
        ></button>
        <img src={props.imageUrl} alt="image" className="popup__image" />
        <p className="popup__message">{props.message}</p>
      </div>
    </section>
  );
}
