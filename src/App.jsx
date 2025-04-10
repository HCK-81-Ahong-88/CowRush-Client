import TypingTest from "./pages/TypingTest.page";
import LoginPage from "./pages/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./contexts/theme.context";
import LoginLayout from "./layouts/LoginLayout";
import AuthLayout from "./layouts/AuthLayout";
import { SocketProvider } from "./contexts/socket.context";

function App() {
	return (
		<ThemeProvider>
			<SocketProvider>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<LoginLayout />}>
							<Route index element={<LoginPage />} />
						</Route>
						<Route path="/typing-test" element={<AuthLayout />}>
							<Route index element={<TypingTest />} />
						</Route>
					</Routes>
				</BrowserRouter>
			</SocketProvider>
		</ThemeProvider>
	);
}

export default App;
