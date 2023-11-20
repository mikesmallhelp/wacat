import React, { useState } from 'react';
import PageTemplate from './PageTemplate';
import { fetchData } from '../util/util';

const WorkingPage = ({ title }: { title: string }) => {
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState('');

    const handleButtonClick = async () => {
        try {
            await fetchData('200', setLoading);
            setResult('Find 3545 rows');
        } catch (error) {
            console.error(error);
        }
    };

    const PageContent = (
        <div>
            <input />

            <select name="someValues" id="someValues">
                <option value="aaa">aaa</option>
                <option value="bbb">bbb</option>
            </select>

            <button onClick={handleButtonClick}>Normal button</button>

            <div>{result}</div>

            <a href='/'>Back to main page</a>
            <a href='https://github.com/mikesmallhelp'>Github - don't go here</a>
        </div>
    );

    return (
        <>
            <PageTemplate title={title} content={PageContent} loading={loading} setLoading={setLoading} />
        </>
    );
};

export default WorkingPage;
