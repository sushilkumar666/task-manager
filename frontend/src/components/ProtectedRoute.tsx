import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/UserProvider';

interface ProtectedRouteProps {
    children: ReactNode;
    reverse?: boolean; // true = unauth-only (like login/signup)
}

export default function ProtectedRoute({ children, reverse = false }: ProtectedRouteProps) {
    const { authenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!reverse && !authenticated) {
            // Protected route (needs auth)
            navigate('/login');
        } else if (reverse && authenticated) {
            // Public route (already logged in, redirect)
            navigate('/');
        }
    }, [authenticated, navigate, reverse]);

    // Show children if condition matches
    if ((!reverse && authenticated) || (reverse && !authenticated)) {
        return <>{children}</>;
    }

    // Optional: Loader or null while redirecting
    return null;
}
