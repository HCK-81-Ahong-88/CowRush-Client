import { createContext, useContext, useState } from "react";

export const ThemeContext = createContext({
	theme: "dark",
	setTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
	const [defaultTheme, setDefaultTheme] = useState(localStorage.getItem("theme") || "dark");

	const setTheme = (newTheme) => {
		setDefaultTheme(newTheme);
		localStorage.setItem("theme", newTheme);
	};

	return (
		<ThemeContext.Provider
			value={{
				theme: defaultTheme,
				setTheme,
			}}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => {
	return useContext(ThemeContext);
};
