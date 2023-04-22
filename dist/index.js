/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 25:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 334:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 581:
/***/ ((module) => {

module.exports = eval("require")("glob");


/***/ }),

/***/ 282:
/***/ ((module) => {

"use strict";
module.exports = require("process");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(25);
const github = __nccwpck_require__(334);
const { glob } = __nccwpck_require__(581);
const process = __nccwpck_require__(282);

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
				filesNotInLowerCase.push(file);
			}
			});

		
		const octokit = new github.getOctokit(token);

		let bodyStatus = String("# Pull Request is Lowercase Status.\n\n");
		if (filesNotInLowerCase.length != 0) {
			const separator = "\n📄 ";
			const fileOrFiles = filesNotInLowerCase.length == 1 ? ' file is ' : ' files are ';
			bodyStatus += "❌ " + filesNotInLowerCase.length + fileOrFiles + " not in lowercase." + separator + filesNotInLowerCase.join(separator);
			const { data: createdReview } = await octokit.rest.pulls.createReview({
				owner,
				repo,
				pull_number: pr_number,
				event: 'REQUEST_CHANGES',
				body : bodyStatus
				});
			
			core.notice(statusInfo);
		}
		else {
			bodyStatus += "✅ All files lowercase.";
			const { data: createdReview } = await octokit.rest.pulls.createReview({
        	owner,
			repo,
			pull_number: pr_number,
			event: 'APPROVE',
			body : bodyStatus
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
})();

module.exports = __webpack_exports__;
/******/ })()
;