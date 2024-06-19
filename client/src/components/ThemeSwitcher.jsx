export function ThemeSwitcher(props) {
  const { mode, onChange } = props;

  const moon = <img src="../images/icon-moon.svg" alt="" />;
  const sun = <img src="../images/icon-sun.svg" alt="" />;

  return (
    <>
      <button
        onClick={onChange}
        title={
          mode === "light" ? "Change to Dark Mode" : "Change to Light Mode"
        }
      >
        {mode === "light" && moon}
        {mode === "dark" && sun}
      </button>
    </>
  );
}
