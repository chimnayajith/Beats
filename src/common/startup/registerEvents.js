const { readdirSync } = require('fs');
const beats = require("../utils/other/beatsCustomEvent");

module.exports = async()=> {
    const playerEvents = readdirSync('./src/events/player')
    console.log('Loading player events...')

    for (const file of playerEvents){
        const event = require(`../../events/player/${file}`);
        console.log(`\t->Loaded event ${file.split('.')[0]}`);
        player.events.on(file.split('.')[0], event.bind(player));
        delete require.cache[require.resolve(`../../events/player/${file}`)];
    }


    const processEvents = readdirSync('./src/events/process').filter(file => file.endsWith('.js'));
    console.log(`Loading process events...`);

    for (const file of processEvents) {
        const event = require(`../../events/process/${file}`);
        console.log(`\t->Loaded process event ${file.split('.')[0]}`);
        process.on(file.split('.')[0], event.bind(null, this.arguments));
        delete require.cache[require.resolve(`../../events/process/${file}`)];
    };


    const clientEvents = readdirSync('./src/events/client').filter(file => file.endsWith('.js'));
    console.log(`Loading client events...`);

    for (const file of clientEvents) {
        const event = require(`../../events/client/${file}`);
        console.log(`\t->Loaded client event ${file.split('.')[0]}`);
        client.on(file.split('.')[0], event.bind(null, client));
        delete require.cache[require.resolve(`../../events/client/${file}`)];
    };

    const clientRestEvents = readdirSync('./src/events/client_rest').filter(file => file.endsWith('.js'));
    console.log(`Loading client.rest events...`);

    for (const file of clientRestEvents) {
        const event = require(`../../events/client_rest/${file}`);
        console.log(`\t->Loaded clietn rest event ${file.split('.')[0]}`);
        client.rest.on(file.split('.')[0], event.bind(null, client));
        delete require.cache[require.resolve(`../../events/client_rest/${file}`)];
    };

    const beatsEvents = readdirSync('./src/events/beats')
    console.log('Loading custom events...');
    for (const file of beatsEvents){
        const event = require(`../../events/beats/${file}`);
        console.log(`\t->Loaded event ${file.split('.')[0]}`);
        beats.on(file.split('.')[0] , event.bind(null));
        delete require.cache[require.resolve(`../../events/beats/${file}`)];
    }
}