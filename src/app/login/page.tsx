import { Suspense } from 'react';
import type { Metadata } from 'next';
import LoginPage from '@/components/auth/LoginPage/LoginPage';

export const metadata: Metadata = { title: 'Log In' };

export default function Login() {
    return (
        <Suspense>
            <LoginPage />
        </Suspense>
    );
}
