import { UserProvider } from "./contexts/UserContext"
import { CartProvider } from "./contexts/CartContext"

export default function AppProvider({children}) {
	return (
		<UserProvider>
			<CartProvider>
				{ children }
			</CartProvider>
		</UserProvider>
	)
}