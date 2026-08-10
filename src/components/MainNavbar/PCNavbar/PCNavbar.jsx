import { useNavigate } from "react-router-dom"

export default function PCNavbar ({image, name}) {
	const navigate = useNavigate();

	return (
		<nav>
			<button onClick={() => {navigate('/')}}><img/>home</button> {/*Edumarket logo con letras.*/}
			<button onClick={() => {navigate('/cart')}}><img/> cart</button>
			<button onClick={() => {navigate('/schools')}}><img/> schools</button>
			<button onClick={() => {navigate('/products')}}><img/> prods</button>
			<div id='pcNavOutlet'></div>
			{image && name?
				<button onClick={() => {navigate('/profile')}}><img src={image}/>{name}</button>:
				<>
					<button onClick={() => {navigate('/login')}}><img/>login</button>
					<button onClick={() => {navigate('/register')}}><img/>register</button>
				</>
			}
		</nav>
	)
}