export default function Slide ({backgroundPath = "", title = "", subtitle = ""}) {
	return (
		<div 
			style={{ backgroundImage: `url('${backgroundPath}')`}}
			className={`relative w-[calc(100%-48px)] h-[calc(100%-24px)] m-6 object-cover shrink-0 bg-cover bg-no-repeat flex flex-col px-[20%] items-center justify-center text-center rounded-2xl`}
		>
			<h1 className="text-5xl font-bold font-quicksand text-white/90">
				{title}
				<p className="font-montserrat text-white text-base font-normal absolute top-[calc(50%+72px)] left-1/2 -translate-x-1/2">{subtitle}</p>
			</h1>
		</div>
	)
}