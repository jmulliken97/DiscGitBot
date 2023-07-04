require('dotenv').config({ path: './discgitbot.env' });
const Discord = require('discord.js');
const { Octokit } = require("@octokit/rest");
const fs = require('fs');

const client = new Discord.Client({ intents: ["Guilds", "GuildMessages"] });

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

let knownIssues = new Map();

// Load known issues from file
if (fs.existsSync('knownIssues.json')) {
    const issues = JSON.parse(fs.readFileSync('knownIssues.json', 'utf-8'));
    knownIssues = new Map(Object.entries(issues));
}

client.once('ready', async () => {
    console.log('Ready!');

    setInterval(async () => {
        const owner = 'jmulliken97';
        const repo = 'DiscGitBot';

        try {
            const { data } = await octokit.rest.issues.listForRepo({
                owner,
                repo,
            });

            for (const issue of data) {
                if (knownIssues.has(issue.id.toString()) && knownIssues.get(issue.id.toString()).state === issue.state) continue;

                const textChannel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID);
                
                if (!knownIssues.has(issue.id.toString())) {
                    // New issue, create thread and save to known issues
                    const thread = await textChannel.threads.create({
                        name: `Issue: ${issue.title}`,
                        autoArchiveDuration: 1440,
                        reason: `Discussion for issue: ${issue.title}`,
                    });
                    await thread.send(`Issue: ${issue.title}\nURL: ${issue.html_url}\nDescription:\n${issue.body}`);
                    console.log(`Created thread: ${thread.name}`);

                    // Add issue to known issues and save to file
                    knownIssues.set(issue.id.toString(), { state: issue.state, threadId: thread.id });
                } else {
                    // Known issue, check if status has changed
                    const issueData = knownIssues.get(issue.id.toString());
                    if (issueData.state !== issue.state && issue.state === 'closed') {
                        // Issue is closed, archive thread
                        const thread = textChannel.threads.cache.get(issueData.threadId);
                        if (thread) {
                            await thread.setArchived(true);
                            console.log(`Archived thread: ${thread.name}`);
                        }
                        
                        // Update issue status in known issues
                        issueData.state = issue.state;
                        knownIssues.set(issue.id.toString(), issueData);
                    }
                }
            }

            // Save known issues to file
            fs.writeFileSync('knownIssues.json', JSON.stringify(Object.fromEntries(knownIssues)));
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    }, 300000);
});

client.login(process.env.DISCORD_TOKEN);