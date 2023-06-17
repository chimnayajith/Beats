const { readdirSync } = require('fs');

const events = readdirSync('./events/').filter(file => file.endsWith('.js'));

console.log(`Loading events...`);

for (const file of events) {
    const event = require(`../events/${file}`);
    console.log(`\t->Loaded event ${file.split('.')[0]}`);
    client.on(file.split('.')[0], event.bind(null, client));
    delete require.cache[require.resolve(`../events/${file}`)];
};


const playerEvents = readdirSync('./player-events')

console.log('Loading player events...')

for (const file of playerEvents){
    const event = require(`../player-events/${file}`);
    console.log(`\t->Loaded event ${file.split('.')[0]}`);
    player.events.on(file.split('.')[0], event.bind(player));
    delete require.cache[require.resolve(`../player-events/${file}`)];
}