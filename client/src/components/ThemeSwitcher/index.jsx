import "./index.scss";
import MoonIcon from "/images/icon-moon.svg";
import SunIcon from "/images/icon-sun.svg";

export function ThemeSwitcher({ theme, onChange }) {
  const icon = <img src={theme === "light" ? MoonIcon : SunIcon} />;
  return (
    <button
      className="theme-switcher"
      onClick={onChange}
      title={theme === "light" ? "Change to Dark Mode" : "Change to Light Mode"}
    >
      {icon}
    </button>
  );
}
