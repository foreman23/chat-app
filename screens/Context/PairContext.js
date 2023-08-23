import { createContext, useState } from "react";

const PairContext = createContext();

const newPair = {
    chatID: '',
}

const PairProvider = ({ children }) => {
    const [pairInfo, setPairInfo] = useState(newPair);

    const resetPair = () => {
        setPairInfo(newPair);
    }

    return (
        <PairContext.Provider value={{ pairInfo, setPairInfo, resetPair }}>
            {children}
        </PairContext.Provider>
    )
}

export { PairContext, PairProvider };