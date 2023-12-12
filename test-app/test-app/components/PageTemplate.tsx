import React, { useEffect, ReactNode } from 'react';
import { fetchData } from '../util/util';

const PageTemplate = ({ title, content, loading, setLoading, showLogoutLink = false }:
    { title: string, content: ReactNode, loading: boolean, setLoading: Function, showLogoutLink?: boolean }) => {

    useEffect(() => {
        fetchData('200', setLoading);
    }, []);

    return (
        <>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {showLogoutLink && (
                        <a href='/logout' className="logout-link">Logout</a>
                    )}
                    <h1>{title}</h1>

                    {content}
                </div>
            )}
        </>
    );
};

export default PageTemplate;
