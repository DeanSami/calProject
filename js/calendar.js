let currentEvent, allDay = false;
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
        select: function(startDate, endDate) {
            $('#createEventModal').modal('show');
            document.getElementById('titleModifyEvent').innerHTML = 'צור אירוע חדש';
            document.getElementById('submitButton').innerHTML = 'צור אירוע';
            document.getElementById('startDate').value = startDate.toDate().toDateString();
            document.getElementById('title').value = '';
            document.getElementById('eventDescription').value = '';
            if(!allDay)
                document.getElementById('endDate').value = endDate.toDate().toDateString();
            allDay = false;
        },
        dayClick: function() {
            allDay = true;
            document.getElementById('endDate').value = '';

        },
        eventClick: (event) => {
            currentEvent = event;
            $('#createEventModal').modal('show');
            document.getElementById('titleModifyEvent').innerHTML = 'ערוך אירוע';
            document.getElementById('submitButton').innerHTML = 'ערוך אירוע';
            document.getElementById('startDate').value = event.start.toDate().toDateString();
            document.getElementById('title').value = event.title.toString();
            document.getElementById('eventDescription').value = event.description;
            if (event.end)
                document.getElementById('endDate').value = event.end.toDate().toDateString();
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
    let event =
        {
            _id: currentEvent._id,
            title: $('#title').val().toString(),
            start: currentEvent.start,
            end: currentEvent.end ? currentEvent.end : null,
            allDay: true,
            description: $('#eventDescription').val().toString()
        };
    apiEditUserEvent(event).then(res => {
        if (res.success === 'true') {
            editEvent(event);
            toastr["success"]('אירוע עודכן בהצלחה');
            $('#submitButton').prop('disabled', false);
        } else
            toastr["error"]('שגיאה בעריכת אירוע');
    }).catch(() => {
        toastr["error"]('שגיאה בעדכון אירוע');
        $("#createEventModal").modal('hide');
    });
}

// edit event mode
function editEvent(event) {
    $("#createEventModal").modal('hide');
    currentEvent.title = event.title;
    currentEvent.description = event.description;
    $('#calendar').fullCalendar('updateEvent', currentEvent);
}

// request add event user
function addUserEvent(event) {
    apiAddUserEvent(event).then(res => {
        if (res.success === 'true') {
            addEvent(res.event);
            toastr["success"]('אירוע נוסף בהצלחה');
            $('#submitButton').prop('disabled', false);
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
            _id: event._id,
            title: event.title,
            start: event.start,
            end: event.end !== null ? event.end : null,
            allDay: true,
            description: event.description
        },
        true);
    console.log('dor');
}

// control onClick Event
function onclickAddEvent() {
    let endDateEl = $('#endDate');
    let startDate = moment(new Date($('#startDate').val())).format('YYYY-MM-DD');
    let endDate = endDateEl.val() !== '' ? moment(new Date(endDateEl.val())).format('YYYY-MM-DD') : null;
    $('#submitButton').prop('disabled', true);
    let event = {
        title: $('#title').val(),
        start: startDate,
        end: endDate,
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
                        _id: event._id,
                        title: event.title,
                        start: event.start,
                        end: event.end !== null ? event.end : null,
                        allDay: true,
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