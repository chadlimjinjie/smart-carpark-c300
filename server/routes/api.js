const express = require('express');
const router = express.Router();

const moment = require('moment');
const nodemailer = require('nodemailer');

const cron = require('node-cron');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
var path = require('path');

const bcrypt = require('bcrypt');
const nodePin = require('node-pin');

const { google } = require('googleapis')

const { OAuth2 } = google.auth

const oAuth2Client = new OAuth2('272844094573-m8dsafr9ubnr2rae0uqk7s2cb6fumvmb.apps.googleusercontent.com', 'lJkib0hhCVzIe_Y_euzUleQb')

oAuth2Client.setCredentials({
    refresh_token: '1//04RbTwOtRmGEZCgYIARAAGAQSNwF-L9Ireh6oZt9dd6dWfJgftVF6exwCqcSkrv9OWgBDevHIaGYLNxaB9LQu2qOpf7mdtXrKNSU'
});

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

const fs = require("fs");
var FileReader = require('filereader');
const faceRecognition = require('./faceRecognition');

const connection = require('../db.config');

const traffic = require('../models/traffic')

const saltRounds = 10;
let pinQueue = [];
var pinId = 0;

// Email function start
async function main(message) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: "c4017197@gmail.com", // generated ethereal user
            pass: "xddnaibkoskrshkt", // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail(message);

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

}

function CreateCalendar(date, stime, etime, email) {

    const eventStartTime = new Date(date + 'T' + stime)
    //date format:  2021-08-05
    //time format:  15:30
    console.log(eventStartTime)

    const eventEndTime = new Date(date + 'T' + etime)
    //IANA time zone database name
    console.log(eventEndTime)

    const event = {
        summary: 'Meeting at Republic Polytechnic',
        location: 'Republic Polytechnic, 9 Woodlands Ave 9, Singapore 738964',
        description: 'Meeting staff at level 1',
        start: {
            dateTime: eventStartTime,
            timeZone: 'Asia/Singapore'
        },
        end: {
            dateTime: eventEndTime,
            timeZone: 'Asia/Singapore'
        },
        transparency: "transparent",
        reminders: {
            useDefault: false,
            overrides: [
                {
                    method: "email",
                    minutes: 120
                },
                {
                    method: "popup",
                    minutes: 120
                }
            ]
        },
        attendees: [
            {
                email: email,
                responseStatus: 'needsAction',
            }
        ],
        colorId: 1,
    }
    calendar.freebusy.query(
        {
            resource: {
                timeMin: eventStartTime,
                timeMax: eventEndTime,
                timeZone: 'Asia/Singapore',
                items: [{ id: 'primary' }]
            },
        },
        (err, res) => {
            if (err) return console.error('Free Busy Query Error: ', err)

            const eventsArr = res.data.calendars.primary.busy

            if (eventsArr.length === 0) return calendar.events.insert({ calendarId: 'primary', resource: event },
                err => {
                    if (err) return console.error('Calendar Event Creation Error: ', err)
                    return console.log('Calendar Event Created.')
                }
            )
            return console.log("Failed, Busy.")
        }
    )

}

/**
 * Ryans' PIN function
 */
function sendEmail(to, subject, body, filename, path) {
    console.log(filename, path)
    if (filename === undefined && path === undefined) {
        var message = {
            from: '"Republic Polytechnic Smart Car Park" <c4017197@gmail.com>',
            to: to,
            subject: subject,
            text: body,
        };
    } else {
        var message = {
            from: '"Republic Polytechnic Smart Car Park" <c4017197@gmail.com>',
            to: to,
            subject: subject,
            text: body,
            attachments: [
                {
                    filename: filename,
                    path: path
                }
            ]
        };
    }
    main(message).catch(console.error);
}

function generatePin(email) {
    var pinCode = nodePin.generateRandPin(6);
    while (checkPinQueue(pinCode)) {
        pinCode = nodePin.generateRandPin(6);
    }
    var pin = { id: pinId, pin: pinCode }
    pinId += 1;
    pinQueue.push(pin);
    console.log(pinQueue);
    sendEmail(email, "6-pin Verification",
        `Your verification code is: ${pin.pin}\n\nThis verification code will expire 5 minutes after being issued.\n\nYour account will not be able to be accessed without this verification code.`)
    return pin;
}

function checkPinQueue(id, pin) {
    if (pinQueue.length != 0) {
        for (i = 0; i < pinQueue.length; i++) {
            if (id == pinQueue[i].id && pin == pinQueue[i].pin) {
                console.log("Submitted pin: " + pin)
                console.log("Registered pin: " + pinQueue[i].pin)
                return true;
            }
        }

    }
    return false;
}

router.get('/', async (req, res) => {
    res.json({ status: 'working' });
});




/**
 * TODO:
 * 1. Return user information to application. Done
 * 2. Store the user information on the application using expo-secure-store. Done
 */
/**
 * Ryan's Function
 * • Login
 * • Register
 * • 2FA PIN
 * • Reset Password
 */
router.post("/login", (req, res) => {
    var { email } = req.body.Email;
    var { password } = req.body.Password;
    var queryString = "SELECT * FROM user WHERE email = ?;"
    var filter = [email]
    connection.query(queryString, filter, function (err, results) {
        //process results
        if (results.length > 0) {
            if (bcrypt.compareSync(password, results[0].password)) {
                console.log("We did it!")
                res.send({
                    check: true,
                    user_id: results[0].user_id,
                    email: results[0].email,
                    fullname: results[0].fullname,
                    role_id: results[0].role_id,
                    face: results[0].face
                })
            } else {
                res.send({
                    check: false
                })
            }

        } else {
            res.send({
                check: false
            })
        }
    });
})

router.post("/register", (req, res) => {
    var { fullName } = req.body.FullName;
    var { email } = req.body.Email;
    var { password } = req.body.Password;
    var queryString = "INSERT INTO user (email, fullname, password, role_id) VALUES (?, ?, ?, 1);";
    bcrypt.hash(password, saltRounds, function (err, hash) {
        // Store hash in your password DB.
        var filter = [email, fullName, hash];
        connection.query(queryString, filter, function (err, results) {
            //process results
            if (results) {
                console.log("We did it!")
                res.send(true)
            } else {
                console.log("Didn't work!")
                console.log(err)
                res.send(false)
            }
        });
    });
})

router.post("/startPin", (req, res) => {
    var { email } = req.body.Email;
    var pin = generatePin(email);
    res.send({
        id: pin.id
    });
    res.end();
});

router.post('/checkPin', (req, res) => {
    var { id } = req.body.pinId;
    var { pin } = req.body.pin;
    var check = false;
    if (checkPinQueue(id, pin)) {
        check = true;
    }
    if (check) {
        res.send(true);
    } else {
        res.send(false);
    }
    res.end();

})

router.post("/clearPin", (req, res) => {
    var { id } = req.body.pinId;
    for (i = 0; i < pinQueue.length; i++) {
        if (pinQueue[i].id == id) {
            pinQueue.splice(i, 1);
            break;
        }
    }
    res.end();
})

router.post("/forgotPassword", (req, res) => {
    var { email } = req.body.Email;
    var queryString = "SELECT * FROM user WHERE email = ?;"
    var filter = [email]
    connection.query(queryString, filter, function (err, results) {
        //process results
        if (results.length > 0) {
            res.send({
                check: true,
                email: results[0].email
            })

        } else {
            res.send({
                check: false
            })
        }
    })
})

router.post("/resetPassword", (req, res) => {
    var { email } = req.body.Email;
    var { password } = req.body.Password;
    var queryString = "UPDATE user SET password = ? WHERE email = ?;";
    bcrypt.hash(password, saltRounds, function (err, hash) {
        // Store hash in your password DB.
        var filter = [hash, email];
        connection.query(queryString, filter, function (err, results) {
            //process results
            if (results) {
                console.log("We did it!")
                res.send(true)
            } else {
                console.log("Didn't work!")
                console.log(err)
                res.send(false)
            }
        });
    });
})

router.post("/sendBroadcast", (req, res) => {
    var { userID } = req.body.UserID;
    var { category } = req.body.Category;
    var { message } = req.body.Message;
    var { image64 } = req.body.Image64;


    if (image64 == '') {
        var queryString = "INSERT INTO broadcast (broadcast_category, broadcast_message, broadcast_creator) VALUES (?, ?, ?);";
        var filter = [category, message, userID];
    } else {
        var queryString = "INSERT INTO broadcast (broadcast_category, broadcast_message, broadcast_creator, broadcast_image) VALUES (?, ?, ?, ?);";
        var filter = [category, message, userID, image64];
    }
    connection.query(queryString, filter, function (err, results) {
        //process results
        if (results) {
            //var createNotification = "INSERT INTO `user_notification` (`user_id`, `notification_id`, `reservation_id`) VALUES (?, 4, ?)";
            broadcastOut(userID);
            console.log("We did it!")
            res.send(true)
        } else {
            console.log("Didn't work!")
            console.log(err)
            res.send(false)
        }
    });
})

function broadcastOut(userID) {
    var broadcastID = null;
    var check = false;
    var message = ""
    var queryString = "SELECT * FROM broadcast ORDER BY broadcast_id desc LIMIT 1;";
    connection.query(queryString, function (err, results) {
        if (results.length > 0) {
            broadcastID = results[0].broadcast_id
            console.log("Starting")

            queryString = "SELECT * FROM user WHERE role_id = 2";
            connection.query(queryString, function (err, results) {
                if (results.length > 0) {
                    //queryString = "INSERT INTO `user_notification` (`user_id`, `notification_id`, `reservation_id`) VALUES (?, 4, ?)"
                    queryString = "INSERT INTO `user_notification` (`user_id`, `notification_id`, `broadcast_id`) VALUES "
                    for (var i = 0; i < results.length; i++) {
                        if (results[i].user_id != userID) {
                            queryString += `(${results[i].user_id}, 4, ${broadcastID}), `;

                        }
                    }
                    queryString = queryString.substring(0, queryString.length - 2);
                    queryString += ";";
                    console.log(queryString);
                    connection.query(queryString, function (err, results) {
                        if (results) {
                            console.log("Completed")
                        } else {
                            console.log(err)
                        }
                    })
                }
            })
        }
    })
}

router.get('/getBroadcast', function (req, res) {
    var { id } = req.query;
    var queryString = `SELECT *
                    FROM broadcast 
                    INNER JOIN user
                    ON broadcast.broadcast_creator = user.user_id
                    WHERE broadcast_id = ${id};`;
    connection.query(queryString, (error, result) => {
        if (result) {
            //console.log(result[0].broadcast_image);
            res.send({
                check: true,
                category: result[0].broadcast_category,
                message: result[0].broadcast_message,
                creator: result[0].fullname,
                image64: result[0].broadcast_image

            })

        } else {
            console.log(error);
            res.send({
                check: false
            })
        }
    });
})


router.post('/getCarEntries', function (req, res) {
    var { date } = req.body.SendDate;
    var queryString = `SELECT * FROM car_entry WHERE date_of_entry = '${date}'`
    connection.query(queryString, (error, result) => {
        //console.log(result);
        if (result) {
            //console.log(result);
            res.send(result)
        } else {
            console.log(error);
            res.send([])
        }
    });
})

router.get('/getWeek', function (req, res) {
    var { date } = req.query;
    var today = moment(date);
    //console.log('here')
    res.send({
        start: today.startOf('isoweek').format().slice(0, 10),
        end: today.endOf('isoweek').format().slice(0, 10),
    })
})

router.post('/getWeekCarEntries', function (req, res) {
    var { start } = req.body.startDate;
    var { end } = req.body.endDate;
    var queryString = `SELECT * FROM car_entry WHERE date_of_entry >= '${start}' AND date_of_entry <= '${end}'`
    connection.query(queryString, (error, result) => {
        //console.log(result);
        if (result) {
            //console.log(result);
            res.send(result)
        } else {
            console.log(error);
            res.send([])
        }
    });
})

router.post('/getMonthCarEntries', function (req, res) {
    var { month } = req.body.month;
    var { year } = req.body.year;
    //console.log(month);
    //console.log(year);
    var queryString = `SELECT * FROM car_entry WHERE MONTH(date_of_entry) = ${month} AND YEAR(date_of_entry) = ${year};`
    connection.query(queryString, (error, result) => {
        //console.log(result);
        if (result) {
            //console.log(result);
            res.send(result)
        } else {
            console.log(error);
            res.send([])
        }
    });
})

router.get('/getPricing', function (req, res) {
    var query = "SELECT entry_fee, interval_fee, interval_time FROM carpark_setting ORDER BY setting_id desc LIMIT 1;";
    connection.query(query, (error, result) => {
        if (result) {
            //console.log(result);
            res.send({
                check: true,
                entry_fee: result[0].entry_fee,
                interval_fee: result[0].interval_fee,
                interval_time: result[0].interval_time
            });
        } else {
            console.log(error);
            res.send({
                check: false
            });
        }
    })
})

router.post('/getBalance', function (req, res) {
    var { items } = req.body.items;

    //console.log("here");
    //console.log(items);
    var query = "SELECT entry_fee, interval_fee, interval_time FROM carpark_setting ORDER BY setting_id desc LIMIT 1;";
    connection.query(query, (error, result) => {
        var entryFee = result[0].entry_fee;
        var intervalFee = result[0].interval_fee;
        var intervalTime = "";

        //console.log(result[0].interval_time.toString());

        if (result[0].interval_time.toString().slice(16, 18).charAt(0) == '0') {
            intervalTime = result[0].interval_time.toString().slice(17, 18)
        } else {
            intervalTime = result[0].interval_time.toString().slice(16, 18)
        }

        if (items != []) {
            var total = 0;
            for (var i = 0; i < items.length; i++) {
                const holdDate = new Date(items[i].date_of_entry.slice(0, 10))
                holdDate.setDate(holdDate.getDate())

                const split_entry_time = items[i].entry_time.split(":");
                const split_exit_time = items[i].exit_time.split(":");

                var setting_entry_time = new Date(holdDate);
                var setting_exit_time = new Date(holdDate);

                if (split_entry_time[0].charAt(0) == '0') {
                    split_entry_time[0] = split_entry_time[0].slice(1, 2);
                }
                if (split_entry_time[1].charAt(0) == '0') {
                    split_entry_time[1] = split_entry_time[1].slice(1, 2);
                }

                if (split_exit_time[0].charAt(0) == '0') {
                    split_exit_time[0] = split_exit_time[0].slice(1, 2);
                }
                if (split_exit_time[1].charAt(0) == '0') {
                    split_exit_time[1] = split_exit_time[1].slice(1, 2);
                }

                const entry_hour = split_entry_time[0]// - 16
                const exit_hour = split_exit_time[0]// - 16

                setting_entry_time.setHours(entry_hour, split_entry_time[1], split_entry_time[2])
                setting_exit_time.setHours(exit_hour, split_exit_time[1], split_exit_time[2])


                var duration = setting_exit_time - setting_entry_time;
                var diff_hours = (Math.abs(duration) / (60 * 60 * 1000)) | 0;


                var price = entryFee + (intervalFee * (diff_hours * parseInt(intervalTime)));
                //console.log(items[i].vehicle_number + " " + price);
                total = total + price;
                //console.log(total);
            }

            res.send({
                balance: total
            });
        }

    })

});

router.post("/face", (req, res) => {

    var result = false;
    var { photo } = req.body.Photo;
    var { id } = req.body.id;

    var queryString = "SELECT * FROM user WHERE user_id = ?;"
    var filter = [id]
    connection.query(queryString, filter, function (err, results) {
        if (results.length > 0) {
            console.log("Doing well")
            const buffer = Buffer.from(results[0].face, "base64");
            fs.writeFileSync("Test.jpg", buffer);
            console.log(req.body.id);
            const bufferTwo = Buffer.from(photo, "base64");
            fs.writeFileSync("Testing.jpg", bufferTwo);
            console.log("Complete");
            faceRecognition.faceRecog().then(value => {
                fs.unlinkSync('Test.jpg')
                fs.unlinkSync('Testing.jpg')
                console.log("value > " + value);
                if (value < 0.35) {
                    console.log("face checks out")
                    res.send(true);
                } else {
                    console.log("Did not check out")
                    res.send(false);
                }
            });
        } else {
            console.log('well fuck')
            console.log(err)
            res.send(false);
        }
    })

    // console.log(req.body.id);
    // const buffer = Buffer.from(photo, "base64");
    // fs.writeFileSync("Testing.jpg", buffer);
    // console.log("Complete");
    // faceRecognition.faceRecog().then(value => {
    //     fs.unlinkSync('Test.jpg')
    //     fs.unlinkSync('Testing.jpg')
    //     console.log("value > " + value);
    //     if (value < 0.35) {
    //         console.log("face checks out")
    //         res.send(true);
    //     } else {
    //         console.log("Did not check out")
    //         res.send(false);
    //     }
    // });

})

router.post("/UserFaceCapture", (req, res) => {
    var { photo } = req.body.Photo;
    var { id } = req.body.id;
    console.log(req)
    console.log(photo);
    var queryString = `UPDATE user SET face = "${photo}" WHERE user_id = ${id};`;
    connection.query(queryString, (error, result) => {
        if (result.affectedRows > 0) {
            res.send(true)
        } else {
            console.log(error)
            res.send(false)
        }
    })
})



/**
 * DONE:
 * 1. Jiawei's email functionality to inform guest that a reservation has been made for them
 * 2. Chad's Notification function to inform the user that they have created a reservation for their guest
 */
/**
 * Wei Qiang's function
 * • Auto-fill form by license plate number
 * • Create reservation
 */
function checkGuest(id, email, name, vrn, callback) {
    if (id == 0) {
        var guestSql = `INSERT INTO guest
      (
      email,
      fullname,
      vehicle_number
      )
      VALUES
      (
      '${email}',
      '${name}',
      '${vrn}'
      );`;

        connection.query(guestSql, (error, result) => {

            console.log(error);

            console.log(result);
            callback(result.insertId)

        });
    } else {
        callback(id);
    }
}

router.get("/guest/:vrn", async (req, res) => {
    var vrn = req.params;
    console.log('get info from vrn');
    console.log(vrn.vrn)
    var sqlStatement = `SELECT * FROM guest WHERE vehicle_number = '${vrn.vrn}'`;
    connection.query(sqlStatement, (error, result) => {
        if (result) {
            res.json(result);
            console.log(result);
        } else {
            console.log(error);
        }
    });
});

router.get("/role", async (req, res) => {
    var sqlStatement = "SELECT * FROM guest_role Order By role_id DESC LIMIT 1;"; // Select all guest entries from the guest table
    connection.query(sqlStatement, (error, result) => {
        // Do something with the result/error

        if (result) {
            res.json(result);
            console.log(result);
        } else {
            console.log(error);
        }
    });
});


router.post("/createReservation", async (req, res) => {
    var { name, email, vrn, date, stime, etime, vip, evc, id, guest } = req.body;
    console.log(name, email, vrn, date, stime, etime, vip, evc, id, guest);
    if (vip == "") {
        vip = false;
    } else {
        vip = true
    }


    var createNotification = "INSERT INTO `user_notification` (`user_id`, `notification_id`, `reservation_id`) VALUES (?, ?, ?)";


    checkGuest(guest, email, name, vrn, (guest) => {
        var sqlStatement = `INSERT INTO reservation
      (
      reservation_date,
      start_time,
      end_time,
      is_vip,
      user_id,
      guest_id
      )
      VALUES
      (
      date('${date}'),
      time("${stime}"),
      time("${etime}"),
      ${vip},
      ${id},
      ${guest});`;
        connection.query(sqlStatement, (error, result) => {
            // Do something with the result/error

            if (result) {
                console.log(result);

                connection.query(createNotification, [id, 1, result.insertId], (error, result) => {
                    if (result) {
                        console.log("Reservation notification generated. > ", result);

                    } else {
                        console.log("There was an issue generating the notification. > ", error);
                    }
                });
                res.json(result.affectedRows);
            } else {
                console.log(error);
            }

        });

    })

    CreateCalendar(date, stime, etime, email);

    var message = {
        from: '"Republic Polytechnic Smart Car Park" <c4017197@gmail.com>',
        to: `${email}`,
        subject: "Invitation",
        text: `Dear Mr/Ms ${name},
        We have reserved a car park lot for ${vrn}, on ${date} from ${stime} to ${etime}. 
        Directions: https://www.google.com/maps/place/Republic+Crescent,+Republic+Polytechnic+Open+Parking+Lot/@1.4435996,103.7873385,21z/data=!4m12!1m6!3m5!1s0x31da1305aa7388d7:0x2b7f5e0463382f8!2sRepublic+Polytechnic!8m2!3d1.4428559!4d103.7856195!3m4!1s0x31da1308ae816765:0x3f5ca2e704e43c51!8m2!3d1.4437185!4d103.7873959`,
    };
    main(message).catch(console.error);



});

router.get("/report/:userId", async (req, res) => {
    var { userId } = req.params;
    console.log(userId)
    // var sqlStatement = `SELECT * FROM reservation WHERE user_id = ${userId} AND reservation_date >= curdate() order by reservation_date,start_time;`;
    var sqlStatement = `SELECT * FROM reservation R INNER JOIN guest G ON G.guest_id = R.guest_id WHERE user_id = ${userId} AND reservation_date >= curdate() order by reservation_date,start_time;`
    connection.query(sqlStatement, (error, result) => {

        if (result) {
            res.json(result);
            console.log(result);
        } else {
            console.log(error);
        }
    });
});

router.delete("/report/:id", async (req, res) => {
    var { id } = req.params;
    var sqlStatement = `DELETE FROM reservation WHERE reservation_id=${id};`;
    connection.query(`DELETE FROM user_notification WHERE reservation_id=${id};`, (error, result) => {
    });
    connection.query(`DELETE FROM reservation_share WHERE reservation_id=${id};`, (error, result) => {
    });
    connection.query(sqlStatement, (error, result) => {
        if (result) {
            res.json(result.affectedRows);
            console.log(result);
        } else {
            console.log(error);
        }
    });
})


/**
 * Chad's Function
 * • View All Notification
 * • Generate Notification from system
 * • Delete Notification
 * • Delete All Notification
 * • Issue complementary pass
 * • Checkout complementary pass
 * • View traffic jam
 */

/**
 * View All Notification
 */
router.get('/getNotifications/:user_id', async (req, res) => {
    var { user_id } = req.params;
    var { type_id } = req.query;
    console.log('User > ', user_id);
    // Select all notification belonging to the requested user WHERE user_id=${user_id}.
    console.log('type_id > ', type_id);
    var selectNotifications = `SELECT UN.un_id AS id, N.notification_id AS type_id, type AS title, fullname, timestamp, broadcast_id FROM user_notification AS UN
        LEFT JOIN notification AS N ON N.notification_id = UN.notification_id
        LEFT JOIN reservation AS R ON UN.reservation_id = R.reservation_id
        LEFT JOIN guest AS G ON R.guest_id = G.guest_id
        WHERE UN.user_id=${user_id} AND N.notification_id IN (${type_id}) ORDER BY id DESC`;

    connection.query(selectNotifications, (error, result) => {
        if (result) {
            console.log(result);
            res.json(result);
        } else {
            res.json([]);
        }
    });
});


/**
 * Delete Notification
 */
router.get('/deleteNotification/:unId', async (req, res) => {
    var { unId } = req.params;
    var sql = 'DELETE FROM `user_notification` WHERE un_id=?';
    connection.query(sql, [unId], (error, result) => {
        if (result) {
            console.log(result);
            res.json(result);
        } else {
            console.log(error);
            res.json(error);
        }
    });
});


/**
 * Delete All Notification
 */
router.get('/clearAllNotifications/:userId', async (req, res) => {
    var { userId } = req.params;
    var { type_id } = req.query;
    var sql = `DELETE FROM user_notification WHERE user_id=? AND notification_id IN (${type_id});`;
    connection.query(sql, [userId], (error, result) => {
        if (result) {
            console.log(result);
            res.json(result);
        } else {
            console.log(error);
            res.json(error);
        }
    });
});


/**
 * Issue complementary pass
 */
function issuePass(callback) {
    var insertPass = 'INSERT INTO `complimentary_pass` (`pass_id`) VALUES (?)';
    var pass_id = uuidv4();
    connection.query(insertPass, [pass_id], (error, result) => {
        if (result.affectedRows > 0) {
            callback(pass_id);
        }
    });
}

cron.schedule('*/1 * * * *', () => {
    // var current_dt = new Date();
    // console.log(current_dt);
    var selectReservations = `SELECT * from reservation INNER JOIN guest ON reservation.guest_id=guest.guest_id WHERE reservation_date = CURDATE() AND pass_id IS NULL`;
    updatePass = "UPDATE `reservation` SET `pass_id` = ? WHERE `reservation_id` = ?";
    console.log('Checking for reservations to issue a pass');
    connection.query(selectReservations, (error, result) => {
        if (result) {
            if (result.length > 0) {
                console.log('There is a result');
                console.log(result);
                for (i in result) {
                    reservation_id = result[i].reservation_id;
                    console.log(reservation_id);
                    reservationDate = result[i].reservation_date;
                    startTime = result[i].start_time;
                    endTime = result[i].end_time;
                    email = result[i].email;
                    /**
                     * Insert pass into complementary pass table
                     */
                    issuePass((pass_id) => {
                        console.log(pass_id);
                        if (pass_id) {
                            // Get the newly inserted pass and update the reservation
                            connection.query(updatePass, [pass_id, reservation_id], (error, result) => {
                                console.log("Pass issued");
                                var file_path = `../tmp/${pass_id}.jpg`;
                                var message = `Your exit complimentary pass for ${reservationDate.toLocaleDateString()}, ${startTime} - ${endTime}. Please exit within the given time.`;
                                QRCode.toFile(path.join(__dirname, file_path), pass_id, () => {
                                    var imagePath = path.join(__dirname, file_path);
                                    sendEmail(email, 'Complimentary Carpark Exit Pass', message, `${pass_id}.jpg`, imagePath)
                                });
                            });
                        } else {
                            console.log("Pass not issued");
                        }
                    });
                }
            } else {
                console.log('There are no pass to issue.');
                console.log(error);
            }
        } else {
            console.log('There are no pass to issue.');
            console.log(error);
        }
    });
});

router.get('/complimentary/:pass_id', async (req, res) => {
    var { pass_id } = req.params;
    /**
     * SELECT * FROM complimentary_pass AS CP WHERE pass_id=? AND is_used IS FALSE
     */
    var checkPass = 'SELECT * FROM complimentary_pass AS CP WHERE pass_id=? AND is_used IS FALSE';
    var file_path = `../tmp/${pass_id}.jpg`;
    connection.query(checkPass, [pass_id], (error, result) => {
        if (result.length > 0) {
            console.log(result);
            QRCode.toFile(path.join(__dirname, file_path), pass_id, () => {
                res.sendFile(path.join(__dirname, file_path));
            });
        } else {
            console.log(error);
            res.end('This complimentary pass is not valid');
        }
    });
});

/**
 * Checkout pass
 */
router.post('/checkoutPass', async (req, res) => {
    /**
     * Method 1 Delete
     * DELETE FROM `complimentary_pass` WHERE pass_id=? AND is_used IS FALSE
     * 
     * Method 2 Update
     * UPDATE `complimentary_pass` SET `is_used` = 1 WHERE `pass_id` = ? AND is_used IS FALSE
     * 
     * When record is deleted can't audit
     */
    var current_dt = new Date();
    // read QR code data from the application/axios
    var { pass_id } = req.body;
    var checkPass = `SELECT * FROM complimentary_pass WHERE pass_id = ?`;
    var checkReservation = 'SELECT reservation_date, start_time, end_time, pass_id FROM reservation WHERE pass_id = ?';
    var checkoutPass = 'UPDATE `complimentary_pass` SET `is_used` = 1 WHERE `pass_id` = ? AND is_used IS FALSE';
    connection.query(checkPass, [pass_id], (error, result) => {
        if (result.length > 0) {
            connection.query(checkReservation, [pass_id], (error, result) => {
                if (result.length > 0) {
                    var row = result[0];
                    var reservation_date = row.reservation_date;
                    var start_time = row.start_time;
                    var end_time = row.end_time;
                    console.log(row);
                    console.log(reservation_date, start_time, end_time);
                    if (reservation_date.toLocaleDateString() == current_dt.toLocaleDateString() && (current_dt.toLocaleTimeString('it-IT') >= start_time && current_dt.toLocaleTimeString('it-IT') <= end_time)) {
                        // Update complimentary pass usage if not used yet.
                        connection.query(checkoutPass, [pass_id], (error, result) => {
                            // If update inform client that the pass is valid.
                            if (result.affectedRows > 0) {
                                console.log(result);
                                res.json({ validity: true, message: "Valid complimentary pass" });
                                // Inform the client the pass have already been use.
                            } else {
                                res.json({ validity: false, message: "Complimentary pass have already been used" });
                            }
                        });

                    } else {
                        // Valid but. Inform to checkout within the date and time.
                        res.json({ validity: false, message: "Please checkout within the reservation date and time" });
                    }
                }
            });
        } else {
            res.json({ validity: false, message: "Invalid complimentary pass" });
        }
    });
});


/**
 * View traffic jam
 */
router.get('/getTrafficThreshold', async (req, res) => {
    var selectTrafficThreshold = 'SELECT traffic_threshold FROM carpark_setting ORDER BY setting_id DESC LIMIT 1';
    connection.query(selectTrafficThreshold, (error, result) => {
        if (result) {
            if (result.length > 0) {
                res.json(result[0]);
            } else {
                res.json(result);
            }
        } else {
            console.log(error);
            res.json(error);
        }
    });
});


router.get('/getTraffic', async (req, res) => {
    var results = await traffic.findOne().select('-_id').exec();
    console.log(results);
    console.log('Cars > ', results.cars);
    res.json(results);
});


router.get('/checkLPN', async (req, res) => {
    var current_dt = new Date();
    var { lpn } = req.query;
    console.log(lpn);
    var sqlSelect = `SELECT * from guest G INNER JOIN reservation R ON G.guest_id=R.guest_id WHERE G.vehicle_number=?;`;
    connection.query(sqlSelect, [lpn], (error, result) => {
        console.log(result);
        console.log(error);
        if (result.length > 0) {
            for (i in result) {
                var row = result[i];
                var reservation_date = row.reservation_date;
                var start_time = row.start_time;
                var end_time = row.end_time;
                var userId = row.user_id;
                var reservationId = row.reservation_id;
                var isVIP = row.is_vip;
                console.log(typeof (isVIP));
                // console.log(row);
                // console.log(reservation_date, start_time, end_time);
                if (reservation_date.toLocaleDateString() == current_dt.toLocaleDateString() && (current_dt.toLocaleTimeString('it-IT') >= start_time && current_dt.toLocaleTimeString('it-IT') <= end_time)) {
                    if (isVIP) {
                        connection.query('INSERT INTO `user_notification` (`user_id`, `notification_id`, `reservation_id`) VALUES (?,?,?)', [userId, 3, reservationId], (error, result) => {
                            console.log(result);
                            res.json(result);
                        });
                    } else {
                        connection.query('INSERT INTO `user_notification` (`user_id`, `notification_id`, `reservation_id`) VALUES (?,?,?)', [userId, 2, reservationId], (error, result) => {
                            console.log(result);
                            res.json(result);
                        });
                    }
                }
            }
        } else {
            res.json([]);
        }
    });
});

// 
cron.schedule('*/10 * * * *', async () => {
    var results = await traffic.findOne().select('-_id').exec();
    console.log(results);

    console.log('Cars > ', results.cars);
    connection.query('SELECT traffic_threshold FROM carpark_setting order by setting_id  DESC LIMIT 1;', (error, result) => {
        if (result) {
            console.log(results.cars);
            console.log(result[0].traffic_threshold);
            if (results.cars > result[0].traffic_threshold) {
                connection.query('SELECT * FROM user WHERE role_id = 2', (error, result) => {
                    if (result) {
                        for (var i = 0; i < result.length; i++) {
                            const userId = result[i].user_id;
                            connection.query('INSERT INTO `user_notification` (`user_id`, `notification_id`) VALUES (?,?)', [userId, 5], (error, result) => { });
                        }
                    }
                });
            }
        }
    });
});



// Jiawei
router.get('/getStaff', function (req, res) {
    var getGuest = 'SELECT user_id,email,fullname,role_id FROM user WHERE role_id = 1;';
    connection.query(getGuest, (error, result) => {
        console.log('Error: ' + error);
        res.json(result);
        console.log(result);
    });
})

router.get('/getSearchStaff', function (req, res) {
    var { fullname } = req.query;
    var getGuest = `SELECT user_id,email,fullname,role_id 
                    FROM user
                    WHERE fullname LIKE '%${fullname}%'
                    AND role_id = 1;`;
    connection.query(getGuest, (error, result) => {
        console.log('Error: ' + error);
        console.log(result);
        res.json(result);
    });
})

router.get('/getProfilePic', function (req, res) {
    var { user_id } = req.query;
    var getGuest = `SELECT face 
                    FROM user
                    WHERE user_id = ${user_id};`;
    connection.query(getGuest, (error, result) => {
        console.log('Error from A: ' + error);
        console.log(result);
        res.json(result);
    });
})

router.post("/postStaffToManager", (req, res) => {
    var { user_id } = req.body;
    console.log(user_id)
    var changeRole = `UPDATE user SET role_id = 2
                      WHERE user_id = ${user_id};`;
    connection.query(changeRole, (error, result) => {
        console.log('Error: ' + error);
        console.log(result);
        res.json(result);
    });
})

router.post("/postManagerToStaff", (req, res) => {
    var { user_id } = req.body;
    console.log(user_id)
    var changeRole = `UPDATE user SET role_id = 1
                      WHERE user_id = ${user_id};`;
    connection.query(changeRole, (error, result) => {
        console.log('Error: ' + error);
        console.log(result);
        res.json(result);
    });
})

router.get('/getManager', function (req, res) {
    var getGuest = 'SELECT user_id,email,fullname,role_id FROM user WHERE role_id = 2;';
    connection.query(getGuest, (error, result) => {
        console.log('Error: ' + error);
        res.json(result);
        console.log(result);
    });
})

router.get('/getSearchManager', function (req, res) {
    var { fullname } = req.query;
    var getGuest = `SELECT user_id,email,fullname,role_id 
                    FROM user
                    WHERE fullname LIKE '%${fullname}%'
                    AND role_id = 2;`;
    connection.query(getGuest, (error, result) => {
        console.log('Error: ' + error);
        console.log(result);
        res.json(result);
    });
})

router.get('/getUser', function (req, res) {
    var { user_id } = req.query;
    var getUser = `SELECT user_id, fullname, email, role_id FROM user WHERE user_id = ${user_id};`;
    connection.query(getUser, (error, result) => {
        console.log('Error: ' + error);
        if (result.length > 0) {
            console.log(result);
            res.json(result[0]);
        }
    });
})

//Send email to Confirm Reservation
cron.schedule('00 00 12 * *', () => {

    var getEmail = `SELECT guest.email, reservation.reservation_date
                    FROM guest 
                    INNER JOIN reservation 
                    ON reservation.guest_id = guest.guest_id
                    WHERE reservation.reservation_date-3 = CURDATE();`;
    connection.query(getEmail, (error, result) => {
        console.log(result);
        for (i in result) {
            var message = {
                from: '"Republic Polytechnic Smart Car Park" <c4017197@gmail.com>',
                to: result[i].email,
                subject: "Invitation",
                text: `Hi, please be noted that you have a reservation at Republic Polytechnic Car Park on ${result[i].reservation_date.toLocaleDateString()}.`,
            };
            main(message).catch(console.error);
        }
    });
});



// Ariel

router.get('/CarparkFee', async (req, res) => {
    var sqlStatement = "SELECT * FROM carpark_setting order by setting_id  DESC LIMIT 1;";

    connection.query(sqlStatement, (error, result) => {

        res.setHeader('Access-Control-Allow-Origin', '*');

        if (result.length > 0) {
            console.log(result);
            res.json(result);


        } else {
            console.log("error");
            console.log(error);

            res.json(error);
        }

    });

});

router.get('/Roles', async (req, res) => {
    var sqlStatement = "SELECT * FROM guest_role";

    connection.query(sqlStatement, (error, result) => {

        res.setHeader('Access-Control-Allow-Origin', '*');

        if (result.length > 0) {
            console.log(result);
            res.json(result);


        } else {
            console.log("error");
            console.log(error);

            res.json(error);
        }

    });

});

router.get('/RobotFee', async (req, res) => {
    var sqlStatement = "SELECT * FROM electric_charger_robot_fee order by fee_id  DESC LIMIT 1;";

    connection.query(sqlStatement, (error, result) => {

        res.setHeader('Access-Control-Allow-Origin', '*');

        if (result.length > 0) {
            console.log(result);
            res.json(result);


        } else {
            console.log("error");
            console.log(error);

            res.json(error);
        }

    });

});

//insert all the car park fee setting into SQL database
router.post('/insert', async (req, res) => {

    //var intervalTime = req.body.intervalTime.Intervaltime.replace("T", " ").replace("Z", "");
    var intervalTime = new Date(req.body.intervalTime.Intervaltime.replace("T", " ").replace("Z", ""));
    intervalTime.setHours(intervalTime.getHours() + 8);
    //var bufferTime = req.body.bufferTime.Buffertime.replace("T", " ").replace("Z", "");
    var bufferTime = new Date(req.body.bufferTime.Buffertime.replace("T", " ").replace("Z", ""));
    bufferTime.setHours(bufferTime.getHours() + 8);

    var vals = [
        req.body.entryFee.EntryFee,
        req.body.intervalFee.IntervalFee,
        intervalTime,
        bufferTime,
        req.body.trafficThreshold
    ];

    var insertFeeSQL = "INSERT INTO carpark_setting (entry_fee, interval_fee, interval_time, buffer_time, traffic_threshold) VALUES (?,?,?,?,?);";



    connection.query(insertFeeSQL, vals, (error, result) => {

        //this is to allow any browser to access into the content for temporary
        //although it fails to avoid security issue but this will avoid from specifying an IP address every time it changes
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST');
        console.log(result);

        if (result) {
            console.log(result);
            res.json(result);

        } else {
            console.log(error);
            res.json(error);
        }
    });


});

router.post('/updateGuestRole1', async (req, res) => {

    var vals = [
        req.body.user1.User1,
    ];
    console.log('user1 > ', vals);

    var updateRole1SQL = "UPDATE guest_role set role_name=(?) WHERE role_id = 1;";



    connection.query(updateRole1SQL, vals, (error, result) => {

        //this is to allow any browser to access into the content for temporary
        //although it fails to avoid security issue but this will avoid from specifying an IP address every time it changes
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST');
        console.log(result);

        if (result.affectedRows > 0) {
            console.log(result);
            res.json(result);

        } else {
            console.log(error);
            res.json(error);
        }
    });


});

router.post('/updateGuestRole2', async (req, res) => {

    var vals = [
        req.body.user2.User2,
    ];

    var updateRole2SQL = "UPDATE guest_role set role_name=(?) WHERE role_id = 2;";



    connection.query(updateRole2SQL, vals, (error, result) => {

        //this is to allow any browser to access into the content for temporary
        //although it fails to avoid security issue but this will avoid from specifying an IP address every time it changes
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST');
        console.log(result);
        console.log(error);
        if (result.affectedRows > 0) {
            console.log(result);
            res.json(result);

        } else {
            console.log(error);
            res.json(error);
        }
    });


});

router.post('/updateGuestRole3', async (req, res) => {

    var vals = [
        req.body.user3.User3,
    ];

    var updateRole3SQL = "UPDATE guest_role set role_name=(?) WHERE role_id = 3;";


    connection.query(updateRole3SQL, vals, (error, result) => {

        //this is to allow any browser to access into the content for temporary
        //although it fails to avoid security issue but this will avoid from specifying an IP address every time it changes
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST');
        console.log(result);
        console.log(error);
        if (result.affectedRows > 0) {
            console.log(result);
            res.json(result);

        } else {
            console.log(error);
            res.json(error);
        }
    });


});


router.post('/insertRobotFee', async (req, res) => {

    var vals = [
        req.body.robotFee.RobotFee

    ];
    console.log(vals);
    var insertRobotFeeSQL = "INSERT INTO electric_charger_robot_fee (charging_fee_perHour) VALUES (?);";



    connection.query(insertRobotFeeSQL, vals, (error, result) => {

        //this is to allow any browser to access into the content for temporary
        //although it fails to avoid security issue but this will avoid from specifying an IP address every time it changes
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST');
        console.log(result);

        if (result.affectedRows > 0) {
            console.log(result);
            res.json(result);

        } else {
            console.log(error);
            res.json(error);
        }
    });


});



// Leslie
router.get('/getReservation', function (req, res) {
    var { user_id } = req.query;
    var getGuest = `SELECT * FROM reservation AS R
                    INNER JOIN Guest AS G ON R.guest_id=G.guest_id
                    WHERE R.user_id=? AND DATE(reservation_date) > curdate();`;
    var filter = [user_id]
    connection.query(getGuest, filter, (error, result) => {
        console.log('query: ' + getGuest + 'userid: ' + user_id)
        console.log('1Error: ' + error);

        res.json(result);
        console.log(result);
    });
})

router.get('/getSearchReservation/:user_id', function (req, res) {
    var { user_id } = req.params;
    var { searchQuery } = req.query;
    //console.log('User > ', user_id);
    //console.log('search > ', searchQuery);
    var getGuest = `SELECT * FROM reservation AS R
                    INNER JOIN Guest AS G ON R.guest_id=G.guest_id
                    WHERE G.fullname LIKE '%${searchQuery}%' AND R.user_id= ${user_id} 
                    AND DATE(reservation_date) > curdate(); 
                    `;

    connection.query(getGuest, (error, result) => {
        console.log(result)
        res.json(result);
    });
})

router.get('/getSearchStaffShare', function (req, res) {
    var { fullname } = req.query;
    var getGuest = `SELECT user_id,email,fullname,role_id 
                    FROM user
                    WHERE fullname LIKE '%${fullname}%' AND user_id NOT IN
                    (SELECT RS.shared_user
                    FROM reservation_share RS
                    INNER JOIN reservation R ON RS.reservation=R.reservation_id
                    INNER JOIN user U ON U.user_id= RS.shared_user
                    WHERE R.reservation_id=RS.reservation)
                    ;`;
    connection.query(getGuest, (error, result) => {
        console.log('Error: ' + error);
        console.log(result);
        res.json(result);
    });
})

router.post("/postReservationShare/:user_id", (req, res) => {
    var { user_id } = req.params;
    var { reservation_id } = req.body;
    //console.log(user_id, reservation_id)
    var sharereserve = `INSERT INTO reservation_share (reservation, shared_user) VALUES (${reservation_id},${user_id});`;
    connection.query(sharereserve, (error, result) => {
        if (result) {
            if (result.affectedRows > 0) {
                // console.log('query: ' + getGuest)
                console.log('3Error: ' + error);
                console.log(result)
                res.json(result);
            }
        } else {
            console.log("Did not work");
            console.log(error);
        }
    });

})

router.post("/createRobotReservation", async (req, res) => {
    var { vrn, date, stime, etime } = req.body;
    //console.log(vrn);
    //console.log(date);
    //console.log(stime);
    //console.log(etime);
    var reserve = `INSERT INTO guest_robot_reservation (vrn,date,start_time,end_time) 
    VALUES(
        '${vrn}',
        date('${date}'),
        time("${stime}"),
        time("${etime}")
    );`;
    connection.query(reserve, (error, result) => {
        if (result) {
            console.log(result)
            res.json(result);
        }
        else {
            console.log("Did not work");
            console.log(error);
        }
    });
})

router.get('/getAllStaff', function (req, res) {
    var { user_id } = req.query;
    var Query = 'SELECT user_id,email,fullname,role_id FROM user;';
    connection.query(Query, (error, result) => {
        console.log('Error: ' + error);
        res.json(result);
        console.log(result);
    });
})

router.get('/getDayGuests', function (req, res) {
    console.log("Testinghere")
    var getGuest = `SELECT vehicle_number AS "VRN", 
    G.fullname as "Guest", 
    start_time AS "Time", 
    U.fullname AS "Host"
    FROM reservation AS R
    INNER JOIN Guest AS G ON R.guest_id=G.guest_id
    INNER JOIN user AS U ON R.user_id=U.user_id
    WHERE DATE(reservation_date) = curdate();`;
    connection.query(getGuest, (error, result) => {
        console.log('query: ' + getGuest)
        console.log('3Error: ' + error);

        res.json(result);
        console.log(result);
    });
});




module.exports = router;

