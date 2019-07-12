const chalk = require("chalk");
const logged = [{name: "Initialize", value: false}, 
                {name: "Port", value: false}, 
                {name: "Server", value: false}, 
                {name: "Routes", value: false}, 
                {name: "Database", value: false}
            ];
        
const config = require("../../package.json");
if(config.update.toLowerCase() === "yes") {
    logged.push({name: "Update", value: false});
}
process.stdout.moveCursor(0, -1);
process.stdout.clearLine();
var errors = [];
var test = false; 
var okOn = "Online";
var errOff = "Starting";
var date;
if(process.argv.find((x) => x === "test")) {
    test = true;
    okOn = "OK";
}

function log(change, err) {
    if(!date) {
        date = new Date();
    }
    if(err) {
        errOff = "Error";
    }
    console.clear();
    if(logged.find((x) => x.name.toLowerCase() === change) && !err) {
        logged.find((x) => x.name.toLowerCase() === change).value = true;
    }
    if(config.log === "tech") {
    //logged.forEach(l => process.stdout.clearLine());
    logged.forEach((l) => {
        process.stdout.moveCursor(0, -1);
        process.stdout.clearLine();
    });
    logged.forEach((l) => {
        if(l.value === true) {
            process.stdout.clearLine(); process.stdout.write(chalk.black.bgGreen.bold(" " + okOn + " ") + " " + l.name + "\n");
        } else {
            process.stdout.clearLine(); process.stdout.write(chalk.black.bgRed.bold(" " + errOff + " ") + " " + l.name + "\n");
        }
    });
    if(err) {
        if(!err.adv) {
            err.adv = "";
        }
        if(test !== true) {
            console.error("\nError: "  + err + " " + err.adv);
            return process.exit(0);
        } else {
            logged.find((x) => x.name.toLowerCase() === change.toLowerCase()).value = "err";
            errors.push(err);
        }
    }
    if(logged.filter((x) => x.value === false).length === 0) {
        if(errors.length > 0) {
            errors.forEach((e) => console.error("\nError: "  + e + " " + e.adv));
            return process.exit(1);
        }
        if(test) {
            process.stdout.write(chalk.bold.green("\nAll checks finished in " + (Math.round(((new Date() - date) / 1000) * 100) /100) + " seconds.\n\n"));
            return process.exit(0);
        }
        process.stdout.write(`\n${config.name}-${config.version} listening on port ${config.port}\n`);
        }
    } else {
        if(logged.filter((x) => x.value === false).length === 0) {
            process.stdout.write(`\n${config.name}-${config.version} listening on port ${config.port}\n`);   
        }
    }
}

if(test) {
    logged.push({name: "Syntax", value: false});
    require("child_process").exec("find .  -path ./node_modules -prune -o -path ./.history -prune -o -path ./data -prune -o -name \"*.js\" -exec node -c {} \\;", function(err, out) {
        if(err) {
            log("syntax", err);
        } else {
            log("syntax");
        }
    });
}

log("start");


module.exports = log;