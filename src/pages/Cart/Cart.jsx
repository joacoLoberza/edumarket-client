//Packages
import { useEffect, useContext, useState, useRef } from "react";
import api from  '../../config/axiosApi.js';
import UserContext from "../../contexts/UserContext.jsx";
import GuestCartContext from "../../contexts/GuestCartContext.jsx";
import styles from './Cart.module.css';

//Graphic reources
import Trash from '../../assets/icons/general/trash.svg?react';
import List from '../../assets/icons/general/list.svg?react';
import Pencil from '../../assets/icons/general/pencil.svg?react';
import CartLogo from '../../assets/icons/cart/cart.svg?react';

export default function Cart () {
	const { name, image } = useContext(UserContext);
	const { guestCart, changeAmount, quitItem } = useContext(GuestCartContext);
	const isLoged = Boolean(name && image);
	const [ usrCart, setUsrCart ] = useState(null);
	const [loadDel, setLoadDel] = useState([]);
	const [loadAmount, setLoadAmount] = useState([]);
	const [loadOrder, setLoadOrder] = useState(false);
	const dropBox = useRef(null);
	
	const cart = isLoged? usrCart : guestCart;
	const moneyFormater = new Intl.NumberFormat('es-AR', {
		style: 'currency',
		currency: 'ARS',
	});
	const amountColors = ["bg-rose-600", "bg-amber-500", "bg-lime-500", "bg-purple-500", "bg-sky-500", "bg-blue-700", "bg-emerald-600", "bg-orange-600"];

	const fetchCart = async (next) => {
		try {
			const res = await api.get('/cart');
			const apiData = res.data;
			console.log(`%cAPI - ${res.status}|%c ${apiData.message}`, "color: rgb(255,255,0)");
			await next(apiData.cart);
		} catch (error) {
			const res = error?.response;
			if (!res) {
				console.error("%cERROR|%c Couldn't send the request.", "color: rgb(255, 60, 0)")
			} else {
				const resData = res?.data;
				console.log(`%cAPI - ${res.status}|%c ${resData?.message}`, "color: rgb(255,255,0)");
			}
		}
	};

	const deleteItem = async (itemId) => {
		if (isLoged) {
			try {
				//Delete item.
				setLoadDel(prev => [...prev, itemId]);
				const res = await api.delete(`/cart/${itemId}`);
				const apiData = res.data;
				console.log(`%cAPI - ${res.status}|%c ${apiData.message}`, "color: rgb(255,255,0)");
				
				//Refersh cart.
				await fetchCart((cart) => {setUsrCart(cart)});
			} catch (error) {
				const res = error?.response;
				if (!res) {
					console.error("%cERROR|%c Couldn't send the request.", "color: rgb(255, 60, 0)")
				} else {
					const resData = res?.data;
					console.log(`%cAPI - ${res.status}|%c ${resData?.message}`, "color: rgb(255,255,0)");
				}
			} finally {
				setLoadDel(prev => prev.filter(itemLoading => itemLoading !== itemId));
				return;
			}
		}
		quitItem(itemId);
	}

	const changeItemAmount = async (decrement = false, itemId) => {
		const currentAmount = cart.cartItems.filter(item => item.itemId === itemId)[0].amount;
		const newAmount = decrement? currentAmount - 1 : currentAmount + 1;
		
		if (newAmount < 1) return;

		if (isLoged) {
			try {
				//Change amount.
				setLoadAmount(prev => [...prev, itemId]);
				const res = await api.patch(`/cart/${itemId}`, {
					newAmount,
				});
				const apiData = res.data;
				console.log(`%cAPI - ${res.status}|%c ${apiData.message}`, "color: rgb(255,255,0)");

				//Refresh cart.
				await fetchCart((cart) => setUsrCart(cart));
			} catch (error) {
				const res = error?.response;
				if (!res) {
					console.error("%cERROR|%c Couldn't send the request.", "color: rgb(255, 60, 0)")
				} else {
					const resData = res?.data;
					console.log(`%cAPI - ${res.status}|%c ${resData?.message}`, "color: rgb(255,255,0)");
				}
			} finally {
				setLoadAmount(prev => prev.filter(itemLoading => itemLoading !== itemId));
				return;
			}
		}

		changeAmount(itemId, newAmount);
	}
	
	const createOrder = async  () => {
		try {
			setLoadOrder(true);
			const res = await api.post('/order');
			const apiData = res.data;
			console.log(`%cAPI - ${res.status}|%c ${apiData.message}`, "color: rgb(255,255,0)");
			window.open(apiData.init_point);
		} catch (error) {
			const res = error?.response;
			if (!res) {
				console.error("%cERROR|%c Couldn't send the request.", "color: rgb(255, 60, 0)")
			} else {
				const resData = res?.data;
				console.log(`%cAPI - ${res.status}|%c ${resData?.message}`, "color: rgb(255,255,0)");
			}
		} finally {
			setLoadOrder(false);
		}
	}

	useEffect(() => {
		let currentRender = true;
		if (isLoged) {
			fetchCart ((cart) => {
				if (currentRender)
					setUsrCart(cart);
			});
		}
		return () => {
			currentRender = false;
		}
	}, [isLoged]);

	return (
		<div className="relative w-screen h-screen overflow-hidden grid grid-cols-[3fr_3fr_2fr] h-screen @container">
			<div className="flex flex-col @container mr-2 ml-6 mt-27 overflow-hidden">
				<div className="flex items-center gap-3 text-zinc-600 mb-5">
					<List className="w-7 h-7 rotate-25"/>
					<h1 className="text-2xl font-quicksand font-bold">Listas</h1>
				</div>
				<div className="flex flex-col gap-4 min-h-0 overflow-y-scroll overflow-x-hidden rounded-xl px-2">
					{(Array.isArray(cart?.cartItems) && cart.cartItems.length > 0) &&
						cart.cartItems.filter(item => item.listId).map(item => (
							<div
								key={item.itemId}
								className="cartItem grid grid-cols-[5cqw_15cqw_auto_auto] grid-rows-[1fr_1fr_16px_auto] bg-zinc-100 py-4 px-6 rounded-xl"
							>
								<button disabled={loadDel.includes(item.itemId)} onClick={() => {deleteItem(item.itemId)}} className="row-[1/span_2] w-3/5 self-start flex items-center justify-center">
									<Trash className='w-8/10 h-8/10 text-zinc-500 hover:text-zinc-400 transition-colors duration-500 ease-in-out'/>
								</button>
								<div className="relative row-[1/span_2] self-center w-4/5 aspect-square">
									<div className="rounded-full overflow-hidden w-full h-full bg-gray-500">
										<img src={/*item.assembled? image : item.school.image*/"https://scorefy.app/_next/image?url=https%3A%2F%2Fcdn.scorefy.app%2Fteams%2Fshield%2Ftfpesghedynqpefn54314mqvs.png&w=256&q=75"} className="w-full h-full"></img>
										<div className={`
											${amountColors[Math.abs(item.itemId) % amountColors.length]}
											absolute -right-1 -bottom-1 rounded-full border-3 border-zinc-100 box-content w-1/3 aspect-square text-xs text-zinc-50 font-bold flex justify-center items-center`}>
											{item.amount}
										</div>
								</div>
								</div>
								<div className="row-[1/span_2] self-center">
									<h1 className="font-montserrat font-medium text-zinc-700">
										{item.assembled? item.name : item.school.name}
									</h1>
									{
										item.assembled?
										<p className="font-roboto font-semibold tracking-wide text-zinc-400 text-sm">lista personal</p>
										:
										<>
											<p className="font-roboto font-semibold tracking-wide text-zinc-400 text-sm">
												{item.course.level.toLowerCase()}
											</p>
											<p className="font-roboto font-medium tracking-wide text-zinc-400 text-xs">
												{item.course.grade}°{item.course.division}
											</p>
										</>
									}
								</div>
								<p className="justify-self-end text-zinc-600 text-sm font-roboto tracking-wide font-semibold flex flex-col row-[1/span_2]">
									{item.offerPrice?
										<>
											<span className="line-through text-xs text-zinc-500">{moneyFormater.format(item.basePrice)}</span>
											{moneyFormater.format(item.offerPrice)}
										</>
										:
										moneyFormater.format(item.basePrice)
									}
								</p>
								<div className="col-[2/3] row-[4/5] justify-self-end self-end flex gap-5 text-zinc-700 font-montserrat text-2xl">
									<button disabled={loadAmount.includes(item.itemId)} onClick={() => {changeItemAmount(true, item.itemId)}} className="rounded-full hover:bg-gray-300 hover:shadow-[0px_0px_3px_2px_var(--color-gray-300)] transition-all duration-300 ease-in-out aspect-square h-6 flex items-center justify-center">
										<div className="w-2 h-0.5 bg-zinc-500"></div>
									</button>
									<button disabled={loadAmount.includes(item.itemId)} onClick={() => {changeItemAmount(false, item.itemId)}} className="rounded-full hover:bg-gray-300 hover:shadow-[0px_0px_3px_2px_var(--color-gray-300)] transition-all duration-300 ease-in-out aspect-square h-6 flex items-center justify-center">
										<div className="w-3 h-0.5 bg-zinc-500 flex items-center justify-center">
											<div className="w-3 h-0.5 bg-zinc-500 rotate-90"></div>
										</div>
									</button>
								</div>
								<p className="col-[4/span_1] row-[4/5] justify-self-end self-end text-zinc-700 font-bold fony-roboto tracking-wide">
									{ item.offerPrice?
										moneyFormater.format(item.offerPrice * item.amount)
										:
										moneyFormater.format(item.basePrice * item.amount)
									}
								</p>
							</div>
						))
					}
				</div>
			</div>
			<div className="flex flex-col @container overflow-hidden ml-2 mr-6 mt-27 mb-5">
				<div className="flex items-center gap-3 text-zinc-600 mb-5">
					<Pencil className="w-8 h-8 rotate-35"/>
					<h1 className="text-2xl font-quicksand font-bold">Otros Artículos</h1>
				</div>
				<div className="flex flex-col gap-4 min-h-0 overflow-y-scroll overflow-x-hidden rounded-xl px-2">
					{(Array.isArray(cart?.cartItems) && cart.cartItems.length > 0) &&
						cart.cartItems.filter(item => item.productId).map(item => (
							<div
								key={item.itemId}
								className="cartItem grid grid-cols-[5cqw_15cqw_auto_auto] bg-zinc-100 py-4 px-6 rounded-xl grid-rows-[1fr_1fr_16px_auto]"
							>
								<button disabled={loadDel.includes(item.itemId)} onClick={() => {deleteItem(item.itemId)}} className="row-[1/span_2] w-3/5 flex items-center justify-center self-start">
									<Trash className='w-8/10 h-8/10 text-zinc-500 hover:text-zinc-400 transition-colors duration-500 ease-in-out'/>
								</button>
								<div className="relative row-[1/span_2] self-center w-4/5 aspect-square">
									<div className="rounded-full overflow-hidden w-full h-full bg-gray-500">
										<img src={/*item.image*/"https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Floralis_Gen%C3%A9rica_%2827547134408%29.jpg/250px-Floralis_Gen%C3%A9rica_%2827547134408%29.jpg?utm_source=es.wikipedia.org&utm_campaign=index&utm_content=thumbnail"} className="w-full h-full"></img>
										<div className={`
											${amountColors[Math.abs(item.itemId) % amountColors.length]}
											absolute -right-1 -bottom-1 rounded-full border-3 borer-zinc-100 box-content w-1/3 aspect-square text-xs text-zinc-50 font-bold flex justify-center items-center
										`}>
											{item.amount}
										</div>
									</div>
								</div>
								<div className="row-[1/span_2] self-center">
									<h1 className="font-montserrat font-medium text-zinc-700">
										{item.name}
									</h1>
								</div>
								<p className="justify-self-end text-zinc-600 text-sm font-roboto tracking-wide font-semibold flex flex-col row-[1/span_2]">
									{item.offerPrice?
										<>
											<span className="line-through text-xs text-zinc-500">{moneyFormater.format(item.basePrice)}</span>
											{moneyFormater.format(item.offerPrice)}
										</>
										:
										moneyFormater.format(item.basePrice)
									}
								</p>
								<div className="col-[2/3] row-[4/5] justify-center flex gap-4 w-4/5 text-zinc-700 font-montserrat text-2xl">
									<button disabled={loadAmount.includes(item.itemId)} onClick={() => {changeItemAmount(true, item.itemId)}} className="rounded-full hover:bg-gray-300 hover:shadow-[0px_0px_3px_2px_var(--color-gray-300)] transition-all duration-300 ease-in-out aspect-square h-6 flex items-center justify-center">
										<div className="w-2 h-0.5 bg-zinc-500"></div>
									</button>
									<button disabled={loadAmount.includes(item.itemId)} onClick={() => {changeItemAmount(false, item.itemId)}} className="rounded-full hover:bg-gray-300 hover:shadow-[0px_0px_3px_2px_var(--color-gray-300)] transition-all duration-300 ease-in-out aspect-square h-6 flex items-center justify-center">
										<div className="w-3 h-0.5 bg-zinc-500 flex items-center justify-center">
											<div className="w-3 h-0.5 bg-zinc-500 rotate-90"></div>
										</div>
									</button>
								</div>
								<p className="col-[4/span_1] row-[4/5] justify-self-end self-end text-zinc-700 font-bold fony-roboto tracking-wide">
									{ item.offerPrice?
										moneyFormater.format(item.offerPrice * item.amount)
										:
										moneyFormater.format(item.basePrice * item.amount)
									}
								</p>
							</div>
						))
					}
				</div>
			</div>
			<div className="flex flex-col items-center justify-between py-[3cqh] px-[4cqh] bg-cover bg-center rounded-l-3xl shadow-[inset_1.25rem_0px_0.75rem_-1rem_var(--color-zinc-500)] bg-zinc-100">
				<div className="text-zinc-600 font-montserrat my-20 flex flex-col items-center gap-4">
					<h1 className="font-bold text-2xl">Importe Total:</h1>
					<p className="font-semibold text-3xl">{moneyFormater.format(cart? cart.totalPrice : 0)}</p> {/*ACÁ HAY QUE TENER EN CUENTA EL CARRITO DE INVITADOS*/}
					<button onClick={createOrder} disabled={loadOrder} className="relative px-4 py-2 my-4 rounded-3xl text-zinc-50 text-lg font-montserrat font-extrabold bg-amber-400 before:absolute before:inset-0 before:content-[''] before:bg-linear-to-br before:from-yellow-400 before:to-amber-500 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:ease-in-out before:z-10 before:rounded-3xl"><span className="relative z-20">Continuar</span></button>
				</div>
				<div className="relative w-4/5 h-1/2">
					<div className="z-0 absolute bottom-[calc(50%+0.25cqw)] left-1/2 -translate-x-1/3 w-[11cqw] h-[10cqw]">
						<div 
							className={`${styles['boxDrop']} w-[3.75cqw] aspect-square rounded-lg flex justify-center absolute top-0 left-1/2`}
							ref={dropBox}
							onAnimationIteration={() => {
								if (!dropBox.current) return;
								const colors = [
									["var(--color-pink-500)", "var(--color-pink-600)"],
									["var(--color-fuchsia-500)", "var(--color-fuchsia-600)"],
									["var(--color-blue-600)" ,"var(--color-blue-800)"],
									["var(--color-red-500)", "var(--color-red-600)"],
									["var(--color-orange-600)", "var(--color-orange-700)"]
								];

								const index = Math.floor(Math.random() * colors.length);
								const boxColor = colors[index][0];
								const tapeColor = colors[index][1];

								const boxScale = (Math.random() * (1.1 - 0.9) + 0.9).toFixed(2);

								const box = dropBox.current;
								box.style.setProperty('--box-color', boxColor);
								box.style.setProperty('--box-size', boxScale);
								box.style.setProperty('--tape-color', tapeColor);
							}}
						>
							<div className={`${styles['boxTape']} border-x-[0.75cqw] border-b-transparent border-b-[0.75cqw] w-0 h-2/5 rounded-b-sm`}></div>
						</div>
						<div className={`${styles['boxVibration']} w-[3.75cqw] aspect-square bg-lime-500 rounded-lg flex justify-center absolute top-0 left-1/5 -rotate-15`}>
							<div className="border-x-[0.75cqw] border-x-lime-600 border-b-transparent border-b-[0.75cqw] w-0 h-2/5 rounded-b-sm"></div>
						</div>
						<div className={`${styles['boxVibration']} w-[4cqw] aspect-square bg-rose-500 rounded-lg flex justify-center absolute top-1/4 left-1/6 rotate-5`}>
							<div className="border-x-[0.75cqw] border-x-rose-600 border-b-transparent border-b-[0.75cqw] w-0 h-2/5 rounded-b-sm"></div>
						</div>
						<div className={`${styles['boxVibration']} w-[4.25cqw] aspect-square bg-yellow-400 rounded-lg flex justify-center absolute top-1/4 right-3 rotate-50`}>
							<div className="border-x-[1cqw] border-x-yellow-500 border-b-transparent border-b-[1cqw] w-0 h-2/5 rounded-b-sm"></div>
						</div>
						<div className={`${styles['boxVibration']} w-[4cqw] aspect-square bg-violet-500 rounded-lg flex justify-center absolute top-2/7 left-2/5 -rotate-10`}>
							<div className="border-x-[0.75cqw] border-x-violet-600 border-b-transparent border-b-[0.75cqw] w-0 h-2/5 rounded-b-sm"></div>
						</div>
						<div className={`${styles['boxVibration']} w-[4cqw] aspect-square bg-amber-500 rounded-lg flex justify-center absolute bottom-0 left-3 -rotate-10`}>
							<div className="border-x-[0.75cqw] border-x-amber-600 border-b-transparent border-b-[0.75cqw] w-0 h-2/5 rounded-b-sm"></div>
						</div>
						<div className={`${styles['boxVibration']} w-[3.5cqw] aspect-square bg-green-500 rounded-lg flex justify-center absolute bottom-1 right-3 rotate-20`}>
							<div className="border-x-[0.75cqw] border-x-green-600 border-b-transparent border-b-[0.75cqw] w-0 h-1/3 rounded-b-sm"></div>
						</div>
						<div className={`${styles['boxVibration']} w-[4cqw] aspect-square bg-sky-500 rounded-lg flex justify-center absolute bottom-0 left-1/3`}>
							<div className="border-x-[0.75cqw] border-x-sky-600 border-b-transparent border-b-[0.75cqw] w-0 h-1/2 rounded-b-sm"></div>
						</div>
					</div>
					<CartLogo className="z-10 relative w-full h-full text-zinc-300"/>
				</div>
			</div>
		</div>
	)
}

/*
	Hay que generar una pantalla para cuando no hay nada en el carrito.
	Inhabilitar el botón para crear la orden si el usuario no registró su DNI y su dirección en la base de datos (redireccionar al profile).
	Calcular el precio total para el guest cart (en el importe total accedo a eso, pero en el carrito de invitados no existe, solo en la response del carrito de usuario).
	Luego de mostrarle al Feli, quitar las URL fijas a las imagenes.
*/