//Packages
import { useOutletContext, useNavigate } from "react-router";

//Hooks
import useAutoPag from "../../hooks/useAutoPag";

export default function SchoolsList() {
	const { order, search, limit, setCurntStage } = useOutletContext();
	const navigate = useNavigate();

	const [data, load, pageEnding] = useAutoPag('/school', 'schools', {
		order: order,
		search: search,
		limit: limit,
	}, () => {
		//Here make error handling type and origin.
	});

	return (
		<>
			<div className="flex gap-4 flex-wrap @container justify-center">
				{
					data.map(school => (
						<div
							key={school.id}
							onClick={() => {
								setTimeout(() => navigate(`lists/${school.id}`), 1000);
								setCurntStage(1);
							}}
							className="grid grid-cols-[1fr_2fr] grid-rows-2 items-center basis-[calc((100cqw-17px*2)/3)] h-[16cqh] py-2 pr-4 bg-zinc-100 rounded-2xl"
						>
							<div className="row-[1/3] justify-center w-full h-full flex p-2 items-center">
								<img alt={`Logotipo-${school.name}`} src={/*school.image*/ "https://scorefy.app/_next/image?url=https%3A%2F%2Fcdn.scorefy.app%2Fteams%2Fshield%2Ftfpesghedynqpefn54314mqvs.png&w=256&q=75"} className="aspect-square "/>
							</div>
							<h2 title={school.name} className="w-full truncate font-montserrat font-medium text-zinc-500">{school.name}</h2>
							<p className="self-start font-montserrat text-[rgb(186,186,193)] text-xs font-bold"><span className="text-[0.7rem]">CUE</span> | {school.cue}</p>
						</div>
					))
				}
			</div>
			<div className="w-full h-1" ref={pageEnding}></div>
		</>
	)
}