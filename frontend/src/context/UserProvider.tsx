import { createContext, useState, ReactNode, useContext, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

interface IUserContext {
    user: string,
    login: (username: string) => void;
    logout: () => void;
    authenticated: boolean
}

const userContext = createContext<IUserContext | null>(null);

function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState("");
    const authenticated = Boolean(user);
    const login = async (username: string) => {
        localStorage.setItem('user', username);
        setUser(username)
    }
    const logout = async () => {
        localStorage.removeItem('user');
        await axios.post(`${BACKEND_URL}/api/auth/logout`, { withCredentials: true });
        setUser("");
    }

    console.log(authenticated + " this is authenticated value")
    useEffect(() => {

        let user = localStorage.getItem('user');
        if (user) {

            setUser(user);
        }
    }, [])


    return (
        <>
            <userContext.Provider value={{ user, login, logout, authenticated }}>
                {children}
            </userContext.Provider>
        </>
    )
}

export const useAuth = () => {
    const ctx = useContext(userContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");;
    return ctx;
}


export default UserProvider;