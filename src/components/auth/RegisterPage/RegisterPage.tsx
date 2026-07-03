'use client';

import { useState } from 'react';
import styles from './RegisterPage.module.scss';

const RegisterPage: React.FC = () => {
    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setError('');
        setSuccess(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            if (!res.ok) {
                const data = await res.json();
                setError(data.error ?? 'Failed to create user.');
                return;
            }
            setSuccess(true);
            setPassword('');
        } catch {
            setError('Failed to create user.');
        } finally {
            setLoading(false);
        }
    };

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['register-page']}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h1 className={styles.title}>REGISTER</h1>
                <div className={styles.field}>
                    <input
                        id="password"
                        type="password"
                        className={styles.input}
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Password"
                        disabled={loading}
                    />
                </div>
                <button
                    type="submit"
                    className={styles.submit}
                    disabled={loading || !password}
                >
                    {loading ? 'CREATING...' : 'CREATE'}
                </button>
                {error ? <p className={styles.error}>{error}</p> : null}
                {success ? (
                    <p className={styles.success}>User created.</p>
                ) : null}
            </form>
        </div>
    );
};

export default RegisterPage;
