//Packages
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

//Images & Graphic Resources
import House from '../../../assets/icons/general/house.svg?react';
import Cart from '../../../assets/icons/general/cart.svg?react';
import Backpack from '../../../assets/icons/general/backpack.svg?react';
import Utils from '../../../assets/icons/general/utils.svg?react';
import BrandLogo from '../../../assets/images/general/brand-logo.jpg';

export default function PCNavbar ({image, name}) {
	const navigate = useNavigate();
	const location = useLocation();
	const [hover, setHover] = useState({
		home: false,
		cart: false,
		schools: false,
		utils: false
	})

	return (
		<nav className="flex gap-5 items-center rounded-full px-5 py-2 bg-zinc-100 z-1000 fixed top-4 left-1/2 -translate-x-1/2 shadow-[-5px_5px_5px_0px_var(--color-zinc-300)]">
			<button className="py-2 items-center flex justify-between">
				<div className="h-8 aspect-square flex justify-center items-center p-1 bg-[#F4C110] overflow-hidden rounded-full">
					<img src={BrandLogo} className="w-full aspect-square"/>
				</div>
			</button>
			<button
				onClick={() => {navigate('/')}}
				onMouseOver={() => setHover(prev => ({...prev, home: true}))}
				onMouseOut={() => setHover(prev => ({...prev, home: false}))}
				className={`group rounded-full py-2 flex items-center justify-center duration-1000 ease-in-out transition-all
					${location.pathname === "/"? "px-4 gap-2 bg-zinc-50" : "hover:px-4 hover:gap-2 hover:bg-zinc-50"}	
				`}
			>
				<House className="w-6 h-6 navbar-button"/>
				<p
					className={`max-w-0 overflow-hidden whitespace-nowrap navbar-button duration-1000
						${location.pathname === "/"? "max-w-xs" : "group-hover:max-w-xs"}
					`}
				>
					Inicio
				</p>
			</button>
			<button 
				onClick={() => {navigate('/cart')}}
				onMouseOver={() => setHover(prev => ({...prev, cart: true}))}
				onMouseOut={() => setHover(prev => ({...prev, cart: false}))}
				className={`group rounded-full py-2 flex items-center justify-center transition-all ease-in-out duration-1000
					${location.pathname === "/cart"? "px-4 gap-2 bg-zinc-50" : "hover:px-4 hover:gap-2 hover:bg-zinc-50"}	
				`}
			>
				<Cart className="w-8 h-8 navbar-button"/>
				<p
					className={`max-w-0 overflow-hidden whitespace-nowrap navbar-button transition-max-w duration-1000
						${location.pathname === "/cart"? "max-w-xs" : "group-hover:max-w-xs"}
					`}
				>
					Carrito
				</p>
			</button>

			{/*If the current location is /schools/* (* is a string number), its an instruction of set the sidebar stage in the first stage.*/}
			<button
				onClick={() => {navigate('/schools', location.pathname.split('/').filter(path => path !== "" && !isNaN(path))[0]? {state: {setSidebarStage: 0}} : {})}}
				onMouseOver={() => setHover(prev => ({...prev, schools: true}))}
				onMouseOut={() => setHover(prev => ({...prev, schools: false}))}
				className={`group rounded-full py-2 flex items-center justify-center duration-1000 ease-in-out transition-all
					${location.pathname.split('/').filter(path => path === 'schools')[0] !== undefined ? "px-4 gap-2 bg-zinc-50" : "hover:px-4 hover:gap-2 hover:bg-zinc-50"}	
				`}
			>
				<Backpack className="w-7 h-7 navbar-button"/>
				<p
					className={`max-w-0 overflow-hidden whitespace-nowrap navbar-button duration-1000
						${location.pathname.split('/').filter(path => path === 'schools')[0] !== undefined ? "max-w-xs" : "group-hover:max-w-xs"}
					`}
				>
					Escuelas
				</p>
			</button>
			<button 
				onClick={() => {navigate('/products')}}
				onMouseOver={() => setHover(prev => ({...prev, utils: true}))}
				onMouseOut={() => setHover(prev => ({...prev, utils: false}))}
				className={`group rounded-full py-2 flex items-center justify-center duration-1000 ease-sin-out transition-all
					${location.pathname === "/products"? "px-4 gap-2 bg-zinc-50" : "hover:px-4 hover:gap-2 hover:bg-zinc-50"}	
				`}
			>
				<Utils className="w-6 h-6 rotate-25 scale-140 translate-y-1/5 mx-2 navbar-button"/>
				<p
					className={`max-w-0 overflow-hidden whitespace-nowrap navbar-button duration-1000
						${location.pathname === "/products"? "max-w-xs" : "group-hover:max-w-xs"}
					`}
				>
					Útiles
				</p>
			</button>
			<div id='pcNavOutlet' className="empty:hidden flex items-center justify-center self-stretch"></div>
			<div className="w-[2px] h-8 bg-gray-200 -mx-2.5 my-auto rounded-full"></div>
			{image && name?
				<button onClick={() => {navigate('/profile')}} className="w-7.75 aspect-square rounded-full bg-cover bg-center" style={{"backgroundImage":/*Then replace for url(${image})*/"url('https://www.hola.com/horizon/original_aspect_ratio/19b3b6722815-mujer-feliz-z.jpg')"}}></button>:
				<>
					<button onClick={() => {navigate('/login')}} className="navbar-button"><img/>Entrar</button>
					<button onClick={() => {navigate('/register')}} className="navbar-button"><img/>Inscribirse</button>
				</>
			}
		</nav>
	)
}