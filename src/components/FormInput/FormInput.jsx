export default function FormInput({classes, ...props}) {
	return (
		<input
			className={`bg-slate-200 rounded-full 2xl py-1 px-4 placeholder-slate-400 shadow-[4px_5px_10px_-5px_rgba(120,120,120,0.3)_inset] focus:outline-none text-zinc-500 ${classes}`}
			{...props}
		/>
	)
}