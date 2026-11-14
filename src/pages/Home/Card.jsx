export default function Card({children, title, body}) {
	return(
		<div className={`
			hover:shadow-[-5px_5px_10px_0px_rgba(100,100,120,0.35)]
			transition-shadow duration-500 ease-in-out
			rounded-2xl
			flex flex-col gap-5 p-5
			bg-zinc-100
		`}>
			<h2 className={`font-quicksand font-bold text-zinc-700 text-2xl flex gap-4 items-center`}>
				{children}
				{title}
			</h2>
			<p className="font-montserrat text-zinc-600 text-lg">{body}</p>
		</div>
	)
}