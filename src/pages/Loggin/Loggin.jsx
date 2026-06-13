export default function Loggin () {
	return (
		<div className="
			h-screen
			flex
		">
			<div className="
				flex-1
			">

			</div>
			<form className="
				bg-gray-100
				p-20
				flex
				flex-col
				flex-1
				justify-center
				items-center
				overflow-hidden
			">
				<p className="
					font-quicksand
					font-semibold
					text-5xl
					
				">Bienvenido de nuevo.</p>
				<input type="text" name="identifier" placeholder="Usuario / e-mail"/>
				<input type="password" name="password" placeholder="Contraseña"/>
			</form>
		</div>
	)
}