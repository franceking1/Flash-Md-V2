import WebSocket from 'ws';

async function intelQuery(taskPrompt) {
    if (!taskPrompt) throw new Error('Missing task prompt.');

    const connection = new WebSocket('wss://searc.ai/ws');
    const results = {
        topic: taskPrompt,
        breakdowns: [],
        summary: '',
        references: [],
        visuals: [],
        attachments: {},
        stats: {
            cost: null,
            engine: null,
            pages: 0,
            images: 0
        }
    };

    return new Promise((resolve, reject) => {
        connection.on('open', () => {
            connection.send('start ' + JSON.stringify({
                task: taskPrompt,
                report_type: 'research_report',
                report_source: 'web',
                tone: 'Objective',
                query_domains: []
            }));
        });

        connection.on('message', (payload) => {
            let data;

            try {
                data = JSON.parse(payload);
            } catch (e) {
                return;
            }

            if (data.type === 'logs') {
                switch (data.content) {
                    case 'subqueries':
                        if (data.metadata) results.breakdowns.push(...data.metadata);
                        break;
                    case 'added_source_url':
                        if (data.metadata) results.references.push(data.metadata);
                        break;
                    case 'agent_generated':
                        if (data.output) results.stats.engine = data.output;
                        break;
                    case 'research_step_finalized':
                        const cost = data.output?.match(/\$([0-9.]+)/);
                        if (cost) results.stats.cost = parseFloat(cost[1]);
                        break;
                    case 'scraping_content':
                        const pageCount = data.output?.match(/(\d+) pages/);
                        if (pageCount) results.stats.pages += parseInt(pageCount[1]);
                        break;
                    case 'scraping_images':
                        const imageCount = data.output?.match(/(\d+) new images/);
                        if (imageCount) results.stats.images += parseInt(imageCount[1]);
                        break;
                }
            }

            if (data.type === 'images' && data.content === 'selected_images') {
                if (data.metadata) results.visuals.push(...data.metadata);
            }

            if (data.type === 'report') {
                results.summary += data.output || '';
            }

            if (data.type === 'path') {
                const base = 'https://searc.ai/';
                const mapped = {};

                for (const [label, path] of Object.entries(data.output)) {
                    mapped[label] = base + path;
                }

                results.attachments = mapped;

                connection.close();
                return resolve({
                    topic: results.topic,
                    breakdowns: results.breakdowns,
                    summary: results.summary,
                    references: results.references,
                    visuals: results.visuals,
                    attachments: results.attachments,
                    stats: results.stats
                });
            }
        });

        connection.on('error', (err) => {
            connection.close();
            reject(err);
        });

        connection.on('close', () => {});
    });
}

export { intelQuery }; 
