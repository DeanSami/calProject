<<<<<<< HEAD
let currentEvent, allDay = false, acceptToDeleted = false, globalEvents;
=======
<<<<<<< HEAD


    $(document).ready(function() {
    setTimeout(() => {
        $('#calendar').fullCalendar({
=======
let currentEvent, allDay = false, acceptToDeleted = false;
>>>>>>> b22c17ab2bf4610d0d0661a648d43a27928e3d22
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
>>>>>>> 0ca1cf2fbe17985f60e93bc770ab7bc29eca4664
        height: 650,
        header: {
            right: 'next,prev today',
            center: 'title',
            left: 'month,agendaDay',
            lang: 'he'
        },
        timeZone: 'local',
        navLinks: true, // can click day/week names to navigate views
        selectable: true,
        selectHelper: true,
        select: function (startDate, endDate) {
            currentEvent = {
                start: startDate,
                end: endDate
            };
            $('#createEventModal').modal('show');
            $('#modalBody').show();
            $('#submitButton').show();
            $('#modalBodyShow').hide();
            document.getElementById('titleModifyEvent').innerHTML = 'צור אירוע חדש';
            document.getElementById('submitButton').innerHTML = 'צור אירוע';
            $('#deleteButton').hide();
            document.getElementById('startDate').value = startDate.format('HH:mm DD/MM/YYYY');
            document.getElementById('title').value = '';
            document.getElementById('eventDescription').value = '';
            if (!allDay)
                document.getElementById('endDate').value = endDate.format('HH:mm DD/MM/YYYY');
            allDay = false;
        },
        dayClick: function () {
            allDay = true;
            document.getElementById('endDate').value = '';
        },
        eventClick: (event) => {
            currentEvent = event;
            currentEvent.start = new Date(event.start);
            currentEvent.end = currentEvent.end ? new Date(event.end) : null;
            $('#createEventModal').modal('show');
            if (globalEvents.findIndex(el => el._id === event._id) >= 0) {
                $('#modalBody').hide();
                $('#submitButton').hide();
                $('#modalBodyShow').show();
                document.getElementById('titleModifyEvent').innerHTML = 'תצוגת אירוע גלובלי';
                $('#titleShow').html(event.title.toString());
                $('#eventDescriptionShow').html(event.description.toString());
            }
            else {
                $('#modalBody').show();
                $('#submitButton').show();
                $('#modalBodyShow').hide();
                document.getElementById('titleModifyEvent').innerHTML = 'ערוך אירוע';
                document.getElementById('submitButton').innerHTML = 'ערוך אירוע';
                $('#deleteButton').show();
                document.getElementById('startDate').value = moment(event.start).format('HH:mm MM/DD/YYYY');
                document.getElementById('title').value = event.title.toString();
                document.getElementById('eventDescription').value = event.description;
                if (event.end)
                    document.getElementById('endDate').value = moment(event.end).format('HH:mm MM/DD/YYYY');
                else
                    document.getElementById('endDate').value = '';
            }

        },
        editable: true,
        eventResize: function (event) {
            currentEvent = event;
            editUserEvent();
        },
        eventDrop: (event) => {
            console.log('drop', event);
            currentEvent = event;
            // currentEvent.start = new Date(event.start);
            // currentEvent.end = currentEvent.end ? new Date(event.end) : null;
            editUserEvent();
        },
        eventLimit: true, // allow "more" link when too many events
        eventRender: function (eventObj, $el) {
            $el.popover({
                animation: true,
                placement: 'top',
                html: true,
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
            start: new Date(currentEvent.start),
            end: new Date(currentEvent.end),
            allDay: currentEvent.end === null && moment(currentEvent.start).format('HH:mm') === '02:00',
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
}

// control onClick Event
function onclickEvent() {
    let endDateEl = $('#endDate');
    let startDate = new Date(currentEvent.start);
    let endDate = endDateEl.val() !== '' ? new Date(currentEvent.end) : null;
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

<<<<<<< HEAD
    },1);
=======
//delete event
function onclickDeleteEvent() {
    $('#deleteButton').prop('disabled', true);
>>>>>>> 0ca1cf2fbe17985f60e93bc770ab7bc29eca4664

    bootbox.confirm({
        message: '<div style="text-align: center"> האם אתה בטוח שאתה רוצה למחוק את האירוע</div>',
        size: "small",
        animate: true,
        buttons: {
            confirm: {
                label: 'אישור',
                className: 'btn-success pull-right'
            },
            cancel: {
                label: 'בטל',
                className: 'btn-danger pull-right'
            }
        },
        callback: result => {
            if (result) {
                apiDeleteUserEvent(currentEvent).then(res => {
                    if (res.success === 'true') {
                        toastr["success"]('אירוע נמחק בהצלחה');
                        $('#calendar').fullCalendar('removeEvents', currentEvent._id);
                    } else
                        toastr["error"]('שגיאה במחיקת אירוע');
                }).catch(() => {
                    toastr["error"]('שגיאה במחיקת אירוע');
                });
                $("#createEventModal").modal('hide');
            }
            $('#deleteButton').prop('disabled', false);
        }
    });
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
                        allDay: event.end === null && moment(event.start).format('HH:mm') === '02:00',
                        description: event.description
                    }
                });
                $('#calendar').fullCalendar('addEventSource', events);
                globalEvents = JSON.parse(res).globalEvents.map(event => {
                    return {
                        _id: event._id,
                        title: event.title,
                        start: event.start,
                        end: event.end !== null ? event.end : null,
                        allDay: event.end === null && moment(event.start).format('HH:mm') === '02:00',
                        description: event.description,
                        color: 'SandyBrown'
                    }
                });
                $('#calendar').fullCalendar('addEventSource', globalEvents);
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

function signOut() {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
}