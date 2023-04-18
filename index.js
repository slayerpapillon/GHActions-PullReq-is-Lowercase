const core = require('@actions/core');
const github = require('@actions/github');
const { glob } = require('glob');
const process = require('process');

const main = async () => {
	try {
		const owner = core.getInput('owner', { required: true });
		const repo = core.getInput('repo', { required: true });
		const pr_number = core.getInput('pr_number', { required: true });
		const token = core.getInput('token', { required: true });
		
		let selectpath = process.argv[2];
		if (selectpath === undefined) {
			selectpath = process.cwd();
		}
		console.log("Path to search in is -> " + selectpath);

		let options = {
			cwd: selectpath
		}
		
		const files = await glob('**/*.*', options);

	  	let filesNotInLowerCase = [];
		files.forEach(file => {
			const isit = isLowerCase(file);
			if (!isit) {
				// console.log(file + " is Not Lowercase!");
				filesNotInLowerCase.push(file);
			}
			});

		
		const octokit = new github.getOctokit(token);
		
		if (filesNotInLowerCase.length != 0) {
			const statusInfo = "Some files are not in lowercase\n" + filesNotInLowerCase.join("\n");
			const { data: createdReview } = await octokit.rest.pulls.createReview({
				owner,
				repo,
				pull_number: pr_number,
				event: 'REQUEST_CHANGES',
				body : statusInfo
				});
			
			core.setFailed(statusInfo);
		}
		else {
			const statusInfo = "All files lowercase.";
			const { data: createdReview } = await octokit.rest.pulls.createReview({
        	owner,
			repo,
			pull_number: pr_number,
			event: 'APPROVE',
			body : statusInfo
			});

			core.notice(statusInfo);
		}
  }
	catch (error) {
		core.setFailed(error.message);
  }
}

function isLowerCase (input) {  
  return input === String(input).toLowerCase()
}

// Call the main function to run the action
main();