let currentEvent;
$(document).ready(function () {
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut",
        "rtl": true
    };
});

function loadCalendar() {
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
            document.getElementById('endDate').value = '';
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
        events: [],
    });
    addAllUserEvent().then(() => $("#loading").hide()).catch(() => window.location.assign('/404'));
}




// request edit event user
function editUserEvent() {
    apiEditUserEvent(
        {
            _id: currentEvent.id,
            title: $('#title').val(),
            start: currentEvent.start,
            end: currentEvent.end !== null ? moment(currentEvent.end) : '',
            allDay: currentEvent.end === null,
            description: $('#eventDescription').val().toString()
        }
    ).then(res => {
        if (res.success === 'true') {
            editEvent();
            toastr["success"]('אירוע עודכן בהצלחה');
            setTimeout(submitButton.prop('disabled', false), 300);
        } else
            toastr["error"]('שגיאה בעריכת אירוע');
    }).catch(() => {
        toastr["error"]('שגיאה בעדכון אירוע');
        $("#createEventModal").modal('hide');
    });
}
// edit event mode
function editEvent() {
    $("#createEventModal").modal('hide');
    currentEvent.title = $('#title').val();
    currentEvent.start = $('#startDate').val();
    currentEvent.end = $('#endDate').val();
    currentEvent.description = $('#eventDescription').val().toString();

    $('#calendar').fullCalendar('updateEvent', currentEvent);
}

// request add event user
function addUserEvent(event) {
    apiAddUserEvent(event).then(res => {
        if (res.success === 'true') {
            addEvent(res.event);
            toastr["success"]('אירוע נוסף בהצלחה');
            setTimeout(submitButton.prop('disabled', false), 300);

        } else
            toastr["error"]('שגיאה בהוספת אירוע');
    }).catch(() => {
        toastr["error"]('שגיאה בהוספת אירוע');
        $("#createEventModal").modal('hide');
    });
}
// add event mode
function addEvent(event) {
    $("#createEventModal").modal('hide');
    $("#calendar").fullCalendar('renderEvent',
        {
            id: event._id,
            title: event.title,
            start: moment(event.start),
            end: event.end !== '' ? moment(event.end) : false,
            allDay: event.end === '',
            description: event.description
        },
        true);
}



// control onClick Event
function onclickAddEvent() {
    let submitButton = $('#submitButton');
    let endDate = $('#endDate');
    submitButton.prop('disabled', true);
    let event = {
        title: $('#title').val(),
        start: moment($('#startDate').val()),
        end: endDate.val() !== '' ? moment(endDate.val()) : '',
        description: $('#eventDescription').val().toString()
    };
    if (document.getElementById('titleModifyEvent').innerHTML === 'ערוך אירוע')
        editUserEvent();
    if (document.getElementById('titleModifyEvent').innerHTML === 'צור אירוע חדש')
        addUserEvent(event);
}





function addAllUserEvent() {
    return new Promise((resolve, reject) => {
        getUserEvents().then((res) => {
            if (JSON.parse(res).success === "true") {
                let events = JSON.parse(res).events.map(event => {
                    return {
                        id: event._id,
                        title: event.title,
                        start: event.start,
                        end: event.end !== null ? event.end : false,
                        allDay: !(event.end !== null),
                        description: event.description
                    }
                });
                $('#calendar').fullCalendar('addEventSource', events);
                resolve();
            }
            else {
                toastr["error"](JSON.parse(res).message);
                reject()
            }
        }).catch(() => {
            toastr["error"]('ארעה שגיאה בגישה לשרת');
            reject();
        });
    });
}