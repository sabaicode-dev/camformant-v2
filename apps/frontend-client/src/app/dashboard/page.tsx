'use client';
import { Stats } from '@/components/Stats';
import { useAuth } from '@/context/AuthContext';

export default function Dashboard() {
    const { user } = useAuth();
    return (
    <>
        <h1>Dashboard</h1>
        <p>Welcome {user?.name}</p>
        <Stats/>
    </>
    );
}