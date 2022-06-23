export default function PopupWithForm(props) {
  return (
    <section
      className={`popup popup_type_${props.name} ${
        props.isOpen ? "popup_opened" : ""
      }`}
    >
      <div
        className={`popup__container ${
          props.modifier && `popup__container_${props.modifier}`
        }`}
      >
        <button
          type="button"
          className="popup__close"
          onClick={props.onClose}
        ></button>
        <h3 className="popup__title">{props.title}</h3>
        <form
          onSubmit={props.onSubmit}
          className={`popup__form popup__form_type_${props.name}`}
          name={props.name}
        >
          <fieldset className="popup__fields">
            {props.children}
            <input
              className="popup__button"
              type="submit"
              value={props.buttonText}
            />
          </fieldset>
        </form>
      </div>
    </section>
  );
}
