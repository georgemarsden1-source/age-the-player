import { Octokit } from '@octokit/rest';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

async function main() {
  console.log("Getting GitHub access token...");
  const accessToken = await getAccessToken();
  const octokit = new Octokit({ auth: accessToken });

  console.log("Getting authenticated user...");
  const { data: user } = await octokit.users.getAuthenticated();
  console.log(`Logged in as: ${user.login}`);

  const repoName = "age-the-player";
  
  console.log(`\nChecking if repository '${repoName}' exists...`);
  
  try {
    await octokit.repos.get({
      owner: user.login,
      repo: repoName
    });
    console.log(`Repository already exists: https://github.com/${user.login}/${repoName}`);
  } catch (error: any) {
    if (error.status === 404) {
      console.log("Repository doesn't exist, creating...");
      const { data: repo } = await octokit.repos.createForAuthenticatedUser({
        name: repoName,
        description: "Age The Player - Football Quiz Game",
        private: false,
        auto_init: false
      });
      console.log(`Created repository: ${repo.html_url}`);
    } else {
      throw error;
    }
  }

  console.log(`\n=== Next Steps ===`);
  console.log(`Repository URL: https://github.com/${user.login}/${repoName}`);
  console.log(`\nRun these commands to push your code:`);
  console.log(`  git remote add github https://github.com/${user.login}/${repoName}.git`);
  console.log(`  git push github main`);
}

main().catch(console.error);
