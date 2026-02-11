require('dotenv').config();
const axios = require('axios');

const N8N_URL = process.env.N8N_BASE_URL || 'https://spotfunnel.app.n8n.cloud';
const N8N_API_KEY = process.env.N8N_API_KEY;
const WORKFLOW_NAME = "SpotFunnel Vapi Handler";

(async () => {
    try {
        console.log(`🔍 Searching for workflows named: "${WORKFLOW_NAME}"...`);

        const response = await axios.get(`${N8N_URL}/api/v1/workflows`, {
            headers: { 'X-N8N-API-KEY': N8N_API_KEY }
        });

        const workflows = response.data.data.filter(w => w.name === WORKFLOW_NAME);

        if (workflows.length <= 1) {
            console.log('✅ No duplicates found.');
            return;
        }

        // Sort by ID (usually newer IDs are higher/later, but creation date is better if available)
        // n8n IDs are strings, but we can assume the last one created is the one we want to keep if we trust the order or timestamps.
        // Let's rely on createdAt if available, else standard array order from API usually puts newest last/first? 
        // Best bet: Sort by createdAt desc.

        workflows.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const [newest, ...others] = workflows;
        console.log(`✨ Keeping newest workflow: ${newest.id} (Created: ${newest.createdAt})`);

        for (const wf of others) {
            console.log(`🗑️ Deleting duplicate: ${wf.id} (Created: ${wf.createdAt})`);
            try {
                await axios.delete(`${N8N_URL}/api/v1/workflows/${wf.id}`, {
                    headers: { 'X-N8N-API-KEY': N8N_API_KEY }
                });
                console.log('   ✅ Deleted.');
            } catch (err) {
                console.error(`   ❌ Failed to delete: ${err.message}`);
            }
        }
        console.log('\n🧹 Cleanup complete!');

    } catch (error) {
        console.error('❌ Error:', error.response ? error.response.data : error.message);
    }
})();
