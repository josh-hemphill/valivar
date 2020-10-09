'use strict';
const exp = {};
exp.fs = require('fs');
exp.inquirer = require('inquirer');
exp.utils = require('./utils');
exp.tmp = require('tmp');
exp.crypto = require('crypto');
exp.standardVersion = require('standard-version');
exp.sv = require('semver');
exp.path = require('path');

module.exports = exp;
