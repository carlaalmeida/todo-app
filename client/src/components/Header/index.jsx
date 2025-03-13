import "./index.scss";

export default function Header({ children }) {
  return (
    <header className="header">
      <h1 className="header__title">Todo</h1>
      {children}
    </header>
  );
}
