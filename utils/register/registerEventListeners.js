const { readdirSync } = require('fs');
const beats = require("../other/beatsCustomEvent");

const playerEvents = readdirSync('./events/player')
console.log('Loading player events...')

for (const file of playerEvents){
    const event = require(`../../events/player/${file}`);
    console.log(`\t->Loaded event ${file.split('.')[0]}`);
    player.events.on(file.split('.')[0], event.bind(player));
    delete require.cache[require.resolve(`../../events/player/${file}`)];
}



const clientEvents = readdirSync('./events/client').filter(file => file.endsWith('.js'));
console.log(`Loading client events...`);

for (const file of clientEvents) {
    const event = require(`../../events/client/${file}`);
    console.log(`\t->Loaded event ${file.split('.')[0]}`);
    client.on(file.split('.')[0], event.bind(null, client));
    delete require.cache[require.resolve(`../../events/client/${file}`)];
};



console.log('Loading custom events...')
const beatsEvents = readdirSync('./events/beats')
for (const file of beatsEvents){
    const event = require(`../../events/beats/${file}`);
    console.log(`\t->Loaded event ${file.split('.')[0]}`);
    beats.on(file.split('.')[0] , event.bind(null));
    delete require.cache[require.resolve(`../../events/beats/${file}`)];
}