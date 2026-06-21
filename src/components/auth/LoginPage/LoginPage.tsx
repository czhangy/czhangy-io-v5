'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import styles from './LoginPage.module.scss';

const LoginPage: React.FC = () => {
    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const router = useRouter();
    const searchParams = useSearchParams();

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post('/api/auth/login', { password });
            const callbackUrl = searchParams.get('callbackUrl') ?? '/';
            router.push(callbackUrl);
            router.refresh();
        } catch {
            setError('Invalid password.');
        } finally {
            setLoading(false);
        }
    };

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['login-page']}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h1 className={styles.title}>LOG IN</h1>
                <p className={styles.subtitle}>
                    If I know you, ask me for a login.
                </p>
                <div className={styles.field}>
                    <input
                        id="password"
                        type="password"
                        className={styles.input}
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Password"
                        autoComplete="current-password"
                        disabled={loading}
                    />
                </div>
                <button
                    type="submit"
                    className={styles.submit}
                    disabled={loading || !password}
                >
                    {loading ? 'VERIFYING...' : 'ENTER'}
                </button>
                {error ? <p className={styles.error}>{error}</p> : null}
            </form>
        </div>
    );
};

export default LoginPage;
