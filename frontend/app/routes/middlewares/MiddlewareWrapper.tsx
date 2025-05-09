// MiddlewareWrapper.jsx
import {type ReactNode, useEffect} from 'react';
import {useLocation, useNavigate} from "react-router";

const MiddlewareWrapper = ({ children }: {children: ReactNode}) => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const isBanned = localStorage.getItem('isBanned');
        if (isBanned && location.pathname !== '/ban') {
            navigate('/ban');
        }
    }, [location, navigate]);

    return children;
};

export default MiddlewareWrapper;
