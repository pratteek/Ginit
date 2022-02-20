
import { askGithubCredentials, getTwoFactorAuthetication } from './inquirer.js'
import CLI from 'clui';
import Configstore from 'configstore';
import Octokit from '@octokit/rest';
const Spinner = CLI.Spinner;
import { createBasicAuth } from "@octokit/auth-basic";



const conf = new Configstore("Ginit");

let octokit;

export function getInstance(){ return octokit; }
export function getStoredGithubToken(){ return conf.get('github.token') }
export function githubAuth(token){
        octokit = new Octokit({
          auth: token
        });
}
export async function getPersonalToken(){
        const credentials = await askGithubCredentials();
        const status = new Spinner('Authenticating you, Please wait...');

        status.start();

        const auth = createBasicAuth({
            username: credentials.username,
            password: credentials.password,
            async on2Fa(){
                status.stop();
                const res = await getTwoFactorAuthetication();
                status.start();
                return res.twoFactorAuthenticationCode;
            },
            token: {
                scopes: ['user', 'public_repo', 'repo', 'repo:status'],
                note: 'ginit, the command line tool for initializing Git repos'
            }
        });
        try{
            const res = await auth();
            if(res.token){
                conf.set('github.token',res.token);
                return res.token;
            }
            else{
                throw new Error('Github token was not found int the response');
            }
        }
        finally{
            status.stop();
        }
}
    




