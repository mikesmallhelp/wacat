export const fetchData = async (apiHttpCode: string, setLoading: Function) => {
    try {
        setLoading(true);
        const response = await fetch('/api/http-' + apiHttpCode);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        setLoading(false);
    }
};