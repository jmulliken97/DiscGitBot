# Discord Bot - Issue Tracker

This is a Discord bot designed to track and notify new issues created on a GitHub repository. The bot periodically checks for new issues in a specified repository and creates discussion threads in a designated Discord text channel for each new issue found.

## Prerequisites

To run this bot, you need the following:

- Node.js installed on your machine
- A Discord bot token
- A GitHub personal access token

## Installation

1. Clone this repository to your local machine.
2. Install the required dependencies by running the following command in the project directory:

   ```
   npm install
   ```

3. Create a `.env` file in the root directory and provide the necessary environment variables:

   ```
   DISCORD_TOKEN=your_discord_bot_token
   DISCORD_CHANNEL_ID=your_discord_text_channel_id
   GITHUB_TOKEN=your_github_personal_access_token
   ```

4. If you haven't already, create a file named `knownIssues.txt` in the root directory. This file will store the IDs of known issues to prevent duplicate notifications.

## Usage

To start the bot, run the following command:

```
node bot.js
```

The bot will log in to Discord using the provided bot token and start monitoring the specified GitHub repository for new issues. Every 5 minutes, it will check for new issues and create discussion threads in the designated Discord text channel for any new issues found.

## Contributing

If you encounter any issues or have suggestions for improvements, feel free to submit a pull request or open an issue in the GitHub repository.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Discord.js](https://discord.js.org/) - Discord API library for Node.js
- [Octokit](https://octokit.github.io/rest.js/v18) - GitHub REST API client for JavaScript

---
Note: Remember to replace `your_discord_bot_token`, `your_discord_text_channel_id`, and `your_github_personal_access_token` with your actual tokens and IDs in the `.env` file.
