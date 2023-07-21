import { createContext, useState } from "react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState({
        name: '',
        gender: '',
        birthdate: '',
        country: '',
        state: '',
        city: '',
    });

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo }}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext, UserProvider };