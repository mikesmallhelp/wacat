import React, { useState } from 'react';
import PageTemplate from './PageTemplate';

const SimpleFrontPage = () => {
    const [loading, setLoading] = useState(true);

    const content = (
        <div>
            <a href='/different-types-inputs-and-button-push-causes-error-simple'>Link for a testing page</a>
        </div>
    );

    return (
        <>
            <PageTemplate title={`Test application`} content={content} 
                   loading={loading} setLoading={setLoading} />
        </>
    );
};

export default SimpleFrontPage;