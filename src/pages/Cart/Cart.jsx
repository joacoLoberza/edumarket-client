import { useContext } from "react";
import UserContext from "../../contexts/UserContext";
import CartContext from "../../contexts/CartContext";
import useAutoPag from "../../hooks/useAutoPag";

export default function Cart () {
	const { name, image } = useContext(UserContext);
	const { quitItem, addItem, changeAmount, cart } = useContext(CartContext);
	const [apiData, load, pageEnding] = useAutoPag('/cart');
	const isLoged = Boolean(name && image);
	const data = isLoged ? apiData : cart;

	return (
		<div>
			{data.map(item => (
				<div key={item.id}>
					<h1>{item.Product.name}</h1>
					
				</div>
			))}
			{isLoged&&
				<div ref={pageEnding}></div>
			}
		</div>
	)
}