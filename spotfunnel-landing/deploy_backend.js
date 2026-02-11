require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const N8N_URL = process.env.N8N_BASE_URL || 'https://spotfunnel.app.n8n.cloud';
const N8N_API_KEY = process.env.N8N_API_KEY;
const VAPI_KEY = process.env.VAPI_PRIVATE_API_KEY;
const SQUAD_ID = process.env.VAPI_SQUAD_ID || '45d201af-9f3b-47e0-a760-a6d176d2e49c';
const WORKFLOW_FILE = path.join(__dirname, 'n8n_vapi_workflow.json');

// --- Helper Functions ---
async function deployN8nWorkflow() {
    console.log('🔄 Deploying n8n Workflow...');

    // Check if workflow file exists in current dir
    let workflowPath = WORKFLOW_FILE;
    if (!fs.existsSync(workflowPath)) {
        console.error(`❌ Workflow file not found at: ${workflowPath}`);
        console.error('   Please ensure n8n_vapi_workflow.json is in the project root.');
        process.exit(1);
    }

    const workflowJson = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));

    try {
        const response = await axios.post(`${N8N_URL}/api/v1/workflows`, {
            name: workflowJson.name,
            nodes: workflowJson.nodes,
            connections: workflowJson.connections,
            settings: {}
        }, {
            headers: { 'X-N8N-API-KEY': N8N_API_KEY }
        });

        const workflowId = response.data.id;
        console.log(`✅ Workflow created! ID: ${workflowId}`);

        // Activate Workflow
        await axios.post(`${N8N_URL}/api/v1/workflows/${workflowId}/activate`, {}, {
            headers: { 'X-N8N-API-KEY': N8N_API_KEY }
        });
        console.log(`✅ Workflow activated!`);

        // Get Webhook URL
        const webhookUrl = `${N8N_URL}/webhook/call-ended`;
        console.log(`🔗 Webhook URL: ${webhookUrl}`);

        return webhookUrl;

    } catch (error) {
        console.error('❌ n8n Deployment Failed:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
}

async function configureVapi(webhookUrl) {
    console.log(`🔄 Configuring Vapi Squad: ${SQUAD_ID}...`);

    try {
        // 1. Fetch Squad to get members
        // API: GET /squad/:id
        const squadResponse = await axios.get(`https://api.vapi.ai/squad/${SQUAD_ID}`, {
            headers: { 'Authorization': `Bearer ${VAPI_KEY}` }
        });

        const members = squadResponse.data.members; // Array of { assistantId: '...', ... }

        if (!members || members.length === 0) {
            console.warn('⚠️ No members found in this Squad.');
            return;
        }

        console.log(`👥 Found ${members.length} assistants in the squad. Updating all...`);
        // 2. Update each Assistant
        for (const member of members) {
            const assistantId = member.assistantId;
            if (!assistantId) continue;

            try {
                await axios.patch(`https://api.vapi.ai/assistant/${assistantId}`, {
                    serverUrl: webhookUrl
                }, {
                    headers: {
                        'Authorization': `Bearer ${VAPI_KEY}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log(`   ✅ Updated Assistant: ${assistantId}`);
            } catch (err) {
                console.error(`   ❌ Failed to update Assistant ${assistantId}:`, err.message);
            }
        }

        console.log(`✨ All Squad members updated with Webhook URL!`);

    } catch (error) {
        console.error('❌ Vapi Configuration Failed:', error.response ? error.response.data : error.message);
    }
}

// --- Main execution ---
(async () => {
    if (!N8N_API_KEY || !VAPI_KEY) {
        console.error('❌ Missing API Keys in .env file.');
        console.error('   Please rename .env.template to .env and fill in N8N_API_KEY and VAPI_PRIVATE_API_KEY');
        process.exit(1);
    }

    const webhookUrl = await deployN8nWorkflow();
    if (webhookUrl) {
        await configureVapi(webhookUrl);
        console.log('\n🚀 DEPLOYMENT COMPLETE 🚀');
        console.log('1. Make a test call to your Vapi assistant.');
        console.log('2. Check n8n Executions to see data flow.');
        console.log('3. Check Supabase table "calls" for new rows.');
    }
})();
