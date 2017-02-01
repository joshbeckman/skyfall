
module.exports = {
    events: fake_events
};

function fake_events(app) {
    setInterval(function fake_events_interval() {
        console.info('GENERATING FAKE EVENT DATA!!!');
        app.io.emit('SKYFALL', {
            created_at: new Date(),
            device_id: 'foobar',
            location: 'SKYFALL',
            data: [
                { unit: 'kPa', value: Math.random() * 1000, source: 'BARORESISTOR' },
                { unit: 'C', value: Math.random() * 100, source: 'THERMORESISTOR' },
                { unit: 'F', value: Math.random() * 100, source: 'THERMORESISTOR' },
                { unit: 'RL', value: Math.random() * 1000, source: 'PHOTORESISTOR' },
                { unit: 'RH', value: Math.random() * 1000, source: 'HUMISTOR' }
            ]
        });
    }, 5000);
}
