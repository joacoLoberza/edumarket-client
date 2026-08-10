import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../config/axiosApi";

export default function List () {
	const { id } = useParams();
	const isMovile = useMediaQuery("(max-width: 768px)");
	const [lData, setLData] = useState({});
	const [load, setLoad] = useState(false);
	const [istems, setItems] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoad(true);
				const res = await api.get(`/list/${id}`);

				const body = res.data;
				console.log(body);
				setLData(body.list);
				console.log(`%cAPI - ${res.status}|%c ${body.message}`,"color: rgb(255,255,0)");
				setItems(lData.items.map(item => (
					<>
						{isMovile &&
							<img src={item.image} alt={`Imagen Producto ${item.name}`}/>
						}
						<div>
							<p>{item.category.name}</p>
							<h1>{item.name}</h1>
							<p>{item.description}</p>
							<p>cantidad: {item.amount}</p>
							Precio por unidad:
							<p><span>{item.basePrice}</span>{item.offerPrice && item.offerPrice}</p>
							{!isMobile &&
								<img src={item.image} alt={`Imagen Producto ${item.name}`}/>
							}
						</div>
					</>
				)))
			} catch (error) {

			} finally {
				setLoad(false);
			}
		}

		fetchData(); 
	}, []);


	return (
		<p></p>
	)
}

//Tengo que ver si es el current render (si recarga la página, debo evitar peticiones viejas de axios).
//Cuando haga posible el desplazamiento, en pantallas tácitles con el dedo, y en panallas de más de 780 px incluír botónes.