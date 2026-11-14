//Packages
import { useState, useEffect } from "react";
import { useParams } from "react-router";

//Components
import ProductsNavbar from "../../components/ProductsNavbar";

//Files
import api from '../../config/axiosApi.js';

//Images & Graphic Resources
import image from '../../assets/purple_test-removebg-preview.png';

export default function Preview ({ previewMode = 'product' }) {
	const [elementData, setElementData] = useState({})
	const [loading, setLoading] = useState(false);

	const [rotatePrice, setRotatePrice] = useState(false);
	const [invertPrices, setInvertPrices] = useState(true);

	const params = useParams();

	/*
		Fetch product/list data.
	*/
	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);

				const res = await api.get(`/list/${params.id}`);
				const apiData = res.data;
				console.log(`%cAPI - ${res.status}|%c ${apiData.message}`, "color: rgb(255,255,0");
				setElementData(apiData);
			} catch (error) {
					if (error.response) {
						const res = error.response;
						const resData = res.data; 
						console.error(`%cAPI - ${res.status}|%c ${resData.message}`, "color: rgb(255, 60, 0)");

						switch (resData.origin) {
							case 'sequelize':
								switch (resData.status) {
									case 'Overloaded':
										//Acá debería setear un estado o algo y poner una pantallita luego del spinner o una notificación de popup de que la DB básicamente explotó.
										break;
								}
								break;
						}
					}
			} finally {
				setLoading(false);
			}
		}

		fetchData()
	}, []);

	/*
		Swip between product price and shipping price.
	*/
	useEffect(() => {
		const intId = setInterval(async () => {
			setRotatePrice(true);
			
			await new Promise(resolve => setTimeout(resolve,750));
			setRotatePrice(false);
			setInvertPrices(prev => !prev);
		},2500);

		return () => clearInterval(intId);
	},[]);

	return (
		<div className="flex bg-[radial-gradient(circle_at_center,var(--color-purple-600),var(--color-purple-900))]">
			<div className="grid grid-cols-[2fr_1fr] grid-rows-[4fr_3fr] justify-items-center bg-black/10 h-screen w-1/2">
				<div className="flex flex-col justify-start gap-3 py-[10%] mx-[15%]">
					<div className="flex gap-2 items-center">
						<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXcxMzQB4o9-CaOETQLhhB3iq29xVbkOlLbBG3bOOFpShX1yT6FBz4HfJS&s=10" className="w-4 aspect-square bg-white rounded-full border-1 border-zinc-100"/>
						<p className="font-quicksand font-extrabold text-lg text-white opacity-75 leading-[.8]">colores</p>
					</div>
					<h1 className="font-montserrat font-extrabold text-white text-3xl leading-[.87] text-shadow-sm text-shadow-white opacity-90 select-none">FABER CASTELLE PERREO INTENSO EDITION</h1>

					{/*Este tecxto debe tener un límite de alto o filas. Luego de eso, debo pasar los párrafos al costado e ir scrolleandolos con flechitas o cliks.*/}
					<p className="font-montserrat text-zinc-200 text-lg mt-5">Comprá estos colores, la verdad son buenardos, no sabés lo que te perdés. Los vas a amar.</p>
					<p className="font-quicksand text-white mb-5 opacity-75 leading-none font-bold text-lg">stock: <span className="font-montserrat font-semibold text-base">567</span></p>
					<ProductsNavbar/>
				</div>
				<div className="col-1 row-2">
					{/* ACA IRÍA EL COMPONENTE DE SPINNER PARA LAS LISTAS QUE TENGO QUE HACER EN OTRO ARCHIVO :) */}
				</div>
			</div>
			<div className="relative flex h-screen w-1/2">
				<h1 aria-hidden={true} className="absolute top-0 left-0 -translate-y-7 font-montserrat font-black text-zinc-200 text-7xl opacity-40 select-none">FABER CASTELLE MAGIC PERREO EDITION</h1> {/*Acá el translate tengo que hacerlo en base al tamaño de la letra y el width tengo que definirlo en base a la cantidad de líneas (si el texto me queda en una sola línea con el 110%, entonces, reudcimos a 50% ponele, si me queda de dos líneas lo dejamos)*/}
				<div className="flex absolute bottom-1/8 right-1/9 w-33 h-38 overflow-hidden text-end">
					{
						invertPrices ?
							<>
								<BaseCost rotatePrice={rotatePrice} invertPrices={invertPrices}/>
								<ShippingCosts rotatePrice={rotatePrice} invertPrices={invertPrices}/>
							</>
							:
							<>
								<ShippingCosts rotatePrice={rotatePrice} invertPrices={invertPrices}/>
								<BaseCost rotatePrice={rotatePrice} invertPrices={invertPrices}/>
							</>
					}
				</div>
			</div>
			<img src={image} className="absolute top-2/5 left-1/2 w-80 h-100 -translate-1/2 rotate-10"/>
		</div>
	)
}

function BaseCost ({rotatePrice, invertPrices}) {
	return (
		<div className={`flex flex-col gap-3 basis-full shrink-0 grow-0 transition-all duration-750 ease-in-out ${rotatePrice && `-translate-x-full ${invertPrices && 'opacity-0'}`} font-montserrat text-white/65`}>
			<p className="font-bold text-xl leading-none">precio sin envío incluido</p>
			<div className="font-extrabold">
				<p className="text-2xl text-zinc-200 leading-tight line-through decoration-2 opacity-65">$6000</p>
				<p className="text-3xl text-white/85 leading-tight">$5000</p>
			</div>
		</div>
	)
}

function ShippingCosts ({rotatePrice, invertPrices}) {
	return (
		<button className={`basis-full shrink-0 grow-0 transition-all duration-750 ease-in-out ${rotatePrice && `-translate-x-full ${!invertPrices && 'opacity-0'}`} font-montserrat text-white/65 text-end cursor-pointer group`}>
			<p className="font-bold text-xl leading-none">consultar lista de precios de envío</p>
			<p className="font-black text-2xl group-hover:text-white/95 transition-colors duration-250 ease-in-out">&gt;</p>
		</button>
	)
}
//ESto también tiene que tener botones para el carrito
//Acordate de poner puntitos abajo para mostrar por donde va. Lo mismo en el home.