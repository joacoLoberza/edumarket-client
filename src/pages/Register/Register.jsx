import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvent } from "react-leaflet";
import axios from "axios";

function Register() {
	const [postalCode, setPostalCode] = useState('');
	const [number, setNumber] = useState('');
	const [street, setStreet] = useState('');
	const [suburb, setSuburb] = useState(''); //District
	const [county, setCounty] = useState(''); //Department
	const [state, setState] = useState(''); //Province
	const [country, setCountry] = useState('');

	const [formStages, setFromStages] = useState(
		[
			<>
				<h2>Para empezar, necesitamos tu correo y que definás una con</h2>
				<input type="e-mail"/>
				<input type="password"/>
				<input type="password"/>
			</>,
			<>
				<h2>¿Cómo querés que te llamemos?</h2>
				<input type="text"/>
			</>,
			<>
				<h2>¿Cuál es tu DNI?</h2>
				<input type="number"/>
			</>,
			<>
				<h2>Indique su dirección en el mapa:</h2>
				<MapContainer>
					<TileLayer/>
					<Marker/>
					<MapEventListener />
				</MapContainer>
			</>,
			<>
				<h2>Ahora, elegí tu foto de perfil:</h2>
				
			</>
		]
	)

	async function fetchLocation (lat, lon) {
		await axios.get("https://nominatim.openstreetmap.org/reverse", {
			params: {
				format: 'json',
				lat,
				lon,
				'accept-language': 'es',
			}
		});
	}

	return (
		<div className="flex">
			<form>
				{formStage}
			</form>
			<div>

			</div>
		</div>
	)
}

function MapEventListener({ fetchLocation }) {
	useMapEvent({
		click: e => {
			fetchLocation(e.latlng.lat, e.latlng.lng);
		}
	})
}