//Packages
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

//Components
import SchoolsStages from "../../components/SchoolsStages";
import Filters from "../../components/Filters";
import LoadSpinner from "../../components/LoadSpinner";
import EndingPet from "./EndingPet.jsx";

//Remember to manage load state them.
export default function Schools() {
	const pcNavOutlet = document.getElementById('pcNavOutlet');

	const searchSt = useState('');
	const [search] = searchSt;
	const orderSt = useState('ASC');
	const [order] = orderSt;
	const [limit, setLimit] = useState(13); //Make it change depending the viewport height.

  const [curntStage, setCurntStage] = useState(0);

  const location = useLocation();
  
  const [sidebarSeted, setSidebarSeted] = useState(false);
  if (location.state?.setSidebarStage >= 0 && !sidebarSeted) {
    setCurntStage(location.state?.setSidebarStage);
    setSidebarSeted(true);
  }

  useEffect(() => {
    const resetSidebarAnimation = () => {
      const path = window.location.pathname;
      
      if (path === '/schools')
        setCurntStage(0);

      if (path.split('/').filter(path => path !== "" && !isNaN(path))[0])
        setCurntStage(1);
    };
    window.addEventListener('popstate',resetSidebarAnimation);
    
    return () => window.removeEventListener('popstate',resetSidebarAnimation)
  }, []);

	return (
		<>
			<div className="w-screen h-screen flex">
        <div className="flex flex-col h-full w-5/7 overflow-hidden">
          <div className="flex flex-col justify-between mt-28 overflow-x-hidden overflow-y-scroll rounded-2xl mx-5 h-[calc(100%-112px)] shrink-0">
            <Outlet context={{
              order,
              limit,
              search,
              setCurntStage
            }}/>
            <EndingPet/>
          </div>
          <div className={`h-screen w-full bg-zinc-300 shrink-0 flex items-center justify-center transition-translate-y duration-1000 ease-out`}> {/*${loadNext && "-translate-y-full"}*/}
            <div className="w-[50vw] flex items-center justify-center">
              <LoadSpinner/>
            </div>
          </div>
        </div>
        <SchoolsStages curntStage={curntStage}/>
			</div>
			{ pcNavOutlet && createPortal( <Filters orderSt={orderSt} searchSt={searchSt}/>, pcNavOutlet ) }
		</>
	)
}

/*
Por algún motivo al navegar para atras (<-) tengo un error de que seatchSt es undefined.
Tengo que hacer la animación de salida para el panel del costado.
Tengo que forzar un render usando el hook para las dimensiones de la pantalla que hice. Cuando pasa al modo mobile no se renderizan los filtros (hace falta nuevo render).
*/