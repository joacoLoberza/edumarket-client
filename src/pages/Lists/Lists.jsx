import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { createPortal } from 'react-dom';
import useAutoPag from "../../hooks/useAutoPag.jsx";
import Filters from "../../components/Filters";

export default function Lists() {
	const pcNavOutlet = document.getElementById('pcNavOutlet')
	const orderInput = useRef(null);
	const searchInput = useRef(null);
	const [order, setOrder] = useState('ASC');
	const [search, setSearch] = useState('');
	const [limit, setLimit] = useState(10);
	const { id } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		const shTarg = searchInput.current;
		const orTarg = orderInput.current;
		const typeSearch = () => { setSearch(shTarg.value) };
		const changeOrder = () => { setOrder(orTarg.checked? 'DESC':'ASC') };

		if (shTarg)
			shTarg.addEventListener('input', typeSearch);
		if (orTarg)
			orTarg.addEventListener('change', changeOrder);

		return () => {
			if (shTarg)
				shTarg.removeEventListener('input', typeSearch);
			if (orTarg)
				orTarg.removeEventListener('change', changeOrder);
		}
	},[]);

	const [data, load, pageEnding] = useAutoPag('/list', 'lists', {
		order,
		search,
		limit,
		isAssembled: false,
		schoolId: id,
	})

	return (
		<>
			<div>
				{data.map(list => {
					let basePrice = 0;
					let offerPrice = 0;
					const prodList = list.items.map(item => {
						offerPrice += item.offerPrice;
						basePrice += item.basePrice;
						return (
							<div>
								<img src={item.image} alt={`Producto ${item.name}`}/>
								<p>{item.name}</p>
								<div>{item.amount}</div> {/*Tengo que acordarme que esto va en una esquinita con postion absolute.*/}
							</div>
						)
					});
					return (
						<div key={list.id} onClick={() => {navigate(`/list/${list.id}`)}}>
							<h2>{`${list.course.name[1]}°${list.course.name[2]}`}<span>{list.course.name[0]}</span></h2>
							<p>{basePrice}</p>{offerPrice && <p>{offerPrice}</p>}
							<div>
								{prodList}
							</div>
							<button>ADD TO CART</button>
							<button>ADD MODIFIED TO CART</button> {/* This will copy the school list register in a user's list with modified data. */}
						</div>
					)
				})}
			</div>
			<div ref={pageEnding}>
				Observer
			</div>
			{pcNavOutlet && createPortal( <Filters/>, pcNavOutlet )}
		</>
	)
}