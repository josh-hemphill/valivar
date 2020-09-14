'use strict';
const exp = {};
exp.path = require('path');
exp.os = require('os');
exp.fs = require('fs');
exp.inquirer = require('inquirer');
exp.util = require('util');
exp.rawExec = require('child_process').exec;
exp.exec = exp.util.promisify(exp.rawExec);
exp.conventionalGithubReleaser = exp.util.promisify(require('conventional-github-releaser'));
exp.tmp = require('tmp');
exp.SSHConfig = require('ssh-config');
exp.crypto = require('crypto');

module.exports = exp;
