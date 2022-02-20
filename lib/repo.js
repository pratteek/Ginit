import CLI from 'clui';
import fs from'fs';
import git from 'simple-git';
const Spinner = CLI.Spinner;
import touch from "touch";
import _ from'lodash';

import inquirer from './inquirer';
import gh from './github';


export async function createRemoteRepo(){
    const github = gh.getInstance();
    const answers = await inquirer.askRepoDetails();

    const data = {
      name: answers.name,
      description: answers.description,
      private: (answers.visibility === 'private')
    };

    const status = new Spinner('Creating remote repository...');
    status.start();

    try {
      const response = await github.repos.createForAuthenticatedUser(data);
      return response.data.ssh_url;
    } finally {
      status.stop();
    }
}
export async function createGitignore(){
    const filelist = _.without(fs.readdirSync('.'), '.git', '.gitignore');
  
    if (filelist.length) {
      const answers = await inquirer.askIgnoreFiles(filelist);
  
      if (answers.ignore.length) {
        fs.writeFileSync( '.gitignore', answers.ignore.join( '\n' ) );
      } else {
        touch( '.gitignore' );
      }
    } else {
      touch('.gitignore');
    }
}
export async function  setupRepo(url){
    const status = new Spinner('Initializing local repository and pushing to remote...');
    status.start();
  
    try {
      git.init()
        .then(git.add('.gitignore'))
        .then(git.add('./*'))
        .then(git.commit('Initial commit'))
        .then(git.addRemote('origin', url))
        .then(git.push('origin', 'master'));
    } finally {
      status.stop();
    }
}
