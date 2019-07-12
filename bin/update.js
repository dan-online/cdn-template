const util = require("util");
const exec = util.promisify(require("child_process").exec);
const inquirer = require("inquirer");
const log = require("../src/tests/logger");

async function run(code) {
	var r = await exec(code).catch((err) => {
        if(err) {
            var r = {type: "error", stderr:err};
        }
    });
	if(!r){
        r = {stderr: r};
    } 
	if (r.stderr) {
        return {type: "error", output: r.stderr};
  	} else {
  		return {type: "success", output: r.stdout};
  	}
}

module.exports.update = async function () {
    await run("git fetch github");
    await run("git remote add github https://github.com/MayorChano/NodeJS");
    async function file(file) {
        let check = await run("git diff github/master --name-only " + file);
        if(check.output || check.type === "error") {
            var questions = [{
                    type: "list",
                    name: "update",
                    message: "Would you like to update " + file + "?",
                    choices: ["Yes", "No"],
                }];
            const answers = await inquirer.prompt(questions);
            if(answers["update"] === "Yes") {
                await run("git checkout github/master " + file);
            }
        }
    }

    await file("./bin/www");
    await file("./src/tests/setup.js");
    await file("./src/tests/logger.js");
    await file("./bin/update.js");
    log("update");
    //await run("git checkout origin/master " + __dirname + "/bin/www")
};