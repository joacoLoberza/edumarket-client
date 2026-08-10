export default function Filters({ search, order }) {
	return (
		<div>
			<div><input placeholder="Buscar" ref={search}/></div> {/*Adentro de este div en algún momento debería meter una lupa antes del input.*/}
			<input type="checkbox" ref={order}/>
		</div>
	)
}