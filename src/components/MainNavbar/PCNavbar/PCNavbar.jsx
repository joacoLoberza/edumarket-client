import { useNavigate } from "react-router-dom"

import House from '../../../assets/icons/general/house.svg?react';
import Cart from '../../../assets/icons/general/cart.svg?react';
import Backpack from '../../../assets/icons/general/backpack.svg?react';
import Utils from '../../../assets/icons/general/utils.svg?react';

export default function PCNavbar ({image, name}) {
	const navigate = useNavigate();

	return (
		<nav className="flex gap-5 rounded-full px-5 py-2 bg-zinc-100 z-1000 fixed top-4 left-1/2 -translate-x-1/2 shadow-[-7px_7px_6px_0px_rgba(100,100,125,0.5)]">
			<button onClick={() => {navigate('/')}} title="Inicio"><House className="w-6 h-6 navbar-button"/></button> {/*Edumarket logo con letras. (cuando me lo den)*/}
			<button onClick={() => {navigate('/cart')}} title="Carrito"><Cart className="w-8 h-8 navbar-button"/></button>
			<button onClick={() => {navigate('/schools')}} title="Escuelas"><Backpack className="w-7 h-7 navbar-button"/></button>
			<button onClick={() => {navigate('/products')}} title="Productos"><Utils className="w-6 h-6 rotate-25 scale-140 translate-y-1/5 mx-2 navbar-button"/></button>
			<div id='pcNavOutlet' className="empty:hidden"></div>
			<div className="w-[2px] h-8 bg-gray-200 -mx-2.5 my-auto rounded-full"></div>
			{image && name?
				<button onClick={() => {navigate('/profile')}}><img src={image}/>{name}</button>:
				<>
					<button onClick={() => {navigate('/login')}} className="navbar-button"><img/>Entrar</button>
					<button onClick={() => {navigate('/register')}} className="navbar-button"><img/>Soy Nuevo</button>
				</>
			}
		</nav>
	)
}