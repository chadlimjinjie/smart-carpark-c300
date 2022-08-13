const express = require('express');
const router = express.Router();

const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
var path = require('path');

const crypto = require('crypto');
const bcrypt = require('bcrypt');

const connection = require('../db.config');

const saltRounds = 10;


router.get('/', async (req, res) => {
    res.json({ status: 'working' });
});

/**
 * loadNotificationType
 * loadUserRoles
 * createTestUsers
 * createTestGuests
 * createTestReservation
 * createTestNotifications
 */

router.get('/loadNotificationTypes', async (req, res) => {
    var sql = 'INSERT INTO `notification` (`type`) VALUES ?';
    var values = [
        ['Reservation Confirmation'],
        ['Guest Arrival'],
        ['VIP Arrival'],
        ['Broadcast'],
        ['Traffic Jam']
    ];
    connection.query(sql, [values], (error, result) => {
        if (result) {
            console.log('Notification types loaded');
            console.log(result);
            res.json(result);
        } else {
            console.log('Error > ', error);
            res.json(error);
        }
    });
});

router.get('/loadUserRoles', async (req, res) => {
    var sql = 'INSERT INTO `role` (`role_title`) VALUES ?';
    var values = [
        ['Staff'],
        ['Manager']
    ];
    connection.query(sql, [values], (error, result) => {
        if (result) {
            console.log('Role types loaded');
            console.log(result);
            res.json(result);
        } else {
            console.log('Error > ', error);
            res.json(error);
        }
    });
});


router.get('/createTestUsers', async (req, res) => {
    var manager1 = ['19028690@myrp.edu.sg', 'Chad Lim', '@Republic1', 2];
    var manager2 = ['19047116@myrp.edu.sg', 'Ryan Lee', '@Republic1', 2];
    var manager3 = ['19013309@myrp.edu.sg', 'Gu Jiawei', '@Republic1', 2];
    var manager4 = ['19027459@myrp.edu.sg', 'Leslie', '@Republic1', 2];
    var manager5 = ['19007162@myrp.edu.sg', 'Wei Qiang', '@Republic1', 2];
    var manager6 = ['19013377@myrp.edu.sg', 'Ariel Wang', '@Republic1', 2];
    var staff1 = ['staff1@gmail.com', 'Chad Lim', '@Republic1', 1];
    var staff2 = ['staff2@gmail.com', 'Ryan Lee', '@Republic1', 1];
    var staff3 = ['staff3@gmail.com', 'Gu Jiawei', '@Republic1', 1];
    var staff4 = ['staff4@gmail.com', 'John Lim', '@Republic1', 1];
    var staff5 = ['staff5@gmail.com', 'Dim Sum', '@Republic1', 1];
    var staff6 = ['staff6@gmail.com', 'Skywalker', '@Republic1', 1];
    var staff7 = ['staff7@gmail.com', 'Wei Qiang', '@Republic1', 1];
    var staff8 = ['staff8@gmail.com', 'Leslie', '@Republic1', 1];
    var staff9 = ['staff9@gmail.com', 'Ariel', '@Republic1', 1];
    var sql = 'INSERT INTO `user` (`email`, `fullname`, `password`, `role_id`) VALUES ?';
    var values = [
        manager1,
        manager2,
        manager3,
        manager4,
        manager5,
        manager6,
        staff1,
        staff2,
        staff3,
        staff4,
        staff5,
        staff6,
        staff7,
        staff8,
        staff9,
    ];
    for (i in values) {
        password = crypto.createHash('sha512').update(values[i][2]).digest("hex");
        var hashedPassword = await bcrypt.hash(password, saltRounds)
        values[i][2] = hashedPassword;
    }
    connection.query(sql, [values], (error, result) => {
        if (result) {
            console.log('Test users added');
            console.log(result);
            res.json(result);
        } else {
            console.log('Error > ', error);
            res.json(error);
        }
    });
});


router.get('/createTestGuests', async (req, res) => {
    var guest1 = ['shyna.qaq@gmail.com', 'gu jiawei', 'ABC1234D'];
    var guest2 = ['john_wu@gmail.com', 'john wu', 'SJK9884E'];
    var guest3 = ['andy_lee@gmail.com', 'andy lee', 'SGP1234E'];
    var guest4 = ['john_walker@gmail.com', 'john walker', 'SGX4327X'];
    var sql = 'INSERT INTO `guest` (`email`, `fullname`, `vehicle_number`) VALUES ?';
    var values = [
        guest1,
        guest2,
        guest3,
        guest4
    ];
    connection.query(sql, [values], (error, result) => {
        if (result) {
            console.log('Test guests added');
            console.log(result);
            res.json(result);
        } else {
            console.log(error);
            res.json(error);
        }
    });
});

router.get('/createTestReservation', async (req, res) => {
    // start_datetime, end_datetime, user_id, guest_id
    var reservation1 = ['2021-05-01', '11:23:54', '12:23:54', true, 1, 2];
    var reservation2 = ['2021-05-01', '11:23:54', '12:23:54', false, 2, 1];
    var sql = 'INSERT INTO `reservation` (`reservation_date`, `start_time`, `end_time`, `is_vip`, `user_id`, `guest_id`) VALUES ?';
    var values = [
        reservation1,
        reservation2
    ];
    connection.query(sql, [values], (error, result) => {
        if (result) {
            console.log('Test reservations added');
            console.log(result);
            res.json(result);
        } else {
            console.log(error);
            res.json(error);
        }
    });
});

router.get('/createTestNotifications', async (req, res) => {

    var notification1 = [1, 1, 1];
    var notification2 = [1, 2, 1];
    var notification3 = [2, 1, 2];
    var notification4 = [2, 3, 2];
    var notification5 = [1, 1, 1];
    var notification6 = [1, 2, 1];
    var notification7 = [2, 1, 1];
    var notification8 = [2, 3, 1];

    var sql = 'INSERT INTO `user_notification` (`user_id`, `notification_id`, `reservation_id`) VALUES ?';
    var values = [
        notification1,
        notification2,
        notification3,
        notification4,
        notification5,
        notification6,
        notification7,
        notification8,
        notification8
    ];

    connection.query(sql, [values], (error, result) => {
        if (result) {
            console.log('Test notifications added');
            console.log(result);
            res.json(result);
        } else {
            console.log(error);
            res.json(error);
        }
    });
});


router.post('/checkPass', async (req, res) => {
    // read QR code data from the application
    var { pass_id } = req.body;
    // check with database
    /**
     * v1 check only the complimentary_pass table
     * SELECT * FROM complimentary_pass AS CP WHERE pass_id=? AND is_used IS FALSE
     */
    /**
     * v2 check reservation and complimentary_pass table
     * SELECT * FROM reservation AS R 
     * INNER JOIN complimentary_pass AS CP ON CP.pass_id = R.pass_id
     * WHERE R.pass_id=? AND CP.is_used IS FALSE
     */
    var checkPass = `SELECT * FROM reservation AS R 
    INNER JOIN complimentary_pass AS CP ON CP.pass_id = R.pass_id
    WHERE R.pass_id=? AND CP.is_used IS FALSE`;
    connection.query(checkPass, [pass_id], (error, result) => {
        console.log(result);
        console.log(error);
        if (result.length > 0) {
            res.json({ 'valid': true });
        } else {
            res.json({ 'valid': false });
        }
    });
});


module.exports = router;
