import { createContext, useState } from "react";

const UserContext = createContext();

const newUser = {
    name: '',
    gender: '',
    birthdate: '',
    friend_requests: {
        outgoingArr: [],
        incomingArr: [],
    },
    friends: {
        friendArr: [],
    },
    location: {
        country_code: "DEFAULT_VALUE",
        country_name: "DEFAULT_VALUE",
    },
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