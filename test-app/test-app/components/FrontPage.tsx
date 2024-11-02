import React, { useState } from 'react';
import PageTemplate from './PageTemplate';

const FrontPage = ({ pageDirectory, showLogoutLink = false }: { pageDirectory: string, showLogoutLink?: boolean }) => {
    const [loading, setLoading] = useState(true);

    const content = (
        <div>
            <a href='/working-page'>Link for a working page</a>
            <a href='/working-page2'>Link for a working page 2</a>
            <a href={`/${pageDirectory}`}>{`Link for a testing page`}</a>
        </div>
    );

    return (
        <>
            <PageTemplate title={`Test application`} content={content} 
                   loading={loading} setLoading={setLoading} showLogoutLink={showLogoutLink}/>
        </>
    );
};

export default FrontPage;