#!/usr/bin/env casperjs

var casper = require('casper').create();
var mouse = require('mouse').create(casper);

var query = {
	from: null,
	to: null,
	departs: null
};

var ui = {
	from: 'input[name=st0]',
	to: 'input[name=st1]',
	departs: 'input#date0',
	submit: '#Submit',
	results: "table.trlist"
};

function usage() {
	console.info('Usage: rzd.js <from> <to> <date>');
}

if (casper.cli.args.length < 3) {
	console.error('Not enough arguments!');
	usage();
	casper.exit(1);
}

query.from = casper.cli.args[0].toUpperCase();
query.to = casper.cli.args[1].toUpperCase();
query.departs = casper.cli.args[2];

casper.start('http://pass.rzd.ru', function() {
	this.echo('RZD loaded!', 'GREEN_BAR');
});

casper.then(function() {
	this.sendKeys(ui.from, query.from, {keepFocus: false});
	this.sendKeys(ui.to, query.to, {keepFocus: false});

	this.click(ui.departs);
	this.sendKeys(ui.departs, 'a', {modifiers: 'ctrl', keepFocus: true});
	this.sendKeys(ui.departs, this.page.event.key.Delete, {keepFocus: true});
	this.sendKeys(ui.departs, query.departs);
});

casper.then(function() {
	this.click(ui.submit);
});

casper.then(function () {
	this.waitForSelector(ui.results, function() {
		this.echo('Number of variants: '+ this.evaluate(function() {
			return $('.trlist__trlist-row.trslot').length;
		}), 'RED_BAR');
		this.capture('rzd-results.png', undefined, {format: 'png'});
	}, function() {
		this.echo('Results not found!', 'ERROR');
		this.capture('rzd-error.png', undefined, {format: 'png'});
	}, 10000);
});

casper.run();
