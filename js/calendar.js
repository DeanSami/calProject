$(document).ready(function () {
});

setTimeout(() => {
    $('#calendar').fullCalendar({
        height: 650,
        header: {
            right: 'next,prev today',
            center: 'title',
            left: 'month,agendaDay',
            lang: 'he'
        },
        navLinks: true, // can click day/week names to navigate views
        selectable: true,
        selectHelper: true,
        select: function (start, end, allDay) {
            $('#createEventModal').modal('show');
            document.getElementById('titleModifyEvent').innerHTML = 'צור אירוע חדש';
            document.getElementById('startDate').value = start._d.toDateString();
            document.getElementById('title').value = '';
            document.getElementById('eventDescription').value = '';
            document.getElementById('endDate').value = end._d.toDateString();
        },
        eventClick: (event) => {
            currentEvent = event;
            $('#createEventModal').modal('show');
            document.getElementById('titleModifyEvent').innerHTML = 'ערוך אירוע';
            document.getElementById('startDate').value = event.start._d.getFullYear().toString() + '-' + ((event.start._d.getMonth()) + 1).toString() + '-' + event.start._d.getDate().toString();
            document.getElementById('title').value = event.title.toString();
            document.getElementById('eventDescription').value = event.description;
            if (event.end)
                document.getElementById('endDate').value = event.end._d.getFullYear().toString() + '-' + ((event.end._d.getMonth()) + 1).toString() + '-' + event.end._d.getDate().toString();
            else
                document.getElementById('endDate').value = '';

        },
        editable: true,
        eventDrop: (event) => {
            console.log(event.title);
        },
        eventLimit: true, // allow "more" link when too many events
        eventRender: function (eventObj, $el) {
            $el.popover({
                title: eventObj.title,
                content: eventObj.description,
                trigger: 'hover',
                placement: 'top',
                container: 'body'
            });
        },
        events: [
            {
                id: 1,
                title: 'All Day Event',
                start: '2018-12-12',
                backgroundColor: 'red',
                description: 'Dor',
                allDay: true,
                end: false
            }
        ],


        // () => {
        //     // let events = getUserEvents();
        //     let events;
        //     events = [
        //         {
        //             id: 1,
        //             title: 'All Day Event',
        //             start: '2018-12-12',
        //             backgroundColor: 'red',
        //             description: 'Dor'
        //         }
        //     ];
        //     return events;
        //     // return events;
        // }
        //
        // [
        // {
        //     id: 1,
        //     title: 'All Day Event',
        //     start: '2018-03-01',
        //     backgroundColor: 'red',
        //     description: 'Dor'
        // }
        // ]
    });
    addUserEvent();
    $("#loading").hide();

}, 3000);

$('#submitButton').on('click', () => {
    if (document.getElementById('titleModifyEvent').innerHTML === 'ערוך אירוע')
        editEvent();
    if (document.getElementById('titleModifyEvent').innerHTML === 'צור אירוע חדש')
        addEvent();
});

function addEvent() {
    $("#createEventModal").modal('hide');
    $("#calendar").fullCalendar('renderEvent',
        {
            title: $('#title').val(),
            start: moment($('#startDate').val()),
            end: moment($('#endDate').val()),
            allDay: true,
            description: $('#eventDescription').val().toString()
        },
        true);
}

function editEvent() {
    $("#createEventModal").modal('hide');
    currentEvent.title = $('#title').val();
    currentEvent.start = $('#startDate').val();
    currentEvent.end = $('#endDate').val();
    currentEvent.description = $('#eventDescription').val().toString();

    $('#calendar').fullCalendar('updateEvent', currentEvent);
}

function addUserEvent() {
    getUserEvents().then((res) => {
        console.log('res', res);
        if (res.success === "true") {
            $('#calendar').fullCalendar('addEventSource', () => {
                res.events.map((event) => {
                    return {
                        id: event._id,
                        title: event.title,
                        start: event.start,
                        end: el => {
                            if (event.end)
                                return el;
                            else
                                return false;
                        },
                        allDay: () => (event.end !== ''),
                        description: event.description
                    }
                });
            });
        }
        else if (res.success === "false")
            toastr["error"](res.message);

    }).catch(() => toastr["error"]('ארעה שגיאה בגישה לשרת'));
}

