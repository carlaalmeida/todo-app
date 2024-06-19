import "./ItemContent.scss";

export default function ItemContent({ text, isChecked, onClick }) {
  const className = `ItemContent ${isChecked ? "checked" : null}`;
  return (
    <p className={className} onClick={onClick}>
      {text}
    </p>
  );
}
