import { createContext, useState } from "react";

const UserContext = createContext();
	
export function UserProvider ({children}) {
	const [name, setName] = useState(() => localStorage.getItem('usrName'));
	const [image, setImage] = useState(() => localStorage.getItem('usrImg'));

	const updateName = (name) => {
		setName(name);
		localStorage.setItem('usrName', name);
	}

	const updateImg = (image) => {
		setImage(image);
		localStorage.setItem('usrImg', image);
	}

	return (
		<UserContext.Provider value={{ image, setImage: updateImg, name, setName: updateName }}>
			{children}
		</UserContext.Provider>
	)
}

export default UserContext;