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
        eventEnd: null,
        eventDetails: 'dolor sit amet',
        owner: 'deanz'
    },
    {
        eventName: 'consectetur adipisicing',
        eventStart: new Date(month1[Math.floor(Math.random() * 2)] + ' ' + Math.floor(Math.random * 31 + 1) + ', ' + year1 + ' ' + '16:00:00'),
        eventEnd: null,
        eventDetails: 'elit. Odio pariatur',
        owner: 'deanz'
    },
    {
        eventName: 'voluptatibus quas',
        eventStart: new Date(month1[Math.floor(Math.random() * 2)] + ' ' + Math.floor(Math.random * 31 + 1) + ', ' + year1 + ' ' + '00:00:00'),
        eventEnd: null,
        eventDetails: 'suscipit quisquam nesciunt',
        owner: 'deanz'
    },
    {
        eventName: 'deleniti natus',
        eventStart: new Date(month1[Math.floor(Math.random() * 2)] + ' ' + Math.floor(Math.random * 31 + 1) + ', ' + year1 + ' ' + '08:00:00'),
        eventEnd: null,
        eventDetails: 'delectus facilis reiciendis',
        owner: 'dorz'
    },
    {
        eventName: 'animi eos',
        eventStart: new Date(month1[Math.floor(Math.random() * 2)] + ' ' + Math.floor(Math.random * 31 + 1) + ', ' + year1 + ' ' + '10:00:00'),
        eventEnd: null,
        eventDetails: 'sapiente repellat excepturi',
        owner: 'dorz'
    },
    {
        eventName: 'ullam, distinctio',
        eventStart: new Date(month1[Math.floor(Math.random() * 2)] + ' ' + Math.floor(Math.random * 31 + 1) + ', ' + year1 + ' ' + '13:00:00'),
        eventEnd: null,
        eventDetails: 'itaque quae nobis',
        owner: 'dorz'
    },
    {
        eventName: 'maiores mollitia',
        eventStart: new Date(month1[Math.floor(Math.random() * 2)] + ' ' + Math.floor(Math.random * 31 + 1) + ', ' + year1 + ' ' + '21:30:00'),
        eventEnd: null,
        eventDetails: 'nemo laudantium dolorem',
        owner: 'edenz'
    },
    {
        eventName: 'amet! Ipsam',
        eventStart: new Date(month1[Math.floor(Math.random() * 2)] + ' ' + Math.floor(Math.random * 31 + 1) + ', ' + year1 + ' ' + '11:25:00'),
        eventEnd: null,
        eventDetails: 'enim sunt facilis',
        owner: 'edenz'
    },
    {
        eventName: 'cumque dolores',
        eventStart: new Date(month1[Math.floor(Math.random() * 2)] + ' ' + Math.floor(Math.random * 31 + 1) + ', ' + year1 + ' ' + '13:00:00'),
        eventEnd: null,
        eventDetails: 'similique porro doloremque',
        owner: 'edenz'
    },
    {
        eventName: 'earum deleniti',
        eventStart: new Date(month1[Math.floor(Math.random() * 2)] + ' ' + Math.floor(Math.random * 31 + 1) + ', ' + year1 + ' ' + '09:20:00'),
        eventEnd: null,
        eventDetails: 'distinctio delectus voluptatibus',
        owner: 'ofekz'
    },
    {
        eventName: 'reprehenderit cum',
        eventStart: new Date(month1[Math.floor(Math.random() * 2)] + ' ' + Math.floor(Math.random * 31 + 1) + ', ' + year1 + ' ' + '18:00:00'),
        eventEnd: null,
        eventDetails: 'quisquam dignissimos asperiores',
        owner: 'ofekz'
    },
    {
        eventName: 'commodi error',
        eventStart: new Date(month1[Math.floor(Math.random() * 2)] + ' ' + Math.floor(Math.random * 31 + 1) + ', ' + year1 + ' ' + '17:30:00'),
        eventEnd: null,
        eventDetails: 'ullam itaque ut',
        owner: 'ofekz'
    }
];

module.exports = events;
