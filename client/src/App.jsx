import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import AppContent from "./components/AppContent";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ThemeSwitcher } from "./components/ThemeSwitcher";

const queryClient = new QueryClient();

export default function App() {
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem("todo-app.theme");
    if (
      !storedTheme &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    )
      return "dark";
    return storedTheme || "light";
  });


  useEffect(() => {
    document.documentElement.className = `app--${theme}`;
    localStorage.setItem("todo-app.theme", theme);
  }, [theme]);

  function handleChangeTheme() {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  }

  return (
    <QueryClientProvider client={queryClient}>
      {/* <ReactQueryDevtools /> */}
      <div className="flex-container">
        <Header>
          <ThemeSwitcher theme={theme} onChange={handleChangeTheme} />
        </Header>
        <AppContent />
        <Footer />
      </div>
    </QueryClientProvider>
  );
}
