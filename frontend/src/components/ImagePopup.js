export default function ImagePopup(props) {
  const { card, onClose } = props;
  return (
    <section
      className={`popup popup_type_image ${
        card.name !== "" ? "popup_opened" : ""
      }`}
    >
      <div className="popup__container-card">
        <button
          onClick={onClose}
          type="button"
          className="popup__close"
        ></button>
        <img src={card.link} alt={card.name} className="popup__card-image" />
        <p className="popup__name">{card.name}</p>
      </div>
    </section>
  );
}
