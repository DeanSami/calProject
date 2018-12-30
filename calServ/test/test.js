const chai = require('chai'),
    should = chai.should(),
    chaiHtttp = require('chai-http');
chai.use(chaiHtttp);
const User = require('../models/User');

const server = require('../app').app;
const db = require('../app').mongoose;

let token = '';
let event_id = '';

describe('POST /register', () => {
    it('should register a new user', (done) => {
        chai.request(server)
            .post('/register')
            .send({
                username: 'test@cal.co.il',
                password: '123456',
                password2: '123456'
            })
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal('application/json');
                res.body.success.should.eql('true');
                res.body.message.should.equal('מעביר לדף ראשי');
                User.deleteOne({ username: 'test@cal.co.il' }, err => {
                    if (err) console.log(err);
                    done();
                });
            })
    })
    it('should return error if username is not an email', (done) => {
        chai.request(server)
            .post('/register')
            .send({
                username: 'test'
            })
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal('application/json');
                res.body.success.should.eql('false');
                res.body.message.should.equal('שם משתמש חייב להיות מייל תקני');
                done();
            })
    })
    it('should return error if password length is less then 6', (done) => {
        chai.request(server)
            .post('/register')
            .send({
                username: 'test@cal.co.il',
                password: '123'
            })
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal('application/json');
                res.body.success.should.eql('false');
                res.body.message.should.equal('סיסמא חייבת להיות לפחות באורך 6');
                done();
            })
    })
    it('should return error if username is taken', (done) => {
        chai.request(server)
            .post('/register')
            .send({
                username: 'deanz@cal.co.il',
                password: '123456'
            })
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal('application/json');
                res.body.success.should.eql('false');
                res.body.message.should.equal('משתמש כבר רשום');
                done();
            })
    })
    it('should return error if passwords dont match', (done) => {
        chai.request(server)
            .post('/register')
            .send({
                username: 'test@cal.co.il',
                password: '123456',
                password2: '123'
            })
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal('application/json');
                res.body.success.should.eql('false');
                res.body.message.should.equal('סיסמאות לא תואמות');
                done();
            })
    })
})

describe('POST /login', () => {
    it('should login a given user', (done) => {
        chai.request(server)
            .post('/login')
            .send({
                username: 'deanz@cal.co.il',
                password: '123'
            })
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal('application/json');
                res.body.success.should.eql('true');
                res.body.should.include.keys(
                    'success', 'message', 'username', 'token', 'permission'
                );
                token = res.body.token;
                done();
            })
    })
    it('should return error if username does not exist', (done) => {
        chai.request(server)
            .post('/login')
            .send({
                username: 'test'
            })
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal('application/json');
                res.body.success.should.eql('false');
                res.body.message.should.equal('לא נמצא אימייל');
                done();
            })
    })
    it('should return error if password is incorrect', (done) => {
        chai.request(server)
            .post('/login')
            .send({
                username: 'deanz@cal.co.il',
                password: '124'
            })
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal('application/json');
                res.body.success.should.eql('false');
                res.body.message.should.equal('סיסמאות לא תואמות');
                done();
            })
    })
})

describe('POST /calendar', () => {
    it('should respond with all events connected to user', (done) => {
        chai.request(server)
            .post('/calendar')
            .send({
                username: 'deanz@cal.co.il',
                token: token
            })
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal('application/json');
                res.body.success.should.eql('true');
                res.body.should.include.keys(
                    'success', 'message', 'events', 'globalEvents', 'theyPermit', 'permission', 'loggedInAt'
                );
                done();
            })
    })
    it('should return error if username does not exist', (done) => {
        chai.request(server)
            .post('/calendar')
            .send({
                username: 'test@cal.co.il'
            })
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal('application/json');
                res.body.success.should.eql('false');
                res.body.message.should.equal('שגיאת משתמש');
                done();
            })
    })
    it('should return error if token is incorrect', (done) => {
        chai.request(server)
            .post('/calendar')
            .send({
                username: 'deanz@cal.co.il',
                token: '123'
            })
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal('application/json');
                res.body.success.should.eql('false');
                res.body.message.should.equal('שגיאת משתמש');
                done();
            })
    })
})

describe('PUT /calendar', () => {
    it('should add new personal event for asking user', (done) => {
        chai.request(server)
            .put('/calendar')
            .send({
                username: 'deanz@cal.co.il',
                token: token,
                event: {
                    title: 'test',
                    description: 'test',
                    start: '12-12-18'
                }
            })
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal('application/json');
                res.body.success.should.eql('true');
                res.body.message.should.equal('אירוע נוצר בהצלחה');
                res.body.should.include.keys(
                    'success', 'message', 'event'
                );
                event_id = res.body.event._id;
                done();
            })
    })
    it('should return error if username does not exist', (done) => {
        chai.request(server)
            .put('/calendar')
            .send({
                username: 'test@cal.co.il',
                event: {}
            })
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal('application/json');
                res.body.success.should.eql('false');
                res.body.message.should.equal('שגיאת משתמש');
                done();
            })
    })
    it('should return error if token is incorrect', (done) => {
        chai.request(server)
            .put('/calendar')
            .send({
                username: 'deanz@cal.co.il',
                token: '123',
                event: {}
            })
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal('application/json');
                res.body.success.should.eql('false');
                res.body.message.should.equal('שגיאת משתמש');
                done();
            })
    })
})

describe('post /calendar/:id', () => {
    it('should return error if username does not exist', (done) => {
        chai.request(server)
            .post('/calendar/' + event_id)
            .send({
                username: 'test@cal.co.il',
                event: {}
            })
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal('application/json');
                res.body.success.should.eql('false');
                res.body.message.should.equal('שגיאת משתמש');
                done();
            })
    })
    it('should return error if token is incorrect', (done) => {
        chai.request(server)
            .post('/calendar/' + event_id)
            .send({
                username: 'deanz@cal.co.il',
                token: '123',
                event: {}
            })
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal('application/json');
                res.body.success.should.eql('false');
                res.body.message.should.equal('שגיאת משתמש');
                done();
            })
    })
    it('should return error if event id is incorrect', (done) => {
        chai.request(server)
            .post('/calendar/' + db.Types.ObjectId(123))
            .send({
                username: 'deanz@cal.co.il',
                token: token,
                event: {}
            })
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal('application/json');
                res.body.success.should.eql('false');
                done();
            })
    })
    it('should update specific personal event for asking user', (done) => {
        chai.request(server)
            .post('/calendar/' + event_id)
            .send({
                username: 'deanz@cal.co.il',
                token: token,
                event: {
                    title: 'test update',
                    description: 'test update'
                }
            })
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal('application/json');
                res.body.success.should.eql('true');
                res.body.message.should.equal('אירוע עודכן בהצלחה');
                done();
            })
    })

})

describe('DELETE /calendar/:id', () => {
    it('should return error if username does not exist', (done) => {
        chai.request(server)
            .delete('/calendar/' + event_id)
            .send({
                username: 'test@cal.co.il'
            })
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal('application/json');
                res.body.success.should.eql('false');
                res.body.message.should.equal('שגיאת משתמש');
                done();
            })
    })
    it('should return error if token is incorrect', (done) => {
        chai.request(server)
            .delete('/calendar/' + event_id)
            .send({
                username: 'deanz@cal.co.il',
                token: '123'
            })
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal('application/json');
                res.body.success.should.eql('false');
                res.body.message.should.equal('שגיאת משתמש');
                done();
            })
    })
    it('should return error if event id is incorrect', (done) => {
        chai.request(server)
            .delete('/calendar/' + db.Types.ObjectId(123))
            .send({
                username: 'deanz@cal.co.il',
                token: token
            })
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal('application/json');
                res.body.success.should.eql('false');
                done();
            })
    })
    it('should delete specific personal event for asking user', (done) => {
        chai.request(server)
            .delete('/calendar/' + event_id)
            .send({
                username: 'deanz@cal.co.il',
                token: token
            })
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal('application/json');
                res.body.success.should.eql('true');
                res.body.message.should.equal('אירוע נמחק בהצלחה');
                done();
            })
    })
})

describe('POST /permitedCalendar/givepermissions', () => {
    it('should give permission to selected username', (done) => {
        chai.request(server)
            .post('/permitedCalendar/givepermissions')
            .send({
                username: 'deanz@cal.co.il',
                token: token,
                permiteduname: 'ofekz@cal.co.il'
            })
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal('application/json');
                res.body.success.should.eql('true');
                res.body.message.should.equal('הרשאה ניתנה בהצלחה');
                done();
            })
    })
    it('should return error if username does not exist', (done) => {
        chai.request(server)
            .post('/permitedCalendar/givepermissions')
            .send({
                username: 'test@cal.co.il'
            })
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal('application/json');
                res.body.success.should.eql('false');
                res.body.message.should.equal('שגיאת משתמש');
                done();
            })
    })
    it('should return error if user to permit was not found', (done) => {
        chai.request(server)
            .post('/permitedCalendar/givepermissions')
            .send({
                username: 'deanz@cal.co.il',
                token: token,
                permiteduname: 'test@cal.co.il'
            })
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal('application/json');
                res.body.success.should.eql('false');
                res.body.message.should.equal('משתמש לא נמצא');
                done();
            })
    })
    it('should return error if user is already permited', (done) => {
        chai.request(server)
            .post('/permitedCalendar/givepermissions')
            .send({
                username: 'deanz@cal.co.il',
                token: token,
                permiteduname: 'dorz@cal.co.il'
            })
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal('application/json');
                res.body.success.should.eql('false');
                res.body.message.should.equal('למשתמש זה כבר קיימת הרשאה');
                done();
            })
    })
})

describe('DELETE /permitedCalendar/removepermission/:username_to_remove', () => {
    it('should return error if given username was not permited to begin with', (done) => {
        chai.request(server)
            .delete('/permitedCalendar/removepermission/edenz@cal.co.il')
            .send({
                username: 'deanz@cal.co.il',
                token: token
            })
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal('application/json');
                res.body.success.should.eql('false');
                res.body.message.should.equal('משתמש לא נמצא ברשימת מורשים');
                done();
            })
    })
    it('should return error if username to remove permission does not exist', (done) => {
        chai.request(server)
            .delete('/permitedCalendar/removepermission/123')
            .send({
                username: 'deanz@cal.co.il',
                token: token
            })
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal('application/json');
                res.body.success.should.eql('false');
                res.body.message.should.equal('שגיאה במציאת משתמש');
                done();
            })
    })
    it('should return error if user asking was not found', (done) => {
        chai.request(server)
            .delete('/permitedCalendar/removepermission/ofekz@cal.co.il')
            .send({
                username: '123'
            })
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal('application/json');
                res.body.success.should.eql('false');
                res.body.message.should.equal('שגיאת משתמש');
                done();
            })
    })
    it('should remove permission from selected user', (done) => {
        chai.request(server)
            .delete('/permitedCalendar/removepermission/ofekz@cal.co.il')
            .send({
                username: 'deanz@cal.co.il',
                token: token
            })
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal('application/json');
                res.body.success.should.eql('true');
                res.body.message.should.equal('הרשאה הוסרה בהצלחה');
                done();
            })
    })
})