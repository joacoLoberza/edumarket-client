import { UserProvider } from "./contexts/UserContext.jsx";
import { GuestCartProvider } from "./contexts/GuestCartContext.jsx";

export default function AppProvider({children}) {
	return (
		<UserProvider>
			<GuestCartProvider>
				{ children }
			</GuestCartProvider>
		</UserProvider>
	)
}