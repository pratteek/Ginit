import inquirer from 'inquirer';
import {getCurrentDirectoryBase} from './files.js'

export function askGithubCredentials(){
    const questions = [
        {
            name: 'username',
            type: 'input',
            message: 'Enter your Github username or email address',
            validate: function(value){
                if(value.length){
                    return true;
                }
                else{
                    return 'Please enter your username or email address';
                }
            }
        },
        {
            name: 'password',
            type: 'password',
            message: 'Enter your password',
            validate: function(value){
                if(value.length){
                    return true;
                }
                else{
                    return 'Please enter your password';
                }
            }
        }
    ];
    return inquirer.prompt(questions);
}

export function getTwoFactorAuthetication(){
    const twoFA = {
        name: 'twofactorAuthenticationCode',
        type: 'input',
        message: 'Enter the 2FA code',
        validate: (value)=>{
            if(value.length){
                return true;
            }
            else{
                return 'Please enter the 2FA code';
            }
        }
    }
}

export function askRepoDetails(){
    const argv = require('minimist')(process.argv.slice(2));

    const questions = [
        {
            name: 'name',
            type: 'input',
            message: 'Enter a name for the repository:',
            default: argv._[0] || getCurrentDirectoryBase(),
            validate: function(value){
                if(value.length){
                    return true;
                }
                else{
                    return 'Please Enter a name for the repository';
                }
            }
        },
        {
            name: 'description',
            type: 'input',
            default: argv._[1] || null,
            message: 'Optional'
        },
        {
            name: 'visibility',
            type: 'list',
            message: 'Public or Private',
            choices: ['public', 'private'],
            default: 'public'
        }
    ];

    return inquirer.prompt(questions);
}
export function askIgnoreFiles(filelist){
    const questions = [
      {
        type: 'checkbox',
        name: 'ignore',
        message: 'Select the files and/or folders you wish to ignore:',
        choices: filelist,
        default: ['node_modules', 'bower_components']
      }
    ];
    return inquirer.prompt(questions);
}