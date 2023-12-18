import React, { useState } from 'react';
import PageTemplate from './PageTemplate';

const FrontPage = ({ pageDirectory, showLogoutLink = false }: { pageDirectory: string, showLogoutLink?: boolean }) => {
    const [loading, setLoading] = useState(true);

    const content = (
        <div>
            <a href='/working-page'>Link for a working page</a>
            <a href={`/${pageDirectory}`}>{`Link for a ${pageDirectory} page`}</a>
        </div>
    );

    return (
        <>
            <PageTemplate title={`Test application - ${pageDirectory}`} content={content} 
                   loading={loading} setLoading={setLoading} showLogoutLink={showLogoutLink}/>
        </>
    );
};

export default FrontPage;