let currentEvent, currentEventPlace, currentEventCategory, acceptToDeleted = false;
let GlobalEvent;
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

function loadGlobalCalendar() {
    $('#calendar').fullCalendar({
        height: 650,
        header: {
            right: 'next,prev today',
            center: 'title',
            left: '',
            lang: 'he'
        },
        timeZone: 'local',
        navLinks: false, // can click day/week names to navigate views
        selectable: true,
        selectHelper: true,
        select: function (startDate, endDate) {
                currentEvent = {
                    start: startDate,
                    end: endDate
                };
                $('#createEventModal').modal('show');
                document.getElementById('titleModifyEvent').innerHTML = 'יצירת אירוע גלובלי';
                document.getElementById('submitButton').innerHTML = 'שלח בקשה';
                $('#deleteButton').hide();
                document.getElementById('startDate').value = startDate.format('DD/MM/YYYY');
                document.getElementById('title').value = '';
                document.getElementById('eventDescription').value = '';
                $('#placeFilterDialog').val('');
                $('#categoryFilterDialog').val('');
                document.getElementById('endDate').value = endDate.format('DD/MM/YYYY');
        },
        eventClick: (event) => {
            currentEvent = event;
            currentEvent.start = new Date(event.start);
            currentEvent.end = currentEvent.end ? new Date(event.end) : null;
            $('#createEventModal').modal('show');
            document.getElementById('titleModifyEvent').innerHTML = 'עריכת אירוע גלובלי';
            document.getElementById('submitButton').innerHTML = 'שלח בקשה';
            $('#deleteButton').show();
            document.getElementById('startDate').value = moment(event.start).format('DD/MM/YYYY');
            document.getElementById('title').value = event.title.toString();
            document.getElementById('eventDescription').value = event.description;
            if (event.end)
                document.getElementById('endDate').value = moment(event.end).format('DD/MM/YYYY');
            else
                document.getElementById('endDate').value = '';
            this.globalEvents.globalEvents.forEach(category => category.events.forEach(el => {
                if(el._id === event._id){
                    currentEventCategory = category.categoryName;
                    currentEventPlace = el.place;
                    $('#placeFilterDialog').val(currentEventPlace);
                    $('#categoryFilterDialog').val(currentEventCategory);
                }}));
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
                title: eventObj.title,
                content: eventObj.description,
                trigger: 'hover',
                placement: 'top',
                container: 'body'
            });
        },
        events: [],
    });
    addAllGlobalEvent().then(() => {
        $("#loading").hide();
        if(this.globalEvents.permission !== 'editor' && this.globalEvents.permission !== 'admin'){
            $('#calendar').fullCalendar('option', {
                editable: false,
                selectable: false,
                selectHelper: false,
                eventClick: (event) => {
                    currentEvent = event;
                    $('.showEventName').html(event.title);
                    $('.showEventDescription').html(event.description);
                    $('#showGlobalEventModal').modal('show');

                }
            });
        }
        setFilter();
    }).catch(() => window.location.assign('/404'));
}

function setFilter(){
    let categoryOptionList = document.getElementById('categoryFilter').options;
    let placeOptionList = document.getElementById('placeFilter').options;
    let categoryFilterDialog = document.getElementById('categoryFilterDialog').options;
    let placeFilterDialog = document.getElementById('placeFilterDialog').options;
    this.globalEvents.globalEvents.forEach(category =>{
        categoryOptionList.add(new Option(category.categoryName, category.categoryName, false));
        categoryFilterDialog.add(new Option(category.categoryName, category.categoryName, false));
    }
    );
    this.globalEvents.places.forEach(place => {
        placeOptionList.add(new Option(place, place, false));
        placeFilterDialog.add(new Option(place, place, false));
    }
    );

}

function addAllGlobalEvent() {
    return new Promise((resolve, reject) => {
        getGlobalEvents().then((res) => {
            if (JSON.parse(res).success === "true") {
                this.globalEvents = JSON.parse(res);
                this.globalEvents.globalEvents.map(category => {
                    let events = category.events.map(event => {
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
                });
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

function applyFilter() {
    bootbox.confirm({
        message: '<div style="text-align: center"> האם אתה בטוח שאתה רוצה לבצע את הסינון?</div>',
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
                let categoryApply = $('#categoryFilter').val();
                let placeApply = $('#placeFilter').val();
                let eventFilter = [];

                if(categoryApply !== 'הכל') {
                    let idx = this.globalEvents.globalEvents.findIndex(el => el.categoryName === categoryApply);
                    if (idx >= 0)
                        this.globalEvents.globalEvents[idx].events.forEach(el => eventFilter.push(el));
                }
                else {
                    this.globalEvents.globalEvents.forEach(el => {
                        el.events.forEach(event => eventFilter.push(event));
                    });
                }
                if(placeApply !== 'הכל') {
                    eventFilter = eventFilter.filter(event => event.place === placeApply);
                }
                $('#calendar').fullCalendar('removeEventSources');
                $('#calendar').fullCalendar('addEventSource', eventFilter);

                toastr["success"]('סינון בוצע');
                $('#categoryFilter').prop('selectedIndex',0);
                $('#placeFilter').prop('selectedIndex',0);
            }
        }
    });
}

function userPullEvent(){
    userPullGlobalEvent(currentEvent._id).then(res => {
        if(res.success === 'true')
            toastr["success"](res.message);
        else
            toastr["error"](res.message);
        $('#showGlobalEventModal').modal('hide');
    }).catch(() => {
        toastr["error"]('ארעה שגיאה')
        $('#showGlobalEventModal').modal('show');
    });
}

function signOut() {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
}

function onclickEvent() {
    let endDateEl = $('#endDate');
    let startDate = new Date(currentEvent.start);
    let endDate = endDateEl.val() !== '' ? new Date(currentEvent.end) : null;
    $('#submitButton').prop('disabled', true);
    let event = {
        title: $('#title').val(),
        start: startDate,
        end: endDate,
        description: $('#eventDescription').val().toString(),
        category: $('#categoryFilterDialog').val(),
        place:$('#placeFilterDialog').val()
    };
    if (document.getElementById('titleModifyEvent').innerHTML === 'עריכת אירוע גלובלי')
        editEditorGlobalEvent();
    if (document.getElementById('titleModifyEvent').innerHTML === 'יצירת אירוע גלובלי')
        addEditorGlobalEvent(event);
}

function addEditorGlobalEvent(event) {
    apiAddEditorGlobalEvent(event).then(res => {
        if (res.success === 'true') {
            addGlobalEvent(event);
            toastr["success"](res.message);
        } else
            toastr["error"](res.message);
        $('#submitButton').prop('disabled', false);
    }).catch(() => {
        toastr["error"]('שגיאה בהוספת אירוע');
        $("#createEventModal").modal('hide');
    });
}

function addGlobalEvent(event) {
    $("#createEventModal").modal('hide');
    $("#calendar").fullCalendar('renderEvent',
        {
            _id: event._id,
            title: event.title,
            start: event.start,
            end: event.end !== null ? event.end : null,
            allDay: true,
            description: event.description,
            category: event.category,
            place: event.place
        },
        true);
}

function editEditorGlobalEvent() {
    let event =
        {
            _id: currentEvent._id,
            title: $('#title').val().toString(),
            start: new Date(currentEvent.start),
            end: new Date(currentEvent.end),
            allDay: true,
            description: $('#eventDescription').val().toString(),
            category: $('#categoryFilterDialog').val(),
            place:$('#placeFilterDialog').val()
        };
    apiEditGlobalEvent(event).then(res => {
        if (res.success === 'true') {
            editGlobalEvent(event);
            toastr["success"](res.message);
            $('#submitButton').prop('disabled', false);
        } else
            toastr["error"](res.message);
    }).catch(() => {
        toastr["error"]('שגיאה בעדכון אירוע');
        $("#createEventModal").modal('hide');
    });
}

function editGlobalEvent(event) {
    $("#createEventModal").modal('hide');
    currentEvent.title = event.title;
    currentEvent.description = event.description;
    currentEvent.category = event.category;
    currentEvent.place = event.place;
    $('#calendar').fullCalendar('updateEvent', currentEvent);
}