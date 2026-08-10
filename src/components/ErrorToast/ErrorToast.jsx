import styles from './ErrorToast.module.css';

export default function ErrorToast ({ message, onClick }) {
	return (
		<div 
			onClick={onClick}
			className={`${styles['toast-entrace']} z-10 shadow-[-8px_8px_12px_var(--color-gray-400)] max-w-1/3 flex absolute bottom-5 right-5 cursor-pointer bg-slate-200 rounded-sm`}
		>
			<div className="flex flex-col gap-[10%] items-center justify-center p-1 bg-slate-50 w-5 rounded-l-sm">
				<div className="w-2 h-2 rounded-full bg-[var(--brand-green)]"></div>
				<div className="w-2 h-2 rounded-full bg-[var(--brand-cyan)]"></div>
				<div className="w-2 h-2 rounded-full bg-[var(--brand-yellow)]"></div>
			</div>
			<p className="m-3 text-xs text-red-400 font-montserrat font-medium">
				{message}
			</p>
		</div>
	)
}