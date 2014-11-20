var query = {
	from: 'МОСКВА',
	to: 'ВОРКУТА',
	departs: '29.12.2014',
	returns: null
};

var ui = {
	from: 'input[name=st0]',
	to: 'input[name=st1]',
	departs: 'input#date0',
	returns: 'input#date1',
	submit: '#Submit',
	results: "table.trlist"
};

var mouse = require("mouse").create(casper);

casper.test.begin('Tickets query', function (test) {
	/* Загружаем страницу */
	casper.start('http://pass.rzd.ru/', function() {
		this.echo('RZD loaded!', 'GREEN_BAR');
	});

	/* Проверяем наличие необходимых элементов форм поиска билетов */
	casper.then(function() {
		this.echo('Checking if form elements exist…', 'TRACE');
		test.assertExists(ui.from, 'Trip "from" input found');
		test.assertExists(ui.to, 'Trip "to" input found');

		test.assertExists(ui.departs, 'Date "departs" input found');
		test.assertExists(ui.returns, 'Date "returns" input found');
	});

	/* Заполняем поля */
	casper.then(function() {
		this.echo('Filling search form…', 'TRACE');

		this.sendKeys(ui.from, query.from, {keepFocus: false});
		this.sendKeys(ui.to, query.to, {keepFocus: false});

		this.click(ui.departs);
		this.sendKeys(ui.departs, 'a', {modifiers: 'ctrl', keepFocus: true});
		this.sendKeys(ui.departs, this.page.event.key.Delete, {keepFocus: true});
		this.sendKeys(ui.departs, '29.12.2014');
		
	});

	/* Проверяем заполненность полей */
	casper.then(function() {
		this.echo('Checking form filling…', 'TRACE');

		test.assertEquals(this.evaluate(function(from) {
			return $(from).val();
		}, ui.from), query.from, 'Field "from" has requested value');
		test.assertEquals(this.evaluate(function(to) {
			return $(to).val();
		}, ui.to), query.to, 'Field "to" has requested value');

		test.assertMatch(this.evaluate(function(departs) {
			return $(departs).val();
		}, ui.departs), new RegExp('^'+ query.departs), 'Field "departs" has requested value');
	});

	casper.run(function() {
		test.done();
	});
});