import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import useAutoPag from "../../hooks/useAutoPag";
import Filters from "../../components/Filters";

//Remember to manage load state them.
export default function Schools() {
	const pcNavOutlet = document.getElementById('pcNavOutlet');
	const orderInput = useRef(null);
	const searchInput = useRef(null);
	const [search, setSearch] = useState('');
	const [order, setOrder] = useState('ASC');
	const [limit, setLimit] = useState(10); //Make it change depending the viewport height.
	const navigate = useNavigate();

	const [data, load, pageEnding] = useAutoPag('/school', 'schools', {
		order: order,
		search: search,
		limit: limit,
	}, () => {
		//Here make error handling type and origin.
	});

	useEffect(() => {
		const changeOrder = () => {setOrder(orderInput.current.checked? 'DESC' : 'ASC')};
		const typeSearch = () => {setSearch(searchInput.current.value)};

		if (orderInput.current)
			orderInput.current.addEventListener('change', changeOrder);

		if (searchInput.current)
			searchInput.current.addEventListener('input', typeSearch);

		return () => {
			if (orderInput.current)
				orderInput.current.removeEventListener('change', changeOrder);
			
			if (searchInput.current)
				searchInput.current.removeEventListener('input', typeSearch);
		}
	},[]);

	return (
		<>
			<div>
				{data.map(school => (
					<div key={school.id} onClick={() => navigate(`/schools/lists/${school.id}`)}>
						<img alt={`Logotipo-${school.name}`} src={school.image}/>
						<h2>{school.name}</h2>
						<p>{school.cue}</p>
					</div>
				))}
				<div ref={pageEnding}>Potasio</div>
			</div>
			{ pcNavOutlet && createPortal( <Filters order={orderInput} search={searchInput}/>, pcNavOutlet ) }
		</>
	)
}