const readline = require('readline');
const moment = require('moment');

class Alarm {
    constructor(time, day) {
        this.time = time;
        this.day = day;
        this.snoozeCount = 0;
    }
    
    snooze() {
        if (this.snoozeCount < 3) {
            this.snoozeCount++;
            this.time = moment(this.time, 'HH:mm').add(5, 'minutes').format('HH:mm');
            return true;
        } else {
            return false;
        }
    }
}

class AlarmClock {
    constructor() {
        this.alarms = [];
    }

    displayCurrentTime() {
        console.log(`Current time: ${moment().format('HH:mm:ss')}`);
    }

    addAlarm(time, day) {
        this.alarms.push(new Alarm(time, day));
        console.log(`Alarm set for ${time} on day ${day}`);
    }

    deleteAlarm(index) {
        if (index >= 0 && index < this.alarms.length) {
            this.alarms.splice(index, 1);
            console.log(`Alarm at index ${index} deleted`);
        } else {
            console.log('Invalid index');
        }
    }

    checkAlarms() {
        const now = moment();
        const currentTime = now.format('HH:mm');
        const currentDay = now.day();
        this.alarms.forEach((alarm, index) => {
            if (alarm.time == currentTime && alarm.day == currentDay) {
                console.log(`Alarm ringing for ${alarm.time} on day ${alarm.day}`);
            }
        });
    }

    snoozeAlarm(index) {
        if (index >= 0 && index < this.alarms.length) {
            if (this.alarms[index].snooze()) {
                console.log(`Alarm snoozed to ${this.alarms[index].time}`);
            } else {
                console.log('Max snooze limit reached');
            }
        } else {
            console.log('Invalid index');
        }
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const alarmClock = new AlarmClock();

function showMenu() {
    console.log(`
    1. Display current time
    2. Set alarm
    3. Delete alarm
    4. Snooze alarm
    5. Exit
    `);
    rl.question('Choose an option: ', handleMenu);
}

function handleMenu(option) {
    switch (option) {
        case '1':
            alarmClock.displayCurrentTime();
            showMenu();
            break;
        case '2':
            rl.question('Enter time (HH:mm): ', (time) => {
                rl.question('Enter day (0-6, where 0 is Sunday): ', (day) => {
                    alarmClock.addAlarm(time, day);
                    showMenu();
                });
            });
            break;
        case '3':
            rl.question('Enter alarm index to delete: ', (index) => {
                alarmClock.deleteAlarm(parseInt(index));
                showMenu();
            });
            break;
        case '4':
            rl.question('Enter alarm index to snooze: ', (index) => {
                alarmClock.snoozeAlarm(parseInt(index));
                showMenu();
            });
            break;
        case '5':
            rl.close();
            break;
        default:
            console.log('Invalid option');
            showMenu();
            break;
    }
}

function startClock() {
    setInterval(() => {
        alarmClock.checkAlarms();
    }, 60000);
}

showMenu();
startClock();
