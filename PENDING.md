# Pendientes y Resumne de Desarrollo del Backend
## Cómo Levantar el Proyecto
A la hora de escribir este documento marckdown, la versión de Node.JS que se utiliza para levantar el proyecto es la 26.13.0. Para inciar el servidor de desarrollo Vite debe encontrarse ubicado en la carpet raíz del proyecto (al mismo nivel de package.json) y ejecutar el comando:
`npm run dev`

## Estructura General del Proyecto
El proyecto está hecho con React, Vite y TailwindCSSv4 y contiene la estructura estandar de directorios de un proyeto de React. Podrá encontrar dentro del driectorio src/hooks varios hooks:
- useAutoPag: Llama a la api atuomáticamente y retorna permite organizar los datos paginados automáticamente con un IntersectionObserver que detecta cuando se scrollea al final de la lista de elementos.

- useFollowEyes: Es un hook visual que sirve para que un elemento siga el cursor del usuario dentro de un límite. Se usa puntualmente para simular pupilas y simular ojos en diferentes partes de la aplicación.

- useMediaQuery: Es un hook que se utiliza para verificar si el usuario se encuentra en dispositivos móviles o en televisores o computadoras. Puntualmente es útil para poder gestionar este tipo de coasa por código y no solo a partir de estilos de CSS.

Además de eso podrá encontrar las páginas o pestañas generales de la página en la el direcotorio src/pages, y el resto de componentes y el ementos en los otros directorios. Cabe aclarar que el el desarrollo del front-end está en proceso, de modo que aún faltan páginas y elementos en la aplicación que consuman los endpoints del backend. Hasta el momento lo principal que falta:
1. Sección para visualizar productos.
2. Panel de administración para los dueños del emprendimiento, donde se consuman los endpoints del bakcend para poder añadir productos, listas, escuelas, y demas funciones que corresponden al administrador del emprendimiento.
3. Perfil del usuario, donde pueda visualizar su información personal, ordenes, editar su información, etc.

## Asuntos Pensientes a Resolver
- Muchas páginas están incompletas, ya que falta el menejo del estado de carga y el manejo de errores que provienen del backend con la siguiente estructura:
{
	origin: servicio del que se origina el error
	type: tipo de error
}

- En el mapa de la zona de registro correspondiente para que el usuario indique su domicilio falta geolocalizar por medio de JS la ubicación del usuario para poner el marker en sobre su posible domicilio. Y estabalcer también una uicación por default en caso de que el usuario no acepte los permisos del navegador. Además en este mapa debería cambiarse el proveedor de imágenes, ya que al parecer el proveedor actual requiere un API secret y quizás no sea gratuito (al inicio se creyó que era gratuito y no requería nada, pero ahora falla).

- Faltan botones para omitir pasos en el formualrio de registro. Deben poder omitirse de acuerdo a los campos que son opcionales en el modelo de usuario de la base de datos. Cabe aclarar que para las operaciónes que requieran estos campos debería soliciatrle el forntend al usuario completar estos datos en su perfil en caso de no contar con ellos para poder realizar la operación (se pensó esta estrategia para evitar que el formualrio de regsitro sea agobiante para el usuario, como se hace en otros servicios como mercado libre).

- Debería implmentarse algun modo para detectar cunando el JSON Web Token expire de la cookie de seción y así eliminarla y redirigir al usuario para que inicie seción nuevamente.

- Es fundamental hacer cambios en el bakcend en todos los endpoints de GET que implemntaran paginación (al menos los endpoints que consumiría el hook useAutoPag). El cambipo puntalmente es que cuando el backend llegue a la úlitma página (la cantidad de elementos es menor al límete), retorne null en el nextCursor. Este cambio es fundamental por que si no el hook se bugearía.

- El hook useAutoPag debe ser probado en Reeact Stict Mode, esto se debe a que al habilitar este modo el hook se bugea y no muestra los datos. Perosnalmente sospecho que debe deberse a que el event loop de Java Script no está sincronizado o vinculado con el ciclo de vida de un componente de React, pero no es seguro que ese sea el motivo del problema.

- Respecto al carrito de invitados (al usuario sin logear se le perimte poseer un carrito de invitados en el localstorage), pero al iniciar sesión debería detectarse este carrito y preguntarle al usuario si le gustaría añadir los items de este carrito a su cuenta para posteriormente eliminar los del localstorage o si prefiere mantnerlos como estan.

- Las "mascotitas" del login están incompletas, falta hacer animaciones para cuando hay errores, puntualmente ya estan empezadas las de los errores internos del sistema, pero no estan terminadas y faltan las de los errores del usuario (la idea era que para los errores del usuario las mascotas negaran con la cabeza o indiquen que algo está mal o algo por el estilo y para los errores del sistema las macotas simulen morir o algo similar). También faltan animaciónes para estas mismas mascotas para cuando la operación de logearse es exitosa.

- El la sección de la home page falta indicar varias cosas, como poner un FAQ, indicar al usuario de forma gráfica el proceso para que su pedido llegue a casa y colocar estadísitcas (en un futuro) del emprendimiento.

- Faltan detalles gráficos de muy baja prioridad, como poner el cursor pointer en la mayoría de los botones, poner un botón de "¿no tenés cuenta?" en el login, ajustar la forma en la que nos dirigimos al usuario (a veces se tutea y otras veces se trata de usted, debería unificarse como tuteo), animar botones, etc.