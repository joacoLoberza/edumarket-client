import styles from './LoadSpinner.module.css';

export default function LoadSpinner (loading) {
	return (
		<div className="relative w-1/10 aspect-square @container/normal">
			<div className={`${loading && styles['elSequare']} absolute bg-[conic-gradient(from_0deg,var(--brand-green)_0deg_270deg,transparent_270deg_360deg)] w-3/10 aspect-square top-0 left-0 origin-[170%_170%]`}></div>
			<div className={`${loading && styles['pacman']} absolute bg-[conic-gradient(from_315deg,var(--brand-yellow)_0deg_260deg,transparent_260deg_360deg)] rounded-full aspect-square w-3/10 top-0 right-0`}></div>
			<div className={`${loading && styles['triangParent']} absolute bottom-0 right-0 origin-[-70%_-70%]`}><div className={`${loading && styles['triangle']} border-b-[30cqw] border-b-[var(--brand-cyan)] border-x-[15cqw] border-x-transparent`}></div></div>
			<div className={`${loading && styles['arch']} absolute w-4/10 aspect-square border-[12cqw] border-[var(--color-rose-600)] border-r-transparent border-t-transparent rounded-full bottom-0 left-0`}></div> 
		</div>
	)
}