'use client';

import { useAuth } from '@/context/AuthContext';

export default function Dashboard() {
    const { user } = useAuth();
    return (<>
            <h1>Dashboard</h1>
            <p>Welcome {user?.username}</p>
    </>
    );
}