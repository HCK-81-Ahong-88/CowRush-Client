import { createContext, useContext, useState } from "react";

export const ThemeContext = createContext({
  theme: "light",
  color: {},
  setTheme: () => {},
});

const dark = {
  backgroundColor: "bg-dark",
  backgroundColorSecondary: "bg-secondary",
};

const light = {
  backgroundColor: "bg-light",
  backgroundColorSecondary: "bg-white",
};

export const ThemeProvider = ({ children }) => {
  const [defaultTheme, setDefaultTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  const setTheme = (newTheme) => {
    setDefaultTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: defaultTheme,
        setTheme,
        color: defaultTheme === "dark" ? dark : light,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
