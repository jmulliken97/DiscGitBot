require('dotenv').config({ path: './discgitbot.env' });
const Discord = require('discord.js');
const { Octokit } = require("@octokit/rest");
const fs = require('fs');

const client = new Discord.Client({ intents: ["Guilds", "GuildMessages"] });

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

let knownIssues = new Set();

// Load known issues from file
if (fs.existsSync('knownIssues.txt')) {
    const issueIds = fs.readFileSync('knownIssues.txt', 'utf-8').split('\n');
    knownIssues = new Set(issueIds);
}

client.once('ready', async () => {
    console.log('Ready!');

    setInterval(async () => {
        const owner = 'jmulliken97';
        const repo = 'backendonly';

        try {
            const { data } = await octokit.rest.issues.listForRepo({
                owner,
                repo,
            });

            for (const issue of data) {
                if (knownIssues.has(issue.id)) continue;

                // Add issue to known issues and save to file
                knownIssues.add(issue.id);
                fs.appendFileSync('knownIssues.txt', `${issue.id}\n`);

                const textChannel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID);
                const thread = await textChannel.threads.create({
                    name: `Issue: ${issue.title}`,
                    autoArchiveDuration: 1440,
                    reason: `Discussion for issue: ${issue.title}`,
                });

                await thread.send(`Issue: ${issue.title}\nURL: ${issue.html_url}\nDescription:\n${issue.body}`);
                console.log(`Created thread: ${thread.name}`);
            }
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    }, 300000);
});

client.login(process.env.DISCORD_TOKEN);

