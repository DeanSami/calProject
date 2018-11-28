$(document).ready(function() {

    $('#calendar').fullCalendar({
        header: {
            right: 'next,prev today',
            center: 'title',
            left: 'month,agendaDay',
            lang: 'he'
        },
        defaultDate: '2018-03-12',
        navLinks: true, // can click day/week names to navigate views
        selectable: true,
        selectHelper: true,
        select: function (start, end, allDay) {
            $('#createEventModal').modal('show');
            document.getElementById('titleModifyEvent').innerHTML = 'צור אירוע חדש';
            document.getElementById('startDate').value = start._d.toDateString();
            document.getElementById('title').value = '';
            document.getElementById('endDate').value = end._d.toDateString();
        },
        eventClick: (event) => {
            currentEvent = event;
            $('#createEventModal').modal('show');
            document.getElementById('titleModifyEvent').innerHTML = 'ערוך אירוע';
            document.getElementById('startDate').value = event.start._d.getFullYear().toString() + '-' + ((event.start._d.getMonth())+1).toString() + '-' + event.start._d.getDate().toString();
            document.getElementById('title').value = event.title.toString();
            if(event.end)
                document.getElementById('endDate').value = event.end._d.getFullYear().toString() + '-' + ((event.end._d.getMonth())+1).toString() + '-' + event.end._d.getDate().toString();
            else
                document.getElementById('endDate').value = '';

        },
        editable: true,
        eventDrop: (event) => {
            console.log(event.title);
        },
        eventLimit: true, // allow "more" link when too many events
        events: [
            {
                id: 1,
                title: 'All Day Event',
                start: '2018-03-01'
            },
            {
                title: 'Long Event',
                start: '2018-03-07',
                end: '2018-03-10'
            },
            {
                id: 999,
                title: 'Repeating Event',
                start: '2018-03-09T16:00:00'
            },
            {
                id: 999,
                title: 'Repeating Event',
                start: '2018-03-16T16:00:00'
            },
            {
                title: 'Conference',
                start: '2018-03-11',
                end: '2018-03-13'
            },
            {
                title: 'Meeting',
                start: '2018-03-12T10:30:00',
                end: '2018-03-12T12:30:00'
            },
            {
                title: 'Lunch',
                start: '2018-03-12T12:00:00'
            },
            {
                title: 'Meeting',
                start: '2018-03-12T14:30:00'
            },
            {
                title: 'Happy Hour',
                start: '2018-03-12T17:30:00'
            },
            {
                title: 'Dinner',
                start: '2018-03-12T20:00:00'
            },
            {
                title: 'Birthday Party',
                start: '2018-03-13T07:00:00'
            },
            {
                title: 'Click for Google',
                url: 'http://google.com/',
                start: '2018-03-28'
            }
        ]
    });

    $('#submitButton').on('click', () => {
        if(document.getElementById('titleModifyEvent').innerHTML === 'ערוך אירוע')
            editEvent();
        if(document.getElementById('titleModifyEvent').innerHTML === 'צור אירוע חדש')
            addEvent();
    });

    function addEvent() {
        $("#createEventModal").modal('hide');
        $("#calendar").fullCalendar('renderEvent',
            {
                title: $('#title').val(),
                start: moment($('#startDate').val()),
                end: moment($('#endDate').val()),
                allDay: true
            },
            true);
    }
    function editEvent() {
        $("#createEventModal").modal('hide');
        currentEvent.title = $('#title').val();
        currentEvent.start = $('#startDate').val();
        currentEvent.end = $('#endDate').val();

        $('#calendar').fullCalendar('updateEvent', currentEvent);

    }

});
