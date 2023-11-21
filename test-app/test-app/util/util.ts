export const fetchData = async (apiHttpCode: string, setLoading: (loading: boolean) => void) => {
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