let year1 = '2018';
let year2 = '2019'
let month1 = ['November', 'December'];
let month2 = ['January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];
let events = [
    {
        eventName: 'Lorem ipsum',
        eventStart: new Date(month1[Math.floor(Math.random() * 2)] + ' ' + Math.floor(Math.random * 31 + 1) + ', ' + year1 + ' ' + '08:00:00'),
        eventDetails: 'dolor sit amet',
        owner: 'deanz@cal.co.il'
    },
    {
        eventName: 'consectetur adipisicing',
        eventStart: new Date(month1[Math.floor(Math.random() * 2)] + ' ' + Math.floor(Math.random * 31 + 1) + ', ' + year1 + ' ' + '16:00:00'),
        eventDetails: 'elit. Odio pariatur',
        owner: 'deanz@cal.co.il'
    },
    {
        eventName: 'voluptatibus quas',
        eventStart: new Date(month2[Math.floor(Math.random() * 12)] + ' ' + Math.floor(Math.random * 31 + 1) + ', ' + year2 + ' ' + '00:00:00'),
        eventDetails: 'suscipit quisquam nesciunt',
        owner: 'deanz@cal.co.il'
    },
    {
        eventName: 'deleniti natus',
        eventStart: new Date(month1[Math.floor(Math.random() * 2)] + ' ' + Math.floor(Math.random * 31 + 1) + ', ' + year1 + ' ' + '08:00:00'),
        eventDetails: 'delectus facilis reiciendis',
        owner: 'dorz@cal.co.il'
    },
    {
        eventName: 'animi eos',
        eventStart: new Date(month1[Math.floor(Math.random() * 2)] + ' ' + Math.floor(Math.random * 31 + 1) + ', ' + year1 + ' ' + '10:00:00'),
        eventDetails: 'sapiente repellat excepturi',
        owner: 'dorz@cal.co.il'
    },
    {
        eventName: 'ullam, distinctio',
        eventStart: new Date(month2[Math.floor(Math.random() * 12)] + ' ' + Math.floor(Math.random * 31 + 1) + ', ' + year2 + ' ' + '13:00:00'),
        eventDetails: 'itaque quae nobis',
        owner: 'dorz@cal.co.il'
    },
    {
        eventName: 'maiores mollitia',
        eventStart: new Date(month1[Math.floor(Math.random() * 2)] + ' ' + Math.floor(Math.random * 31 + 1) + ', ' + year1 + ' ' + '21:30:00'),
        eventDetails: 'nemo laudantium dolorem',
        owner: 'edenz@cal.co.il'
    },
    {
        eventName: 'amet! Ipsam',
        eventStart: new Date(month1[Math.floor(Math.random() * 2)] + ' ' + Math.floor(Math.random * 31 + 1) + ', ' + year1 + ' ' + '11:25:00'),
        eventDetails: 'enim sunt facilis',
        owner: 'edenz@cal.co.il'
    },
    {
        eventName: 'cumque dolores',
        eventStart: new Date(month2[Math.floor(Math.random() * 12)] + ' ' + Math.floor(Math.random * 31 + 1) + ', ' + year2 + ' ' + '13:00:00'),
        eventDetails: 'similique porro doloremque',
        owner: 'edenz@cal.co.il'
    },
    {
        eventName: 'earum deleniti',
        eventStart: new Date(month1[Math.floor(Math.random() * 2)] + ' ' + Math.floor(Math.random * 31 + 1) + ', ' + year1 + ' ' + '09:20:00'),
        eventDetails: 'distinctio delectus voluptatibus',
        owner: 'ofekz@cal.co.il'
    },
    {
        eventName: 'reprehenderit cum',
        eventStart: new Date(month1[Math.floor(Math.random() * 2)] + ' ' + Math.floor(Math.random * 31 + 1) + ', ' + year1 + ' ' + '18:00:00'),
        eventDetails: 'quisquam dignissimos asperiores',
        owner: 'ofekz@cal.co.il'
    },
    {
        eventName: 'commodi error',
        eventStart: new Date(month2[Math.floor(Math.random() * 12)] + ' ' + Math.floor(Math.random * 31 + 1) + ', ' + year2 + ' ' + '17:30:00'),
        eventDetails: 'ullam itaque ut',
        owner: 'ofekz@cal.co.il'
    }
];

module.exports = events;
