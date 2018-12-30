let currentEvent, allDay = false, globalEvents, events, loggedInAt;
let colorEvents = [], eventPermited = [];
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
    return new Promise((resolve, reject) => {
        $('#calendar').fullCalendar({
            height: 640,
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
                $('.toWhere').show();
                document.getElementById('titleModifyEvent').innerHTML = 'צור אירוע חדש';
                document.getElementById('submitButton').innerHTML = 'צור אירוע';
                $('#deleteButton').hide();
                allDay = false;
                if (endDate === null || (moment(startDate).utc().format('HH:mm:ss') === '00:00:00' && moment(endDate).utc().format('HH:mm:ss') === '00:00:00'))
                    allDay = true;
                document.getElementById('startDate').value = allDay ? startDate.utc().format('DD/MM/YYYY') + ' (כל היום) ' : startDate.utc().format('HH:mm DD/MM/YYYY');
                document.getElementById('title').value = '';
                document.getElementById('eventDescription').value = '';
                if (Math.abs(moment(startDate).diff(moment(endDate), 'd')) !== 1)
                    document.getElementById('endDate').value = allDay ? endDate.utc().format('DD/MM/YYYY') + ' (כל היום) ' : endDate.utc().format('HH:mm DD/MM/YYYY');
                allDay = false;
            },
            dayClick: function () {
                allDay = true;
                document.getElementById('endDate').value = '';
            },
            eventClick: (event) => {
                allDay = false;
                currentEvent = event;
                currentEvent.start = new Date(event.start);
                currentEvent.end = currentEvent.end ? new Date(event.end) : null;
                $('#createEventModal').modal('show');
                if (globalEvents.findIndex(el => el._id === event._id) >= 0) {
                    $('#modalBody').hide();
                    $('#submitButton').hide();
                    $('.toWhere').show();
                    $('#modalBodyShow').show();
                    $('#titleShow').html(event.title.toString());
                    let idx = globalEvents.findIndex(eventG => eventG._id === event._id);
                    if(idx >= 0) {
                        $('.showEventsLocation').html(globalEvents[idx].place);
                        $('.showEventsCategory').html(globalEvents[idx].category);
                    }
                    $('#eventDescriptionShow').html(event.description.toString());
                }
                else {
                    $('#modalBody').show();
                    $('#submitButton').show();
                    $('#modalBodyShow').hide();
                    $('.toWhere').hide();
                    document.getElementById('titleModifyEvent').innerHTML = 'עריכת אירוע';
                    document.getElementById('submitButton').innerHTML = 'ערוך אירוע';
                    $('#deleteButton').show();
                    if (event.end === null || (moment(event.start).utc().format('HH:mm:ss') === '00:00:00' && moment(event.end).utc().format('HH:mm:ss') === '00:00:00'))
                        allDay = true;
                    document.getElementById('startDate').value = allDay ? moment(event.start).utc().format('DD/MM/YYYY') + ' (כל היום) ' : moment(event.start).utc().format('HH:mm DD/MM/YYYY');
                    document.getElementById('title').value = event.title.toString();
                    document.getElementById('eventDescription').value = event.description;

                    if (event.end !== null){
                        if(moment(event.start).utc().format('HH:mm:ss') === '00:00:00' && moment(event.end).utc().format('HH:mm:ss') === '00:00:00')
                            document.getElementById('endDate').value = moment(event.end).utc().format('DD/MM/YYYY') + ' (כל היום) ';
                        else
                            document.getElementById('endDate').value = moment(event.end).utc().format('HH:mm DD/MM/YYYY');
                    }
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
                currentEvent = event;
                // currentEvent.start = new Date(event.start);
                // currentEvent.end = currentEvent.end ? new Date(event.end) : null;
                editUserEvent();
            },
            eventLimit: true, // allow "more" link when too many events
            // eventRender: function (eventObj, $el) {
            //     $el.popover({
            //         animation: true,
            //         placement: 'top',
            //         html: true,
            //         title: eventObj.title,
            //         content: eventObj.description,
            //         trigger: 'hover',
            //         placement: 'top',
            //         container: 'body'
            //     });
            // },
            events: [],
        });
        $(() => $('#startDateReports').datepicker());
        $(() => $('#endDateReports').datepicker());
        addAllUserEvent().then(() => resolve()).catch(() => reject());
    });
}


// request edit event user
function editUserEvent() {
    let event =
        {
            _id: currentEvent._id,
            title: $('#title').val().toString() === '' ? currentEvent.title : $('#title').val().toString(),
            start: new Date(currentEvent.start),
            end: new Date(currentEvent.end),
            allDay: currentEvent.end === null || (moment(currentEvent.start).utc().format('HH:mm:ss') === '00:00:00' && moment(currentEvent.end).utc().format('HH:mm:ss') === '00:00:00'),
            description: $('#eventDescription').val().toString()
        };
    apiEditUserEvent(event).then(res => {
        if (res.success === 'true') {
            editEvent(event);
            toastr["success"]('אירוע עודכן בהצלחה');
            $('#submitButton').prop('disabled', false);
        } else
            toastr["error"](res.message);
    }).catch(() => {
        toastr["error"]('שגיאה בעדכון אירוע');
        $('#submitButton').prop('disabled', false);
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
function addUserEvent(event, permitAddEvent) {
    if (permitAddEvent === 'יומן אישי')
        permitAddEvent = '';
    apiAddUserEvent(event, permitAddEvent).then(res => {
        if (res.success === 'true') {
            addEvent(res.event, permitAddEvent);
            toastr["success"](res.message);
            $('#submitButton').prop('disabled', false);
        } else {
            toastr["error"](res.message);
            $('#submitButton').prop('disabled', false);
        }
    }).catch(() => {
        toastr["error"]('שגיאה בהוספת אירוע');
        $('#submitButton').prop('disabled', false);
        $("#createEventModal").modal('hide');
    });
}

// add event mode
function addEvent(event, permitAddEvent) {
    let idx = colorEvents.findIndex(user => user.username === permitAddEvent);
    let add = true;
    if (permitAddEvent !== '' && idx < 0) {
        toastr["success"]('הוסף את אירועי המשתמש לתצוגה ביומן האישי');
        add = false;
    }
    $("#createEventModal").modal('hide');
    eventPermited.forEach(user => {
        if(user.permited_username === permitAddEvent)
            user.event.push(event._id);
    });
    if (add) {
        $("#calendar").fullCalendar('renderEvent',
            {
                _id: event._id,
                title: event.title,
                start: event.start,
                end: event.end !== null ? event.end : null,
                allDay: event.end === null || (moment(event.start).utc().format('HH:mm:ss') === '00:00:00' && moment(event.end).utc().format('HH:mm:ss') === '00:00:00'),
                description: event.description,
                color: idx >= 0 ? colorEvents[idx].color : null
            },
            true);
    }
}

// control onClick Event
function onclickEvent() {
    let endDateEl = $('#endDate');
    let startDate = new Date(currentEvent.start);
    let endDate = endDateEl.val() !== '' ? new Date(currentEvent.end) : null;
    let permitAddEvent = $('#theyPermitDialog').val();
    $('#submitButton').prop('disabled', true);
    let event = {
        title: $('#title').val(),
        start: startDate,
        end: endDate,
        description: $('#eventDescription').val().toString(),
    };
    if (document.getElementById('titleModifyEvent').innerHTML === 'עריכת אירוע'){
        permitAddEvent = '';
        eventPermited.forEach(user => {
            let idx = user.event.findIndex(id => id === currentEvent._id) >= 0;
            if(idx >= 0)
                permitAddEvent = user.permited_username;
        });
        editUserEvent();
    }
    if (document.getElementById('titleModifyEvent').innerHTML === 'צור אירוע חדש') {
        addUserEvent(event, permitAddEvent);
    }
}

//delete event
function onclickDeleteEvent() {
    $('#deleteButton').prop('disabled', true);

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
                        toastr["success"](res.message);
                        $('#calendar').fullCalendar('removeEvents', currentEvent._id);
                    } else
                        toastr["error"](res.message);
                }).catch(() => {
                    toastr["error"]('שגיאת שרת');
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
                loggedInAt = JSON.parse(res).loggedInAt;
                events = JSON.parse(res).events.map(event => {
                    return {
                        _id: event._id,
                        title: event.title,
                        start: event.start,
                        end: event.end !== null ? event.end : null,
                        allDay: event.end === null || (moment(event.start).utc().format('HH:mm:ss') === '00:00:00' && moment(event.end).utc().format('HH:mm:ss') === '00:00:00'),
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
                        allDay: true,
                        description: event.description,
                        color: 'SandyBrown',
                        place: event.place,
                        category: event.category
                    }
                });
                $('#calendar').fullCalendar('addEventSource', globalEvents);
                JSON.parse(res).theyPermit.forEach(permit => {
                    document.getElementById('theyPermit').options.add(new Option(permit, permit, false));
                    document.getElementById('theyPermitDialog').options.add(new Option(permit, permit, false));
                });
                toastr["success"](JSON.parse(res).message);
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

function givePermissions() {
    bootbox.confirm({
        message: '<div style="text-align: center"> האם אתה בטוח שאתה רוצה להוסיף את ההרשאות ?</div>',
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
                let userName = $('#givePermissions').val();
                if (userName === '') {
                    toastr["error"]('שם משתמש לא תקין');
                }
                else {
                    apiGivePermissionsRequest(userName).then(res => {
                        if (res.success === 'true') {
                            toastr['success'](res.message);
                            $('#givePermissions').val = '';
                        }
                        else {
                            toastr["error"](res.message);
                        }
                    }).catch(() => toastr["error"]('שגיאת שרת'));
                }
            }
        }
    });
}

function removePermissions() {
    bootbox.confirm({
        message: '<div style="text-align: center"> האם אתה בטוח שאתה רוצה להסיר את ההרשאות ?</div>',
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
                let userName = $('#givePermissions').val();
                if (userName === '') {
                    toastr["error"]('שם משתמש לא תקין');
                }
                else {
                    apiRemovePermissionsRequest(userName).then(res => {
                        if (res.success === 'true') {
                            toastr['success'](res.message);
                            $('#givePermissions').val = '';
                            $("#theyPermit option[value='${userName}']").remove();
                        }
                        else {
                            toastr["error"](res.message);
                        }
                    }).catch(() => toastr["error"]('שגיאת שרת'));
                }
            }
        }
    });
}

function addPermissionEvents() {
    let userName = $('#theyPermit').val();
    let color = $('#colorEvent').val();
    if (userName !== 'בחר משתמש') {
        if (colorEvents.findIndex(user => user.username === userName) < 0) {
            apiGetPermissionEvent(userName).then(res => {
                if (res.success === 'true') {
                    colorEvents.push(
                        {
                            color: color,
                            username: userName
                        }
                    );
                    let events = res.events.map(event => {
                        return {
                            _id: event._id,
                            title: event.title,
                            start: event.start,
                            end: event.end !== null ? event.end : null,
                            allDay: event.end === null || (moment(event.start).utc().format('HH:mm:ss') === '00:00:00' && moment(event.end).utc().format('HH:mm:ss') === '00:00:00'),
                            description: event.description,
                            color: color
                        }
                    });
                    eventPermited.push({
                        permited_username: userName,
                        event: events.map(el => el._id)
                    });
                    $('#calendar').fullCalendar('addEventSource', events);

                    let colorsEvents = $('#colorEventsNav');
                    let str = ' <i class="fa fa-circle global-event-color" style="color: ' + color + ';">' + userName + '</i>';

                    colorsEvents.append(str);

                    // var temp = document.createElement('div');
                    // temp.innerHTML = str;
                    // while (temp.firstChild) {
                    //     colorsEvents.appendChild(temp.firstChild);
                    // }


                    toastr['success'](res.message);
                }
                else
                    toastr["error"](res.message);
            }).catch(() => toastr['error']('שגיאת שרת'));
        }
        else
            toastr['error']('משתמש כבר קיים')
    }
    else
        toastr['error']('תחילה בחר משתמש');
}

function reportEvents() {
    let eventReports = [], columnReportsTable = [];
    let start = $('#startDateReports').val();
    let end = $('#endDateReports').val();
    if (start !== '')
        start = start.split('/')[1] + '/' + start.split('/')[0] + '/' + start.split('/')[2];
    if (end !== '')
        end = end.split('/')[1] + '/' + end.split('/')[0] + '/' + end.split('/')[2];
    switch ($('#reportSelect').val()) {
        case 'התחברויות':
            columnReportsTable = ["#", "תאריך", "שעה"];
            loggedInAt.forEach((log) => {
                if ((start === '' || end === '') || moment(log) >= moment(start) && moment(log) <= moment(end)) {
                    eventReports.push(
                        [moment(log).format('DD/MM/YYYY'), moment(log).format('HH:mm')]
                    );
                }
            });
            exportTableService(columnReportsTable, eventReports, 'דוח התחברויות', start, end);
            break;
        case 'אירועים גלובליים':
            columnReportsTable = ["#", "שם האירוע", "תאריך התחלה", "תאריך סיום"];
            globalEvents.forEach((event) => {
                if ((start === '' || end === '') || moment(event.start) >= moment(start) && moment(event.start) <= moment(end)) {
                    eventReports.push(
                        [event.title, moment(event.start).format('DD/MM/YYYY'), moment(event.end).format('DD/MM/YYYY')]
                    );
                }
            });
            exportTableService(columnReportsTable, eventReports, 'דוח אירועים גלובליים', start, end);
            break;
        case 'אירועים אישיים':
            columnReportsTable = ["#", "שם האירוע", "תאריך התחלה", "תאריך סיום"];
            events.forEach((event) => {
                if ((start === '' || end === '') || moment(event.start) >= moment(start) && moment(event.start) <= moment(end)) {
                    eventReports.push(
                        [event.title, moment(event.start).format('DD/MM/YYYY'), moment(event.end).format('DD/MM/YYYY')]
                    );
                }
            });
            exportTableService(columnReportsTable, eventReports, 'דוח אירועים אישיים', start, end);
            break;
        default:
            toastr['error']('אנא בחר דוח מהרשימה');
    }
}

function exportTableService(column, row, title, start, end) {
    let time = (start === '' || end === '') ? 'הכל' : moment(start).format('DD/MM/YYYY') + ' - ' + moment(end).format('DD/MM/YYYY');
    let table = `
    <style>
        h2 {
        text-align: center;
        }
        h3 {
        text-align: center;
        }
        table {
          border-collapse: collapse;
          width: 100%;
        }
        
        th, td {
          text-align: center;
          padding: 8px;
        }
    </style>
    <h2>${title}</h2>
    <h3>${time}</h3>

    <table dir="rtl">
        <tr>
    `;
    column.forEach(col => table += `<th> ${col} </th>`);
    table += `</tr>`;
    row.forEach((row, index) => {
        table += `<tr><td>${index + 1}</td>`;
        row.forEach((rowText) => table += `<th> ${rowText} </th>`);
        table += `</tr>`;
    });
    table += `</table>`;

    window.frames["print_frame"].document.body.innerHTML = table;
    window.frames["print_frame"].window.focus();
    window.frames["print_frame"].window.print();
}