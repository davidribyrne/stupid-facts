var YAML = require('yamljs');
var data = YAML.load('./node_modules/stupid-facts/facts.yml');
var local = YAML.load('local-facts.yml');

function randomRange(low, high)
{
	return Math.floor(Math.random() * (high - low) + low);
}

function randomElement(array)
{
	var index = Math.floor(Math.random() * array.length);
	return array[index];
}

module.exports = Facts;
function Facts()
{
	for (var type in local)
	{
		data[type].concat(local[type]);
	}
}

Facts.prototype.generateFact = function()
{
	var text = randomElement(data.text);
	for (var type in data)
	{
		if (type == 'text') continue;
		var typeRe = new RegExp("\{" + type + "\}", "g");	
		text = text.replace(typeRe, randomElement(data[type]));
	}
	var re = new RegExp("\{oldyear\}");
	text = text.replace(re, randomRange(1930,1990));
	return text;
};
