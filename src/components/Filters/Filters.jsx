//Packages
import { useRef } from 'react';

//Images & Graphic Resources
import MagniGlass from '../../assets/icons/general/magnifyingGlass.svg?react';
import Order from '../../assets/icons/general/order.svg?react';

export default function Filters({ searchSt, orderSt }) {
	const [search, setSearch] = searchSt;
	const [order, setOrder] = orderSt;
	const searchInput = useRef(null);
	return (
		<div className="flex items-center gap-3 h-full">
			<div
				className='flex bg-zinc-200 rounded-full h-4/5 px-4 items-center cursor-text'
				onClick={() => searchInput?.current?.focus()}
			>
				<input
					ref={searchInput}
					placeholder="Buscar"
					value={search}
					onInput={e => setSearch(e.target.value)}
					className="focus:outline-none w-[10vw] focus:w-[20vw] transition-width duration-500 ease-in-out placeholder:font-semibold placeholder:font-roboto tracking-wide placeholder:text-zinc-400 text-zinc-600 text-[1.1rem] font-roboto"
				/>
				<MagniGlass className="w-4 h-4 text-zinc-500"/>
			</div>
			<div 
				title= {`Orden Descentente:\n${order === "DESC"? "Habilitado":"Deshabilitado"}`}
				className='relative w-5 h-5'
			>
				<input
					type="checkbox"
					checked={order === "DESC"? true : false}
					onChange={e => setOrder(e.target.checked? "DESC":"ASC")}
					className='relative z-20 w-full h-full opacity-0'
				/>
				<Order className={`absolute z-10 w-full h-full top-1/2 left-1/2 -translate-1/2 ${order === "DESC"? "text-slate-500": "text-zinc-400"}`}/>
			</div>
		</div>
	)
}