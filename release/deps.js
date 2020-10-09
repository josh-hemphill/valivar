'use strict';
const exp = {};
exp.path = require('path');
exp.os = require('os');
exp.fs = require('fs');
exp.inquirer = require('inquirer');
exp.utils = require('utils');
exp.rawExec = require('child_process').exec;
exp.exec = exp.util.promisify(exp.rawExec);
exp.tmp = require('tmp');
exp.crypto = require('crypto');
exp.standardVersion = require('standard-version');
exp.sv = require('semver');

module.exports = exp;
