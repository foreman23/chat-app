import { createContext, useState } from "react";

const UserContext = createContext();

const newUser = {
    name: '',
    gender: '',
    birthdate: '',
    country: '',
    state: '',
    city: '',
    level: 1,
    exp: 0,
    defaultPfp: true,
}

const UserProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(newUser);

    const resetUser = () => {
        setUserInfo(newUser);
    }

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo, resetUser }}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext, UserProvider };