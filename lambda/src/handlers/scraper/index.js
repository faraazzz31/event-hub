exports.handler = async (event) => {
    try {
        // Define the array of URLs to scrape
        const urls = [
            'https://web.cs.toronto.edu/news-events/events/sri-seminar-series-rediet-abebe-when-does-resource-allocation-require-prediction',
            'https://web.cs.toronto.edu/news-events/events/toronto-vision-seminar-mohammad-norouzi',
            'https://web.cs.toronto.edu/news-events/events/department-of-computer-science-msc-phd-information-session-november-13-2024',
            'https://web.cs.toronto.edu/news-events/events/sri-seminar-series-aziz-huq-the-geopolitics-of-digital-regulation',
            'https://web.cs.toronto.edu/news-events/events/aria-2024',
            'https://web.cs.toronto.edu/news-events/events/department-of-computer-science-msc-phd-information-session-november-20-2024',
            'https://web.cs.toronto.edu/news-events/events/sri-seminar-series-henry-shevlin-all-too-human-identifying-and-mitigating-ethical-risks-of-social-ai',
            'https://web.cs.toronto.edu/news-events/events/distinguished-lecture-series-toni-pitassi',
            'https://web.cs.toronto.edu/news-events/events/toronto-vision-seminar-dima-damen',
            'https://web.cs.toronto.edu/news-events/events/csc2529-computational-imaging-fall-2024-poster-session',
            'https://web.cs.toronto.edu/news-events/events/department-of-computer-science-msc-phd-information-session-november-27-2024',
            'https://web.cs.toronto.edu/news-events/events/sri-seminar-series-daniel-e-ho-large-legal-fictions-assessing-the-reliability-of-ai-in-legal-research',
            'https://web.cs.toronto.edu/news-events/events/toronto-vision-seminar-roberto-abraham'
        ];

        console.log('Starting to fetch URLs:', urls);

        // Fetch all URLs concurrently using Promise.all
        const results = await Promise.all(
            urls.map(async (url) => {
                try {
                    const response = await fetch(url);
                    console.log(`Fetch response status for ${url}:`, response.status);
                    const html = await response.text();
                    return {
                        url,
                        success: true,
                        html
                    };
                } catch (error) {
                    console.error(`Error fetching ${url}:`, error);
                    return {
                        url,
                        success: false,
                        error: error.message
                    };
                }
            })
        );

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: true,
                results
            })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: false,
                error: error.message
            })
        };
    }
};