//Packages
import { useOutletContext, useParams } from "react-router";

//Files
import api from '../../config/axiosApi.js';

//Hooks
import useAutoPag from "../../hooks/useAutoPag";

//Components
import Filters from "../../components/Filters";

//Images & Graphic Resources
import Cart from '../../assets/icons/general/cart.svg?react';
import EditCart from '../../assets/icons/schoolLists/editCart.svg?react';

export default function SchoolLists () {
	const { order, search, limit } = useOutletContext();
	const { id } = useParams();
	const amountColors = ["bg-rose-600", "bg-amber-500", "bg-lime-500", "bg-purple-500", "bg-sky-500", "bg-blue-700", "bg-emerald-600", "bg-orange-600"];
	const moneyFormater = new Intl.NumberFormat('es-AR', {
		style: 'currency',
		currency: 'ARS',
	});

	const [data, load, pageEnding] = useAutoPag('/list', 'lists', {
		order,
		search,
		limit,
		isAssembled: false,
		schoolId: id,
	}, () => {
		//Error handling.
	});

	return (
		<>
			<div className="flex gap-4 flex-wrap @container justify-center">
				{
					data.map(list => {
						let basePrice = 0;
						let offerPrice = 0;
						const prodList = list.items.map(item => {
							offerPrice += item.offerPrice;
							basePrice += item.basePrice;
							return (
								<div key={item.id} className="flex flex-col gap-3 items-start h-full w-[11cqh] shrink-0 grow-0 px-2" title={item.name}>
									<div className="relative w-full aspect-square rounded-md bg-cover" style={{'backgroundImage':'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEjrsGjRGOo8iMjLVF3rY6B6WBWJbtBGOx3KyeHybHNA&s=10)'}}>
										<div className={`flex justify-center items-center pb-[1px] absolute right-0 bottom-0 translate-1/2 h-4 aspect-square leading-2 text-xs text-white font-quicksand font-semibold rounded-full ${amountColors[Math.abs(item.id) % amountColors.length]}`}>{item.amount}</div>
									</div>
									<p className="font-montserrat text-xs w-full overflow-hidden line-clamp-2 break-words leading-3 text-zinc-700 select-none">{item.name}</p>
								</div>
							)
						});
						return (
							<div key={list.id} className="flex justify-between flex-col gap-1 basis-[calc(50cqw-16px)] h-[30cqh] bg-zinc-100 rounded-2xl px-4 pt-5 pb-4">
								<div className="flex justify-between">
									<h2 className="flex items-start gap-2 font-roboto font-semibold leading-3 text-[#868695]">{`${list.course.name[1]}°${list.course.name[2]}`} <span className="leading-3 font-black tracking-wide text-sm text-zinc-400">{list.course.name[0].toLowerCase()}</span></h2>
									<p className="flex flex-col items-start justify-start text-zinc-600 font-semibold font-roboto">
										{offerPrice?
											<>
												<span className="line-through text-xs text-zinc-500">{moneyFormater.format(basePrice)}</span>
												{moneyFormater.format(offerPrice)}
											</>
											:
											moneyFormater.format(basePrice)
										}
									</p>
								</div>
								<div className="flex relative justify-between items-center h-2/3 overflow-hidden @container">
									<div className="flex items-start justify-start py-2 basis-[100cqw] overflow-x-scroll bg-zinc-50 rounded-xl @container">
										{prodList}
									</div>
									<div className="w-0 h-full">
										<div className="w-18 h-full -translate-x-full bg-linear-to-l from-zinc-100 to-transparent pointer-events-none"></div>
									</div>
									<div className="flex flex-col items-center justify-around h-full">
										<button 
											onClick={async () => {
												try {
													const res = await api.post('/cart', {
														listId: list.id,
														amount: 1,
													});
													const apiData = res.data;

													console.log(`%cAPI - ${res.status}|%c ${apiData.message}`, "color: rgb(255,255,0")
												} catch (error) {
													//Error handling.
												}
											}}
											title="Añadir al carrito"
											className="flex justify-center items-center bg-amber-400 hover:bg-amber-300 transition-colors duration-200 ease rounded-md p-1.5 w-9 aspect-square">
											<Cart className='w-19/20 h-19/20 text-white'/>
										</button>
										<button title="Añadir al carrito con modificaciones" className="flex justify-center items-center bg-amber-400 hover:bg-amber-300 transition-colors duration-200 rounded-md p-1.5 w-9 aspect-square">
											<EditCart className="w-full h-full text-white"/>
										</button> {/*ADD MODIFIED TO CART -> This will copy the school list register in a user's list with modified data. */}
									</div>
								</div>
							</div>
						)
					})
				}
			</div>
			<div className="w-full h-1" ref={pageEnding}></div>
		</>
	)
}

//El botón de añadir al carrito no anda
//El botón de añadir al carrito la lista personalizada no está implementado.