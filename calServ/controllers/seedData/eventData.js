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
        title: 'Lorem ipsum',
        start: new Date(month1[Math.floor(Math.random() * 2)] + ' ' + Math.floor(Math.random * 31 + 1) + ', ' + year1 + ' ' + '08:00:00'),
        description: 'dolor sit amet',
        owner: 'deanz@cal.co.il'
    },
    {
        title: 'consectetur adipisicing',
        start: new Date(month1[Math.floor(Math.random() * 2)] + ' ' + Math.floor(Math.random * 31 + 1) + ', ' + year1 + ' ' + '16:00:00'),
        description: 'elit. Odio pariatur',
        owner: 'deanz@cal.co.il'
    },
    {
        title: 'voluptatibus quas',
        start: new Date(month2[Math.floor(Math.random() * 12)] + ' ' + Math.floor(Math.random * 31 + 1) + ', ' + year2 + ' ' + '00:00:00'),
        description: 'suscipit quisquam nesciunt',
        owner: 'deanz@cal.co.il'
    },
    {
        title: 'deleniti natus',
        start: new Date(month1[Math.floor(Math.random() * 2)] + ' ' + Math.floor(Math.random * 31 + 1) + ', ' + year1 + ' ' + '08:00:00'),
        description: 'delectus facilis reiciendis',
        owner: 'dorz@cal.co.il'
    },
    {
        title: 'animi eos',
        start: new Date(month1[Math.floor(Math.random() * 2)] + ' ' + Math.floor(Math.random * 31 + 1) + ', ' + year1 + ' ' + '10:00:00'),
        description: 'sapiente repellat excepturi',
        owner: 'dorz@cal.co.il'
    },
    {
        title: 'ullam, distinctio',
        start: new Date(month2[Math.floor(Math.random() * 12)] + ' ' + Math.floor(Math.random * 31 + 1) + ', ' + year2 + ' ' + '13:00:00'),
        description: 'itaque quae nobis',
        owner: 'dorz@cal.co.il'
    },
    {
        title: 'maiores mollitia',
        start: new Date(month1[Math.floor(Math.random() * 2)] + ' ' + Math.floor(Math.random * 31 + 1) + ', ' + year1 + ' ' + '21:30:00'),
        description: 'nemo laudantium dolorem',
        owner: 'edenz@cal.co.il'
    },
    {
        title: 'amet! Ipsam',
        start: new Date(month1[Math.floor(Math.random() * 2)] + ' ' + Math.floor(Math.random * 31 + 1) + ', ' + year1 + ' ' + '11:25:00'),
        description: 'enim sunt facilis',
        owner: 'edenz@cal.co.il'
    },
    {
        title: 'cumque dolores',
        start: new Date(month2[Math.floor(Math.random() * 12)] + ' ' + Math.floor(Math.random * 31 + 1) + ', ' + year2 + ' ' + '13:00:00'),
        description: 'similique porro doloremque',
        owner: 'edenz@cal.co.il'
    },
    {
        title: 'earum deleniti',
        start: new Date(month1[Math.floor(Math.random() * 2)] + ' ' + Math.floor(Math.random * 31 + 1) + ', ' + year1 + ' ' + '09:20:00'),
        description: 'distinctio delectus voluptatibus',
        owner: 'ofekz@cal.co.il'
    },
    {
        title: 'reprehenderit cum',
        start: new Date(month1[Math.floor(Math.random() * 2)] + ' ' + Math.floor(Math.random * 31 + 1) + ', ' + year1 + ' ' + '18:00:00'),
        description: 'quisquam dignissimos asperiores',
        owner: 'ofekz@cal.co.il'
    },
    {
        title: 'commodi error',
        start: new Date(month2[Math.floor(Math.random() * 12)] + ' ' + Math.floor(Math.random * 31 + 1) + ', ' + year2 + ' ' + '17:30:00'),
        description: 'ullam itaque ut',
        owner: 'ofekz@cal.co.il'
    }
];

module.exports = events;
