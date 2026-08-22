//Libraries and frmeworks.
import { useState, useRef } from "react";
import { flushSync } from "react-dom";

//Components.
import Slide from "./Slide.jsx";

//Graphics resources.
import banner from '../../assets/banner.jpg';
import three from '../../assets/3.jpg';
import two from '../../assets/2.jpg';
import sheets from '../../assets/Sheets.png';
import Rocket from '../../assets/icons/home/rocket.svg?react';

//Si es start, tengo que limpiar los setTimeouts de los ciclos anteriores.

export default function Home() {
	const [displaceImage, setDisplaceImage] = useState(true);
	const timestampTrans = useRef({starter: null, current: null});
	const scheduledAnimationId = useRef([]);
	const displaceBackwards = useRef(false);

	const titleImages = useRef([
		<Slide 
			backgroundPath={banner}
			title={"Tu lista de útilies, resuelta en un solo paso."}
			subtitle="Armamos y enviamos el kit completo de útiles escolares de tu colegio a precios accesibles, sin que tengas que recorrer ni una sola librería."
		/>,
		<Slide
			backgroundPath={three}
			title="Ahorrá horas de compras."
			subtitle="Nosotros recorremos las librerías por vos y armamos exactamente lo que pide cada colegio, a precios accesibles."
		/>,
		<Slide
			backgroundPath={two}
			title="100% e coincidencia con la lista oficial."
			subtitle="Cotejamos cada producto con la lista de tu colegio, la lista se puede modificar a tu gusto para que no falte ni sobre nada."
		/>,
		<Slide
			backgroundPath={sheets}
			title="Recibilo en la puerta de tu casa."
			subtitle="Vos elegís el colegio y el grado, nosotros nos encargamos del resto."
		/>
	]);

	const displaceTitle = (backwards = false) => {
		
		const scheduledDisplace = () => {
			if (backwards) {
				titleImages.current.unshift(titleImages.current.pop());
				displaceBackwards.current = true;
			} else {
				titleImages.current.push(titleImages.current.shift());
				displaceBackwards.current = false;
			}

			flushSync(() => {
				setDisplaceImage(false);
			});

			//Schedule transition for next render.
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					setDisplaceImage(true);
				})
			})
		}

		//If elipsed time from last slide transition is major than transition diration, save time as the starter timestamp and start. Else, transition didn't finshed and requires to be scheduled until it ends.
		const elipsedTime = Date.now() - timestampTrans.current.current;
		if (elipsedTime > 1000) {
			timestampTrans.current.starter = Date.now();
			timestampTrans.current.current = timestampTrans.current.starter;
			scheduledAnimationId.current.forEach((id)  => {
				clearTimeout(id);
			});
			scheduledAnimationId.current = [];
			scheduledDisplace();
		} else {
			const id = setTimeout(scheduledDisplace, (1000 - elipsedTime) + (timestampTrans.current.current - timestampTrans.current.starter));
			scheduledAnimationId.current.push(id);
			timestampTrans.current.current = Date.now();
		}
	} 

	return (
		<>
			<div className="relative h-[55vh] w-screen p-6 my-15 overflow-hidden z-10">
				<div className={`flex flex-row no-wrap absolute top-0 left-0 z-0 h-full ${displaceImage? "-translate-x-[100vw] transition-transform duration-1000 ease" : (displaceBackwards.current && "-translate-x-[200vw]")}`}>
					{titleImages.current[0]}
					{titleImages.current[1]} 
					{titleImages.current[2]}
				</div>
				<div className="relative w-full h-full flex items-center justify-between z-10">
					<button onClick={() => {displaceTitle(true)}} className="cursor-pointer text-5xl font-montserrat text-zinc-600/75 bg-zinc-300/40 rounded-xl px-2 py-1 m-5 hover:bg-zinc-300/30 hover:shadow-[0px_0px_10px_5px_rgba(212,212,216,0.3)] transition-all duration-250 ease-out"><span className="inline-block -translate-y-1/10 -translate-x-[1px]">&lsaquo;</span></button>
					<button onClick={() => {displaceTitle(false)}} className="cursor-pointer text-5xl font-montserrat text-zinc-600/75 bg-zinc-300/40 rounded-xl px-2 py-1 m-5 hover:bg-zinc-300/30 hover:shadow-[0px_0px_10px_5px_rgba(212,212,216,0.3)] transition-all duration-250 ease-out"><span className="inline-block -translate-y-1/10 translate-x-[1px]">&rsaquo;</span></button>
				</div>
			</div>
			<section className="relative px-[10%] my-7 flex flex-col gap-5 text-zinc-800 @container group">
				{/*<div className="absolute top-0 left-0 inset-0 z-0 h-[50cqh]">
					<div className="absolute top-0 left-0 -translate-y-1/2 -translate-x-[200%] group-hover:translate-x-1/4 group-hover:translate-y-6/5 transition-transform duration-500 ease-in-out w-75 h-45 bg-gradient-to-bl from-orange-500 to-amber-400 rounded-[78%_46%_98%_34%] filter blur-2xl mix-blend-multiply opacity-95"></div>
					<div className="absolute top-0 left-0 opacity-0 group-hover:opacity-60 group-hover:translate-x-4/3 group-hover:translate-y-1/4 transition-all duration-500 ease-in-out w-30 h-20 bg-gradient-to-bl from-sky-500 to-blue-400 rounded-[78%_46%_98%_84%] filter blur-2xl mix-blend-multiply"></div>
				</div>*/}
				<h2 className="z-10 text-3xl font-montserrat font-semibold my-7 relative bg-clip-text bg-linear-to-br from-zinc-800 to-zinc-600 group-hover:text-transparent transition-all duration-500 ease-in-out">
					¿Quienes somos?
					<Rocket className="w-14 h-14 absolute -top-5 -left-8 -rotate-20 group-hover:text-zinc-700 group-hover:-top-7 group-hover:-left-5 group-hover:-rotate-0 transition-all duration-500 ease-in-out"/>
				</h2>
				<p className="z-10 text-xl whitespace-pre-wrap text-justify font-montserrat traking-wide text-zinc-700 leading-relaxed">    Somos un equipo de emprendedores con la voluntad de simplificar una de las tareas más pesadas del regreso a clases: armar la lista de útiles. Trabajamos directamente con los colegios para conocer sus listas oficiales y con proveedores de confianza para conseguir productos de buena calidad a precios accesibles. Cada pedido lo armamos y revisamos a mano, ítem por ítem, antes de enviarlo. Nuestro objetivo es simple: que las familias recuperen su tiempo y accedan a precios accesibles, para que los chicos empiecen el año con todo lo que necesitan, sin errores ni faltantes.</p>
			</section>
		</>
	)
}