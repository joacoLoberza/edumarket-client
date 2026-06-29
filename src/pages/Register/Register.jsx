import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
	const formStages = [
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
			Dios sabrá como se hace esto D':
		</>,
		<>
			<h2>Ahora, elegí tu foto de perfil:</h2>
			Dios sabrá también como es esto. Debería meter una opción para importar el archivo y recortarlo.
		</>
	]
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