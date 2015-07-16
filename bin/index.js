#!/usr/bin/env node

var fs   = require('fs'),
path = require('path'),
yaml = require('js-yaml'),
readFile = require('fs-readfile-promise'),
write = require('fs-writefile-promise');
require('colors')
// -----------------------------------------------------------------------------
var config;
try {
	config = require(path.join(process.cwd(), process.argv[2]));
} catch(e) {
	throw new Error(('Problem loading the config file:').red + '\n' + e);
}

// default type to json.
var type =  config.type === 'xml' ? config.type : 'json';

function getMessages() {
	processMessageFiles(config.supportedLocales)
	.then(writeFile).catch(function (err) {
		console.error((err.message).red);
		throw err;
	});
}

function processMessageFiles(locales) {
	return Promise.all(locales.map(function (locale) {
		var messagesFile = path.join(process.cwd(), config.src, locale) + '.yaml';
		return readFile(messagesFile, 'utf8').then(function (contents) {
			return {
				locale  : locale,
				messages: yaml.safeLoad(contents)
			};
		});
	}));
}

function writeFile(entries) {
	entries.reduce(function (prevEntry, entry) {
		var content;
		if(type === 'xml') {
			content = toXml(entry.messages);
		} else {
			content = JSON.stringify(entry.messages, null, 2)
		}
		require('mkdirp').sync(path.join(process.cwd(), config.dest));
		write(path.join(process.cwd(), config.dest, entry.locale + '.' + type), content, 'utf-8' )
		.then(function (filename) {
			console.log(('Done: ' + filename).green);
		}).catch(function (err) {
			console.error((err.message).red)
		})
	}, {});
}

function toXml(json) {
	var arr = [];
	Object.keys(json).forEach(function(item) {
		arr.push('  <string name="' + item + '">' + json[item] + '</string>\n');
	});
	return "<resource>\n" + arr.join('') + "</resource>"
}
module.exports = getMessages();
