export const hostIsSame = ( {rootUrl, url}: {rootUrl: string, url: string} ): boolean => getHost({url: rootUrl}) === getHost({url});

export const getHost = ( {url}: {url: string} ): string => {
    const parts = url.split("/");
    return parts.slice(0, 3).join("/");
};

export const generateRandomString = (): string => Math.floor(Math.random() * Date.now()).toString(36);