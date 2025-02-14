// .github/scripts/discordNotify.js
const https = require('https');
const { URL } = require('url');
const fs = require('fs');

async function main() {
  const webhookUrl = process.env.DISCORD_WEBHOOK;
  if (!webhookUrl) {
    console.error('DISCORD_WEBHOOK not set');
    process.exit(1);
  }

  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath) {
    console.error('GITHUB_EVENT_PATH not set');
    process.exit(1);
  }

  const eventData = JSON.parse(fs.readFileSync(eventPath, 'utf8'));
  const commits = eventData.commits;
  if (!commits || commits.length === 0) {
    console.log('No commits found.');
    return;
  }

  const embeds = commits.map(commit => {
    const added = commit.added && commit.added.length ? commit.added.join('\n') : 'None';
    const modified = commit.modified && commit.modified.length ? commit.modified.join('\n') : 'None';
    const removed = commit.removed && commit.removed.length ? commit.removed.join('\n') : 'None';

    return {
      title: `Commit ${commit.id.substring(0, 7)}`,
      url: commit.url,
      description: commit.message,
      color: 0x00FF00,
      fields: [
        {
          name: 'Added',
          value: added,
          inline: true
        },
        {
          name: 'Modified',
          value: modified,
          inline: true
        },
        {
          name: 'Removed',
          value: removed,
          inline: true
        }
      ],
      timestamp: commit.timestamp
    };
  });

  const urlObj = new URL(webhookUrl);

  function sendWebhookEmbeds(embedBatch) {
    return new Promise((resolve, reject) => {
      const payload = JSON.stringify({ embeds: embedBatch });
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || 443,
        path: urlObj.pathname + urlObj.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      };

      const req = https.request(options, res => {
        let data = '';
        res.on('data', chunk => (data += chunk));
        res.on('end', () => {
          if (res.statusCode < 200 || res.statusCode >= 300) {
            return reject(new Error(`Request failed with status ${res.statusCode}: ${data}`));
          }
          resolve();
        });
      });

      req.on('error', reject);
      req.write(payload);
      req.end();
    });
  }

  const batchSize = 10;
  for (let i = 0; i < embeds.length; i += batchSize) {
    const embedBatch = embeds.slice(i, i + batchSize);
    try {
      await sendWebhookEmbeds(embedBatch);
      console.log(`Sent embeds batch ${Math.floor(i / batchSize) + 1}`);
    } catch (err) {
      console.error('Error sending webhook:', err);
    }
  }
}

main();
