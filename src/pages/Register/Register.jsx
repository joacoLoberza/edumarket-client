//Packages
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents, ZoomControl } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import Cropper from "react-easy-crop";
import zxcvbn from "zxcvbn";
import axios from "axios";

//Files
import api from "../../config/axiosApi";
import styles from "./Register.module.css";

//Components
import FormInput from "../../components/FormInput/FormInput";
import DinamTitle from "../../components/DinamTitle/DinamTitle";
import ErrorToast from "../../components/ErrorToast/ErrorToast";
import DragDrop from "../../components/DragDrop";
import LoadSpinner from "../../components/LoadSpinner";

//Images && Graphic Resources
import CrayonArrow from '../../assets/icons/general/crayonArrow.svg?react';
import MxAndPssw from '../../assets/icons/register/mailAndPasswd.svg?react';
import NameTxt from '../../assets/icons/register/name.svg?react';
import Dni from '../../assets/icons/register/dni.svg?react';
import House from '../../assets/icons/register/house.svg?react';
import Profile from '../../assets/icons/register/profile.svg?react';
import OpenEye from '../../assets/icons/general/openEye.svg?react';
import CrossedOutEye from '../../assets/icons/general/crossedOutEye.svg?react';
import Map from '../../assets/icons/register/map.svg?react';
import DropFiles from '../../assets/icons/general/dropFiles.svg?react';
import Directory from '../../assets/icons/general/directory.svg?react';
import PlaneTrace from '../../assets/images/register/planeTrace.svg?react';
import HappyMail from '../../assets/icons/general/happyMail.svg?react';

function Register() {
    const navigate = useNavigate();

    const regForm = useRef(null);

    //Layout mode for stage 4.
    const mapLayoutSt = useState(false);
    const [mapLayout, setMapLayout] = mapLayoutSt;

    const [title, setTitle] = useState('');
    const [reverse, setReverse] = useState(false);
    const [next, setNext] = useState(true);
    const strenghtSt = useState(0);
    const [strenght] = strenghtSt;
    const blobSt = useState(null);
    const [blob] = blobSt;
    const cropImgSt = useState(null);
    const [data] = useState(new FormData());
    const [currentStg, setCurrentStg] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [message, setMessage] = useState('');
    const [sentMail, setSentMail] = useState(false);
    const renderStage = () => {
        switch (currentStg) {
            case 0: return <StageOne data={data} strenghtSt={strenghtSt}/>;
            case 1: return <StageTwo data={data}/>;
            case 2: return <StageThree data={data}/>;
            case 3: return <StageFour data={data} mapLayoutSt={mapLayoutSt}/>;
            case 4: return <StageFive data={data} blobSt={blobSt} cropImgSt={cropImgSt}/>;
            default: return null;
        }
    };

    const isLastStage = currentStg === 4;
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

        if (!formatFields(stageData, true)) return;

        for (const [key, value] of stageData) {
            if (typeof value === 'string' && !value.trim() && (currentStg === 0 || currentStg === 1)) {
                setError(true);
                setMessage('Estos campos son obligatorios.')
                return;
            } else if (typeof value === 'string' && value.trim()) {
                console.log(`
                    Adding:
                    ${key} => ${value}
                    Seems that ${value.trim()} is not ''.
                `)
                data.set(key, value);}
        };

        setError(false);
        setMessage('');
        setMapLayout(false);
        setNext(prev => !prev);
        setReverse(false);

        //Si funciona no lo toques. :)
        setTimeout(() => {
            setCurrentStg((prev) => prev + 1);
        },0); 
    };

    const handleBack = (e) => {
        const stageData = new FormData(regForm.current);
        formatFields(stageData);
        for (const [key, value] of stageData) {
            data.set(key, value);
        }

        setMapLayout(false);
        setCurrentStg(prev => prev - 1);
        setNext(prev => !prev);
        setReverse(true);
    }

    const formatFields = (stageData, report = false) => {
        const inputs = regForm.current.querySelectorAll('input');
        
        let isValid = true;
        inputs.forEach(input => {
            if (!input.checkValidity())
                isValid = false;
                return;
        });

        if (!isValid && report) {
            regForm.current.reportValidity();
            return 0;
        }

        switch (currentStg) {
            case 0:
                if (stageData.get('confPass') !== stageData.get('password')) {
                    setError(true);
                    setMessage('Tu contraseña no es igual a la que confirmaste, ambas deben ser iguales.');
                    return 0;
                }
                if (strenght < 3) {
                    setError(true);
                    setMessage('¡Tu contraseña es muy fácil de adivinar!');
                    return 0;
                }
                break;
            case 3:
                let empty = true;
                for (const [key, val] of stageData) {
                    if (val !== '')
                        empty = false;
                }
                if ((stageData.get('number') === '' || stageData.get('street') === '' || stageData.get('suburb') === '' || stageData.get('postcode') === '') && !empty) {
                    setError(true);
                    setMessage(`No podemos usar esta dirección ya que está incompleta.`);
                    return 0;
                }
                break;

        }
        return 1;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (blob)
            data.set('profileImg', blob, 'profile.jpg');

        data.delete('confPass');

        let home = '';
        ['street', 'number', 'county', 'suburb', 'state', 'country', 'postcode'].forEach(val => {
            if (data.get(val) === null)
                return;

            switch (val) {
                case 'street':
                    home += `${data.get(val)} `;
                    break;
                case 'postcode':
                    home += `- ${data.get('postcode')}`;
                default:
                    home += `${data.get(val)}, `;
            }
            data.delete(val);
        });
        if (home.trim()) 
            data.set('address', home);

        for (const [key, val] of data) {
            console.log(`
                Register:
                ${key} => ${val};

            `)
        }
        try {
            setLoading(true);

            const response = await api.post('/user/register', data, { headers: {'Content-Type': 'multipart/form-data'}});

            console.log(`%cAPI - ${response.status}|%c ${response.data.message}`, "color: rgb(255,255,0");

            setSentMail(true);
        } catch(error) {
            setError(true);
            const res = error?.response;
            const resData = res?.data;

            if (res) {
                console.error(`%cAPI - ${res.status}|%c ${resData?.message}`, "color: rgb(255, 255, 0);");
                console.log(resData);
                switch (resData?.type) {
                    case "Unknown":
                        switch (resData?.origin) {
                            case "cloudinary":
                                setMessage("No pudimos subir tu imagen de perfil a la nube.\nDe todas maneras, la cuenta fue creada.");
                                setSentMail(true);
                                break;
                            default:
                                setMessage("¡No es tu culpa! Hubo un error interno en el servidor.");
                        }
                        break;
                    case "Overloaded":
                        setMessage('¡No es tu culpa! Estamos atendiendo muchas peticiones, intentalo más tarde.');
                        break;
                    case "InvalidDataSent":
                        setMessage('Hay información en el formato incorrecto.');
                        break;
                    case "UniqueDataRepeated":
                        setMessage(`Hay usuarios que ya utilizan este correo electrónico${data.get('dni') !== null ? (data.get('dni').trim() !== ''? ' o este DNI':'') : ''}.`);
                        break;
                    default:
                        setMessage("Algo salió mal...");
                }
            } else {
                console.error("%cERROR|%c Couldn't send the request.", "color: rgb(255, 60, 0)")
                setMessage("No pudimos comunicarnos con el servidor.\nVerificá tu conexión Wi-Fi o intentá más tarde.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-row h-screen">
            <div className="relative grow shrink-0 min-w-1/2">
                <form className={`relative z-20 @container overflow-scroll h-screen bg-white flex transition-translate duration-500 ease-out ${(loading || sentMail)&& "-translate-y-[100%]"} ${!mapLayout&& 'pt-15'}`} ref={regForm} onSubmit={handleSubmit}>
                    <button type="button" onClick={() => {navigate('/')}} className={`fancy-button absolute right-10 top-10 z-20 ${mapLayout&& "px-3 py-1 bg-white rounded-full"}`}>Inicio</button>
                    <div className={`px-[20cqw] flex flex-col relative ${mapLayout? 'justify-end' : 'gap-6 my-auto'}`}>
                        {!mapLayout &&
                            <div className="relative flex items-center">
                                <DinamTitle onTitleChange={setTitle} next={next} reverse={reverse} interval={75} titles={phrases} classes="absolute font-quicksand font-bold text-4xl text-transparent bg-linear-to-br from-sky-500 from-[5%] via-violet-500 via-[40%] to-rose-500 bg-clip-text"/>
                                <h1 className="font-bold text-4xl font-quicksand w-[60cqw] opacity-0 pointer-events-none select-none">{title}</h1>
                            </div>
                        }
                        {renderStage()}
                        <div className={`flex flex-row z-10 ${currentStg !== 0 ?"justify-between" : "justify-end"} ${mapLayout&& "bg-white px-5 rounded-b-4xl mb-15"}`}>
                            <button type='button' onClick={handleBack} className={`fancy-button flex flex-row gap-2 ${currentStg === 0 && 'hidden'}`}>
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
                <div className={`absolute top-0 left-0 z-10 h-screen w-full bg-zinc-200 flex justify-center items-center transition-translate duration-750 ease-out ${sentMail&& "-translate-y-[100%]"} @container/normal`}>
                    <LoadSpinner loading={loading}/>
                </div>
                <div onClick={() => {navigate(-1)}} className="absolute top-0 left-0 z-0 h-screen w-full m-0 bg-zinc-200 flex flex-col justify-center px-[5cqw] fancy-text font-bold text-gray-500 text-xl cursor-pointer">
                    <div className="grid grid-rows-[auto_auto] grid-cols-[1fr_2fr_2fr] gap-x-3">
                        <HappyMail className="col-1 row-[1/span_2] w-15 h-15 rotate-10 justify-self-center self-center"/>
                        <p className="col-[2/span_2] row-1">¡Listo!</p>
                        <p className="col-[2/span_2] row-2">Te enviamos un mail de verificación, revisalo para activar tu cuenta.</p>
                    </div>
                    <button className="fancy-button font-medium text-base absolute bottom-5 right-8 flex items-center gap-2"><span className="text-2xl">←</span>Volver</button>
                </div>
            </div>
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
                    <h1 className="stage-tag-txt">Domiciolio</h1>
                    <House className="text-zinc-700 ml-auto w-[10cqw] h-[10cqh]"/>
                </div>
                <div className={`stage-tag ${currentStg === 4 ? "selected-stage-tag" : 'bg-linear-to-l from-gray-100 from-[90%] to-transparent to-[90%]'}`}>
                    <div className="stage-number bg-fuchsia-500 text-fuchsia-950">5</div>
                    <h1 className="stage-tag-txt">Foto de Perfil</h1>
                    <Profile className="text-zinc-700 ml-auto w-[9cqw] h-[9cqh]"/>
                </div>
            </div>
            {error &&
                <ErrorToast message={message} onClick={() => {setError(false)}}/>
            }
        </div>
    )
}


function StageOne ({ data, strenghtSt }) {
    const [strenght, setStrength] = strenghtSt;
    const [password, setPassword] = useState(data.get('password') !== null? data.get('password') : '');
    const [confPass, setConfPass] = useState(data.get('confPass') !== null? data.get('confPass') : '');
    const [email, setEmail] = useState(data.get('email') !== null? data.get('email') : '');
    const [hidden, setHidden] = useState(true);
    const [confHidd, setConfHidd] = useState(true);
    
    useEffect(() => {
        setStrength(zxcvbn(password).score);
    }, [password]);
    
    return (
        <>
            <h2 className="fancy-text">Para empezar, necesitamos tu correo y que definás una contraseña:</h2>
            <FormInput placeholder={'Correo'} type={"email"} name={'email'} classes={"h-[7cqh]"} value={email} onChange={e => {setEmail(e.target.value)}}/>
            <div className="flex flex-col relative">
                <FormInput placeholder={'Contraseña'} type={hidden? "password" : "text"} name={'password'} classes={"h-[7cqh]"} value={password} onChange={e => {setPassword(e.target.value)}}/>
                <button type="button" className="absolute right-4 top-[1cqh]" onClick={() => {setHidden(prev => !prev)}}>
                    { hidden?
                        <OpenEye className="text-gray-600 w-[5cqh] h-[5cqh]"/>:
                        <CrossedOutEye className="text-gray-600 w-[5cqh] h-[5cqh]"/>
                    }
                </button>
            </div>
            <div className="flex flex-row gap-2 self-center">
                <div className={`h-2 w-[10cqw] ${password === ''? 'bg-red-700' : 'bg-red-500'} rounded-full`}></div>
                <div className={`h-2 w-[10cqw] ${strenght >= 1? 'bg-orange-400' : 'bg-orange-700'} rounded-full`}></div>
                <div className={`h-2 w-[10cqw] ${strenght >= 2? 'bg-yellow-400' : 'bg-yellow-700'} rounded-full`}></div>
                <div className={`h-2 w-[10cqw] ${strenght >= 3? 'bg-lime-400' : 'bg-lime-700'} rounded-full`}></div>
                <div className={`h-2 w-[10cqw] ${strenght >= 4? 'bg-green-500' : 'bg-green-700'} rounded-full`}></div>
            </div>
            <div className="flex flex-col relative">
                <FormInput placeholder={'Repetir Contraseña'} type={confHidd? "password" : "text"} name={'confPass'} value={confPass} onChange={e => {setConfPass(e.target.value)}} classes={"h-[7cqh]"}/>
                <button type="button" className="absolute right-4 top-[1cqh]" onClick={() => {setConfHidd(prev => !prev)}}>
                    { confHidd?
                        <OpenEye className="text-gray-600 w-[5cqh] h-[5cqh]"/>:
                        <CrossedOutEye className="text-gray-600 w-[5cqh] h-[5cqh]"/>
                    }
                </button>
            </div>
        </>
    )
}

function StageTwo ({ data }) {
    const [name, setName] = useState(data.get('name') !== null? data.get('name') : '');

    return (
        <>
            <h2 className="fancy-text">¿Cómo querés que te llamemos?</h2>
            <FormInput placeholder='Nombre' type='text' name='name' value={name} onChange={e => {setName(e.target.value)}} classes={"h-[7cqh]"} />
        </>
    )
}

function StageThree ({ data }) {
    const [dni, setDni] = useState(data.get('dni') !== null? data.get('dni') : '');

    return (
        <>
            <h2 className="fancy-text">¿Cuál es tu DNI?</h2>
            <FormInput placeholder="DNI" type="text" inputMode="numeric" pattern="[0-9]*" value={dni} onChange={e => {setDni(e.target.value)}} name="dni" classes="h-[7cqh]"/>
        </>
    )
}

function StageFour ({ data, mapLayoutSt }) {
    //Location
    const [postCode, setPostCode] = useState(data.get('postcode') !== null ? data.get('postcode') : '');
    const [number, setNumber] = useState(data.get('number') !== null ? data.get('number') : '');
    const [street, setStreet] = useState(data.get('street') !== null ? data.get('street') : '');
    const [suburb, setSuburb] = useState(data.get('suburb') !== null ? data.get('suburb') : ''); 
    const [county, setCounty] = useState(data.get('county') !== null ? data.get('county') : ''); 
    const [state, setState] = useState(data.get('state') !== null ? data.get('state') : ''); 
    const [country, setCountry] = useState(data.get('country') !== null ? data.get('country') : '');

    //Layout mode
    const [mapLayout, setMapLayout] = mapLayoutSt;

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
            {!mapLayout&& 
                <>
                    <h2 className="fancy-text mb-0">Indicá tu dirección en el mapa:</h2>
                    <button type="button" onClick={() => {setMapLayout(true)}} className="self-end fancy-button text-sm flex flex-row gap-5 items-center mr-5">
                        Ver Mapa
                        <Map className="text-inherit w-10 h-10 rotate-[30deg]"/>
                    </button>
                </>
            }
            {mapLayout &&
                <>
                    <div className="h-[100cqh] w-[100cqw] fixed left-0 top-0 z-10">
                        <MapContainer center={[-32.889, -68.845]} zoom={13} zoomControl={false} style={{ height: "100%", width: "100%" }}>
                            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" attribution='&copy; <a href="https://carto.com/">CARTO</a>'/>
                            {position && <Marker position={position} />}
                            <ZoomControl position="bottomright"/>
                            <MapEventListener fetchLocation={fetchLocation} setPosition={setPosition} />
                        </MapContainer>
                    </div>
                    <div className="justify-center flex items-center h-8 w-17 bg-zinc-500/30 fixed bottom-[65px] left-[calc(100cqw-68px-10px)] z-[1000] rounded-xl hover:bg-zinc-500/50 cursor-pointer transition-colors duration-400 ease-in-out">
                        <button type='button' className="text-gray-700 font-semibold font-montserrat" onClick={() => {setMapLayout(false)}}>Listo</button>
                    </div>
                </>
            }
            <div className={`flex flex-col z-1010 transition-[gap] duration-[1250ms] ease-out ${mapLayout? ' gap-1 bg-white border-40 border-white rounded-t-4xl' : ' gap-6'}`}>
                <div className={`grid grid-cols-[1fr_3fr] gap-1`}>
                    <FormInput placeholder="Número" type="text" value={number} onChange={(e) => setNumber(e.target.value)} name="number" classes={`h-[7cqh] rounded-r-none min-w-0 ${ mapLayout&& ' rounded-b-none rounded-tl-3xl'}`}/>
                    <FormInput placeholder="Calle" type="text" value={street} onChange={(e) => setStreet(e.target.value)} name="street" classes={`h-[7cqh] rounded-l-none min-w-0 ${ mapLayout&& ' rounded-b-none rounded-tr-3xl'}`}/>
                </div>
                <div className="grid grid-cols-2 gap-1">
                    <FormInput placeholder="Localidad" type="text" value={county} onChange={(e) => setCounty(e.target.value)} name="county" classes={`h-[7cqh] rounded-r-none ${ mapLayout&& ' rounded-none'}`}/>
                    <FormInput placeholder="Municipio" type="text" value={suburb} onChange={(e) => setSuburb(e.target.value)} name="suburb" classes={`h-[7cqh] rounded-l-none ${ mapLayout&& ' rounded-none'}`}/>
                </div>
                <div className="grid grid-cols-2 gap-1">
                    <FormInput placeholder="Provincia" type="text" value={state} onChange={(e) => setState(e.target.value)} name="state" classes={`h-[7cqh] rounded-r-none ${ mapLayout&& ' rounded-none'}`}/>
                    <FormInput placeholder="País" type="text" value={country} onChange={(e) => setCountry(e.target.value)} name="country" classes={`h-[7cqh] rounded-l-none ${ mapLayout&& ' rounded-none'}`}/>
                </div>
                <FormInput placeholder="Código Postal" type="text" value={postCode} onChange={(e) => setPostCode(e.target.value)} name="postcode" classes={`h-[7cqh] ${ mapLayout&& ' rounded-t-none rounded-b-3xl'}`}/>
            </div>
        </>
    )
}

function StageFive ({ blobSt, cropImgSt }) {
    //Final image
    const [blob, setBlob] = blobSt;
    const [cropImg, setCropImg] = cropImgSt; //The same blob, but in Base64

    //Profile image states
    const [imgSrc, setImgSrc] = useState("");
    const [crop, setCrop] = useState({ x: 0, y:0 });
    const [zoom, setZoom] = useState(1);
    const [dimensions, setDimensions] = useState(null);

    //Style
    const cropContainer = useRef(null);
    const [showCropArea, setShowCropArea] = useState(false);

    if (cropContainer.current) {
        const cropFrame = cropContainer.current.querySelector('.reactEasyCrop_CropArea');
        const cropArea = cropContainer.current.querySelector('.reactEasyCrop_Container');
        const cropImage = cropContainer.current.querySelector('.reactEasyCrop_Image');

        cropFrame.classList.add(styles["ownCropArea"]);
        cropArea.classList.add(styles["cropContainerArea"]);
        cropImage.classList.add(styles["cropImage"]);
    }

    function readProfileFile (file) {
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {setImgSrc(reader.result); setShowCropArea(true)};
            reader.readAsDataURL(file);
        }
    }

    async function processImage () {
        setShowCropArea(false);
        if (!dimensions || !imgSrc || !dimensions.width || !dimensions.height) return;

        const image = new Image();
        image.src = imgSrc;
        await new Promise(resolve => {image.onload = resolve});

        const canvas = document.createElement("canvas");
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(
            image,
            dimensions.x,
            dimensions.y,
            dimensions.width,
            dimensions.height,
            0, 0,
            400, 400
        );

        canvas.toBlob( (blob) => {setBlob(blob); setCropImg(URL.createObjectURL(blob))}, "image/jpeg", 0.7 );
    }
    
    return (
        <>
            {blob?
                <div className="flex gap-4 items-center">
                    <img src={cropImg} alt="Foto de Perfil Corriente" className="w-10 h-10 rounded-full select-none"/>
                    <p className="fancy-text">Esta va a ser tu foto de perfil, podés cambiarla subiendo otro archivo.</p>
                </div>
                :
                <h2 className="fancy-text">Ahora, elegí tu foto de perfil:</h2>
            }
            <input id='upload-file' type="file" accept="image/*" onChange={(e) => {readProfileFile(e.target.files[0])}} className="hidden"/>
            <label htmlFor="upload-file" className="fancy-button flex gap-2 items-center">
                <Directory className='text-inherit w-6 h-6'/>
                Subir
            </label>

            <DragDrop normalAddStyles="w-full h-[30cqh] flex flex-col gap-1 justify-center items-center" dragAddStyles="" callback={(files) => {readProfileFile(files[0])}} >
                <DropFiles className="text-slate-400 w-3/10 h-3/10"/>
                <p className="fancy-text text-slate-400 font-semibold select-none">O Arrastra Acá</p>
            </DragDrop>
            
            {showCropArea && (
                <div ref={cropContainer} className="fixed top-0 left-0 h-[100vh] w-[100cqw] z-15">
                    <p className="fancy-text z-20 px-[20cqw] m-0 absolute top-[calc((100vh-50cqw)/2+5vh-100px)]">Recortá tu imagen arrastrandola dentro del espacio circular:</p>
                    <Cropper image={imgSrc} crop={crop} zoom={zoom} aspect={1} cropShape="round" showGrid={true} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={(dimPer,dimPx) => {setDimensions(dimPx)}}/>
                    <PlaneTrace className="text-neutral-700 w-[55cqw] h-[55cqw] absolute -bottom-[4cqw] left-[calc((100cqw-50cqw)/2+7cqw)] pointer-events-none"/>
                    <button type="button" className="absolute right-0 bottom-10 z-20 py-2 pl-4 pr-15 bg-gray-300/75 rounded-l-full fancy-button font-semibold hover:bg-gray-200 hover:text-gray-500/75 hover:pr-20 transition-[padding,background-color] duration-400 ease-in-out" onClick={processImage}>Listo</button>
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
 * 1. LISTO
 * 2. LISTO
 * 3. LISTO
 * 4. LISTO
 * 5. LISTO
 * 6. LISTO
 * 7. LISTO
 * 8. Animar el selector de etapas y el resto de elementos del DOM.
 * 9. LISTO
 * 10. LISTO
 * 11. Animar al continuar el siguiente formulario (boton siguiente va hacia la derecha y formulario se desvanece hacia la izquierda para dar lugar al otro formualrio, lo opuesto al retroceder pero sin mover el botón).
 * 12. Hacer que el ángulo del degradado persiga el mouse. (Podriá ver si puedo reutilizar el login pets como un hook, aunque creo que retornaba coordenadas, pero puedo usar si no trigonometría para obtener el ángulo).
 * 13. LISTO
 * 14. LISTO
 * 15. Guardar en localstorage el progreso del formulario.
 * 16. LISTO
 * 17. Consultar si oculto o no los enlaces a leaflet.
 * 18. Acceder a la ubicación del usuario para posicionar el marker del mapa.
 * 19. Hacer más bonito el marker del mapa.
 * 20. Resolver el envío accidental del formulario, se envía al precionar enter en cualquier stage.
 */