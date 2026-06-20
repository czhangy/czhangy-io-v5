import type { Metadata } from 'next';
import RegisterPage from '@/components/auth/RegisterPage/RegisterPage';

export const metadata: Metadata = { title: 'Register' };

export default function Register() {
    return <RegisterPage />;
}
