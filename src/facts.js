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
        if (type in data)
        {
            data[type] = data[type].concat(local[type]);
        }
        else
        {
            data[type] = local[type];
        }
    }
}

Facts.prototype.generateFact = function ()
{
    var text = randomElement(data.text);
    var changed = true;
    var usedItems = [];
    while (changed)
    {
        changed = false;
        for (var type in data)
        {
            if (type == 'text')
            {
                continue;
            }
            while (text.search("\{" + type + "\}") >= 0)
            {
                var replacement;
                var checks = 0;
                do
                {
                    replacement = randomElement(data[type]);
                    checks++;
                }
                while (replacement in usedItems || checks > 20);
                usedItems.push(replacement);
                text = text.replace("\{" + type + "\}", replacement);
                changed = true;
            }
        }
    }
    var re = new RegExp("\{oldyear\}");
    text = text.replace(re, randomRange(1960, 1990));
    text = text.substring(0, 1).toUpperCase() + text.substring(1, text.length);

    return text;
};
