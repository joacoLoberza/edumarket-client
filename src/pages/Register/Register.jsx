//Packages
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import zxcvbn from "zxcvbn";
import axios from "axios";

//Files
import api from "../../config/axiosApi";

//Components
import FormInput from "../../components/FormInput/FormInput";
import DinamTitle from "../../components/DinamTitle/DinamTitle";
import ErrorToast from "../../components/ErrorToast/ErrorToast";

//Images && Graphic Resources
import CrayonArrow from '../../assets/icons/general/crayonArrow.svg?react';
import MxAndPssw from '../../assets/icons/register/mailAndPasswd.svg?react';
import NameTxt from '../../assets/icons/register/name.svg?react';
import Dni from '../../assets/icons/register/dni.svg?react';
import House from '../../assets/icons/register/house.svg?react';
import Profile from '../../assets/icons/register/profile.svg?react';
import OpenEye from '../../assets/icons/general/openEye.svg?react';
import CrossedOutEye from '../../assets/icons/general/crossedOutEye.svg?react';

function Register() {
    const navigate = useNavigate();

    const regForm = useRef(null);

    const [title, setTitle] = useState('');
    const [next, setNext] = useState(true);
    const [data] = useState(new FormData());
    const [currentStg, setCurrentStg] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [message, setMessage] = useState('');
    const [blob, setBlob] = useState(null);
    const [stages] = useState([
        <StageOne/>,
        <StageTwo/>,
        <StageThree/>,
        <StageFour/>,
        <StageFive setBlob={setBlob}/>,
    ]);

    const isLastStage = currentStg === stages.length - 1;
    const contType = isLastStage ? 'submit' : 'button'; // Type of continue button.

    const [phrases] = useState(() => {
        const phrases = ['Conseguí todo lo que tus hijos necesitan.', 'Ahorrá tu tiempo, nosotros nos encargamos por vos.', 'Buscalo en Edumarket.', 'Armamos todo para que tu hijo empiece las clases.'];
        for (let i = phrases.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [phrases[i], phrases[j]] = [phrases[j], phrases[i]];
        }
        return phrases;
    });

    const handleContinue = (e) => {
        const stageData = new FormData(regForm.current);

        switch (currentStg) {
            case 0:
                if (stageData.get('confPass') !== stageData.get('password')) {
                    

                    return;
                }
                stageData.delete('confPass');
                break;
            case 3:
                let home = '';
                ['street', 'number', 'suburb', 'county', 'state', 'country'].forEach(val => {
                    switch (val) {
                        case 'street':
                            home += `${stageData.get(val)} `;
                            break;
                        case 'country':
                            home += stageData.get(val);
                            break;
                        default:
                            home += `${stageData.get(val)}, `
                    }
                    stageData.delete(val);
                });
                stageData.append('address', home);
                break;

        } 

        for (const [key, value] of stageData) {
            if (typeof value === 'string' && !value.trim())
                return;
            data.set(key, value);
        };

        setNext(prev => !prev);
        setCurrentStg((prev) => prev + 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!blob) return;
        data.set('profileImg', blob, 'profile.jpg');
        try {
            setLoading(true);

            const response = await api.post('/user/register', data, { headers: {'Content-Type': 'multipart/form-data'}});

            console.log(`%cAPI - ${response.status}|%c ${response.data.message}`, "color: rgb(255,255,0");

            //Tengo que hacer el mensaje de que se envió un mail de verificacion.
            navigate(location.state?.from || -1);
        } catch(error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-row h-screen">
            <form className="relative grow shrink-0 min-w-1/2 flex justify-center flex-col @container" ref={regForm} onSubmit={handleSubmit}>
                <button type="button" onClick={() => {navigate(-1)}} className="fancy-button absolute right-10 top-10">Salir</button>
                <div className="px-[20cqw] flex flex-col gap-6 relative">
                    <div className="relative flex items-center">
                        <DinamTitle onTitleChange={setTitle} next={next} interval={100} titles={phrases} classes="absolute font-quicksand font-bold text-4xl text-transparent bg-linear-to-br from-sky-500 from-[5%] via-violet-500 via-[40%] to-rose-500 bg-clip-text"/>
                        <p className="font-bold text-4xl font-quicksand w-[60cqw] opacity-0 pointer-events-none select-none">{title}</p>
                    </div>
                    {stages[currentStg]}
                    <div className={`flex flex-row ${currentStg !== 0 ?"justify-between" : "justify-end"}`}>
                        <button type='button' onClick={() => {setCurrentStg(prev => prev - 1)}} className={`fancy-button flex flex-row gap-2 ${currentStg === 0 && 'hidden'}`}>
                            <CrayonArrow className='text-inherit w-11 h-11 -rotate-90 -translate-y-[21%]'/>
                            Atrás
                        </button>
                        <button type={contType} disabled={loading} onClick={isLastStage ? null : handleContinue} className="fancy-button flex flex-row gap-2">
                            {isLastStage ? 'Terminar' : 'Siguiente'}
                            <CrayonArrow className='text-inherit w-11 h-11 rotate-90 -translate-y-[21%]'/>
                        </button>
                    </div>
                </div>
            </form>
            <div className="relative flex flex-col gap-10 justify-center items-end basis-1/2 shrink grow shadow-[inset_30px_0px_20px_-20px_rgba(120,120,120,0.5)] bg-zinc-50 @container">
                <div className="absolute h-[calc(60cqh+10rem)] left-[calc(10cqw+3cqh+2.45rem)] border-x-slate-700 border-x-2 border-dashed"></div>
                <div className={`stage-tag ${currentStg === 0 ? "selected-stage-tag" : 'bg-linear-to-l from-gray-100 from-[90%] to-transparent to-[90%]'}`}>
                    <div className="stage-number bg-amber-500 text-amber-950">1</div>
                    <h1 className="stage-tag-txt">Correo y Contraseña</h1>
                    <MxAndPssw className='text-zinc-700 ml-auto w-[24cqh] h-[12cqh]'/>
                </div>
                <div className={`stage-tag ${currentStg === 1 ? "selected-stage-tag" : 'bg-linear-to-l from-gray-100 from-[90%] to-transparent to-[90%]'}`}>
                    <div className="stage-number bg-green-500 text-emerald-950">2</div>
                    <h1 className="stage-tag-txt">Nombre de Pila</h1>
                    <NameTxt className='text-zinc-700 ml-auto w-[10cqh] h-[10cqh]'/>
                </div>
                <div className={`stage-tag ${currentStg === 2 ? "selected-stage-tag" : 'bg-linear-to-l from-gray-100 from-[90%] to-transparent to-[90%]'}`}>
                    <div className="stage-number bg-sky-400 text-sky-950">3</div>
                    <h1 className="stage-tag-txt">DNI</h1>
                    <Dni className='text-zinc-700 ml-auto w-[9cqw] h-[9cqh]'/>
                </div>
                <div className={`stage-tag ${currentStg === 3 ? "selected-stage-tag" : 'bg-linear-to-l from-gray-100 from-[90%] to-transparent to-[90%]'}`}>
                    <div className="stage-number bg-rose-500 text-rose-950">4</div>
                    <img alt=''/>
                    <h1 className="stage-tag-txt">Domiciolio</h1>
                    <House className="text-zinc-700 ml-auto w-[10cqw] h-[10cqh]"/>
                </div>
                <div className={`stage-tag ${currentStg === 4 ? "selected-stage-tag" : 'bg-linear-to-l from-gray-100 from-[90%] to-transparent to-[90%]'}`}>
                    <div className="stage-number bg-fuchsia-500 text-fuchsia-950">5</div>
                    <h1 className="stage-tag-txt">Foto de Perfil</h1>
                    <Profile className="text-zinc-700 ml-auto w-[9cqw] h-[9cqh]"/>
                </div>
            </div>
        </div>
    )
}


function StageOne () {
    const [password, setPassword] = useState('');
    const [strenght, setStrength] = useState(0);
    const [hidden, setHidden] = useState(true);
    const [confHidd, setConfHidd] = useState(true);
    
    useEffect(() => {
        setStrength(zxcvbn(password).score);
    }, [password]);
    
    return (
        <>
            <h2 className="font-montserrat my-3 text-gray-600">Para empezar, necesitamos tu correo y que definás una contraseña:</h2>
            <FormInput placeholder={'Correo'} type={"email"} name={'email'} classes={"h-[7cqh]"}/>
            <div className="flex flex-col relative">
                <FormInput placeholder={'Contraseña'} type={hidden? "password" : "text"} name={'password'} classes={"h-[7cqh]"} value={password} onChange={e => {setPassword(e.target.value)}}/>
                <button className="absolute right-4 top-[1cqh]" onClick={() => {setHidden(prev => !prev)}}>
                    { hidden?
                        <OpenEye className="text-gray-600 w-[5cqh] h-[5cqh]"/>:
                        <CrossedOutEye className="text-gray-600 w-[5cqh] h-[5cqh]"/>
                    }
                </button>
            </div>
            <div className="flex flex-row gap-2 self-center">
                <div className={`h-2 w-[10cqw] bg-red-500 rounded-full`}></div>
                <div className={`h-2 w-[10cqw] ${strenght >= 1? 'bg-orange-400' : 'bg-orange-700'} rounded-full`}></div>
                <div className={`h-2 w-[10cqw] ${strenght >= 2? 'bg-yellow-400' : 'bg-yellow-700'} rounded-full`}></div>
                <div className={`h-2 w-[10cqw] ${strenght >= 3? 'bg-lime-400' : 'bg-lime-700'} rounded-full`}></div>
                <div className={`h-2 w-[10cqw] ${strenght >= 4? 'bg-green-500' : 'bg-green-700'} rounded-full`}></div>
            </div>
            <div className="flex flex-col relative">
                <FormInput placeholder={'Repetir Contraseña'} type={confHidd? "password" : "text"} name={'confPass'} classes={"h-[7cqh]"}/>
                <button className="absolute right-4 top-[1cqh]" onClick={() => {setConfHidd(prev => !prev)}}>
                    { confHidd?
                        <OpenEye className="text-gray-600 w-[5cqh] h-[5cqh]"/>:
                        <CrossedOutEye className="text-gray-600 w-[5cqh] h-[5cqh]"/>
                    }
                </button>
            </div>
        </>
    )
}

function StageTwo () {
    return (
        <>
            <h2>¿Cómo querés que te llamemos?</h2>
            <input type="text" name='name'/>
        </>
    )
}

function StageThree () {
    return (
        <>
            <h2>¿Cuál es tu DNI?</h2>
            <input type="number" name='dni'/>
        </>
    )
}

function StageFour () {
    //Location
    const [postCode, setPostCode] = useState('');
    const [number, setNumber] = useState('');
    const [street, setStreet] = useState('');
    const [suburb, setSuburb] = useState(''); 
    const [county, setCounty] = useState(''); 
    const [state, setState] = useState(''); 
    const [country, setCountry] = useState('');

    //Current position
    const [position, setPosition] = useState(null);

    async function fetchLocation (lat, lon) {
        try {
            const response = await axios.get("https://nominatim.openstreetmap.org/reverse", {
                params: { format: 'json', lat, lon, 'accept-language': 'es' }
            });
            const address = response.data.address;
            if (!address) return;

            setCountry(address.country || '');
            setState(address.state || '');
            setCounty(address.county || '');
            setSuburb(address.suburb || address.city || '');
            setStreet(address.road || '');
            setNumber(address.house_number || '');
            setPostCode(address.postcode || '');
        } catch (error) {
            console.error(error); //MÁS ADELANTE MANEJAR ERRORES
        }
    }

    return (
        <>
            <h2>Indique su dirección en el mapa:</h2>
            <div style={{ height: "300px", width: "400px" }}>
                <MapContainer center={[-32.889, -68.845]} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {position && <Marker position={position} />}
                    <MapEventListener fetchLocation={fetchLocation} setPosition={setPosition} />
                </MapContainer>
            </div>
            <div>
                <input type="text" name='number' value={number} onChange={(e) => setNumber(e.target.value)}/>
                <input type="text" name='street' value={street} onChange={(e) => setStreet(e.target.value)}/>
                <input type="text" name='suburb' value={suburb} onChange={(e) => setSuburb(e.target.value)}/>
                <input type="text" name='county' value={county} onChange={(e) => setCounty(e.target.value)}/>
                <input type="text" name='state' value={state} onChange={(e) => setState(e.target.value)}/>
                <input type="text" name='country' value={country} onChange={(e) => setCountry(e.target.value)}/>
                <input type="text" name='postcode' value={postCode} onChange={(e) => setPostCode(e.target.value)}/>
            </div>
        </>
    )
}

function StageFive ({ setBlob }) {
    //Profile image states
    const [imgSrc, setImgSrc] = useState("");
    const [crop, setCrop] = useState({ unit: "%", width: 50, aspect: 1 });
    const imgRef = useRef(null);

    function readProfileFile (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setImgSrc(reader.result);
            reader.readAsDataURL(file);
        }
    }

    function generarImagenFinal () {
        if (!imgRef.current || !crop.width || !crop.height) return;

        const image = imgRef.current;
        const canvas = document.createElement("canvas");
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext("2d");

        //Scale to transform navigator quotes into normal image quotes (canvas use lastones).
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0, 0,
            400, 400
        );

        canvas.toBlob( (blob) => {console.log(blob); return setBlob(blob)}, "image/jpeg", 0.7 );
        
    }

    return (
        <>
            <h2>Ahora, elegí tu foto de perfil:</h2>
            <input type="file" accept="image/*" onChange={readProfileFile}/>
            
            {imgSrc && (
                <div>
                    <ReactCrop crop={crop} onChange={(c) => setCrop(c)} aspect={1}>
                        <img ref={imgRef} src={imgSrc} alt="Crop" />
                    </ReactCrop>
                    <button type="button" onClick={generarImagenFinal}>Confirmar Recorte</button>
                </div>
            )}
        </>
    )
}

function MapEventListener({ fetchLocation, setPosition }) {
    useMapEvents({
        click: (e) => {
            setPosition(e.latlng);
            fetchLocation(e.latlng.lat, e.latlng.lng);
        }
    });
    return null;
}

export default Register;

/**
 * TAREAS:
 * 1. Manejar estados de error utilizando el mismo toast del login (debería convertir eso en un componente).
 * 2. Hace opcionales los campos de DNI, ubicación y foto de perfil (luego se van a tener que solicitar para el tema de hacer una orden o alguna tarea que requiera esa info).
 * 3. LISTO
 * 4. Hacer pantalla o mensaje de que se envió un mail de verificación (voy a necesitar hacer la ruta para el tema de la verificación exitosa).
 * 5. Arreglar el mapa que está horrible.
 * 6. LISTO
 * 7. LISTO
 * 8. Animar el selector de etapas y el resto de elementos del DOM.
 * 9. LISTO
 * 10. Manejar el input type email (no valida hasta que se manda el formulario, o sea, nunca por que no esta en el último stage).
 * 11. Animar al continuar el siguiente formulario (boton siguiente va hacia la derecha y formulario se desvanece hacia la izquierda para dar lugar al otro formualrio, lo opuesto al retroceder pero sin mover el botón).
 * 12. Hacer que el ángulo del degradado persiga el mouse. (Podriá ver si puedo reutilizar el login pets como un hook, aunque creo que retornaba coordenadas, pero puedo usar si no trigonometría para obtener el ángulo).
 */