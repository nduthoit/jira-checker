const getLinks = require('./lib/get-links')

module.exports = (robot) => {
  // Your code here
  robot.log('Yay, the app was loaded!')

  robot.on(['pull_request.opened', 'pull_request.edited', 'pull_request.reopened'], checkJIRALinks)

  robot.log('Registered event listener')

  async function checkJIRALinks (context) {
    robot.log('checkJIRALinks')
    const {title, html_url: htmlUrl, head} = context.payload.pull_request
    const hasJiraLink = context.payload.pull_request.body.includes('https://waveaccounting.atlassian.net/browse/')
    const status = hasJiraLink ? 'success' : 'failure'
    console.log(`Updating PR "${title}" (${htmlUrl}): ${status}`)
    context.github.repos.createStatus(context.repo({
      sha: head.sha,
      state: status,
      target_url: 'https://github.com/apps/jira-checker',
      description: hasJiraLink ? 'Has link to JIRA issue' : 'missing link to JIRA issue' ,
      context: 'JIRA issue checker'
    }))

  }
  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
