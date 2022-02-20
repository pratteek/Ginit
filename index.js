import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import {directoryExists} from './lib/files.js';
import {getStoredGithubToken, getPersonalToken } from './lib/github.js';


clear();

console.log(
    chalk.blue(
        figlet.textSync('Ginit',{horizontalLayout:'full'})
    )
);
if(directoryExists('.git')){
    console.lof(chalk.red('Already a git repository'));
    process.exit();
}

const run = async ()=>{
    try {
        // Retrieve & Set Authentication Token
        const token = await getGithubToken();
        github.githubAuth(token);
    
        // Create remote repository
        const url = await repo.createRemoteRepo();
    
        // Create .gitignore file
        await repo.createGitignore();
    
        // Set up local repository and push to remote
        await repo.setupRepo(url);
    
        console.log(chalk.green('All done!'));
      } catch(err) {
          if (err) {
            switch (err.status) {
              case 401:
                console.log(chalk.red('Couldn\'t log you in. Please provide correct credentials/token.'));
                break;
              case 422:
                console.log(chalk.red('There is already a remote repository or token with the same name'));
                break;
              default:
                console.log(chalk.red(err));
            }
          }
      }
};
const getGithubToken = async () => {
    // Fetch token from config store
    let token = getStoredGithubToken();
    if(token) {
      return token;
    }
  
    // No token found, use credentials to access GitHub account
    token = await getPersonalToken();
  
    return token;
};

run();