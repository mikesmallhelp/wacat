import React, { useState, useEffect } from 'react';
import PageTemplate from './PageTemplate';
import { fetchData } from '../util/util';
import Router from "next/router";

const WorkingPage = ({ title, showVercelButton = false, showInfoButton = false }:
    { title: string, showVercelButton?: boolean, showInfoButton?: boolean }) => {
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

    const handleButtonClickToInfoPage = async () => {
        try {
            await Router.push("/info-page");
        } catch (error) {
            console.error(error);
        }
    };

    const handleVercelButtonClick = async () => {
        try {
            await Router.push('https://mikesmallhelp-test-application.vercel.app/');
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

            <button disabled>Disabled button</button>

            <button onClick={handleButtonClick}>Normal button</button>

            <div>{result}</div>

            <a href='/'>Back to main page</a>
            <a href='https://github.com/mikesmallhelp'>Github - don't go there</a>
            {showVercelButton && (
                <input type="button" value="Move to Vercel app" onClick={handleVercelButtonClick} />
            )}

            {showInfoButton && (
                <>
                    <input type="button" value="Move to an info page" onClick={handleButtonClickToInfoPage} />
                </>
            )}
        </div>
    );

    useEffect(() => {
        console.warn("Be careful!");
    }, []);

    return (
        <>
            <PageTemplate title={title} content={PageContent} loading={loading} setLoading={setLoading} />
        </>
    );
};

export default WorkingPage;
