import axios from 'axios';
import * as Crypto from 'expo-crypto';

/**
 * Make sure to change everything to your own
 * Laptop assigned IP or port number you are using
 * for your backend server.
 */

// Write your API here
const IP_ADDRESS = '192.168.10.134';

// Chad
export function getNotifications(user_id, type_id) {
  return axios.get(`http://${IP_ADDRESS}:8080/api/getNotifications/${user_id}?type_id=${type_id}`).then(res => res.data);
}

export function deleteNotification(unId) {
  return axios.get(`http://${IP_ADDRESS}:8080/api/deleteNotification/${unId}`).then(res => res.data);
}

export function clearAllNotifications(userId, typeId) {
  return axios.get(`http://${IP_ADDRESS}:8080/api/clearAllNotifications/${userId}?type_id=${typeId}`).then(res => res.data);
}

export function getTrafficThreshold() {
  return axios.get(`http://${IP_ADDRESS}:8080/api/getTrafficThreshold`).then(res => res.data);
}

export function getTraffic() {
  return axios.get(`http://${IP_ADDRESS}:8080/api/getTraffic`).then(res => res.data);
}

export function checkoutPass(pass_id) {
  return axios.post(`http://${IP_ADDRESS}:8080/api/checkoutPass`, { pass_id: pass_id }).then(res => res.data);
}


// Jiawei
export function getStaffInformation() {
  return axios.get(`http://${IP_ADDRESS}:8080/api/getStaff`).then(res => res.data);
}

export function getSearchStaff(searchQuery) {
  return axios.get(`http://${IP_ADDRESS}:8080/api/getSearchStaff?fullname=${searchQuery}`).then(res => res.data);
}

export function postStaffToManager(user_id) {
  return axios.post(`http://${IP_ADDRESS}:8080/api/postStaffToManager`, { user_id: user_id }).then(res => res.data);
}

export function postManagerToStaff(user_id) {
  return axios.post(`http://${IP_ADDRESS}:8080/api/postManagerToStaff`, { user_id: user_id }).then(res => res.data);
}

export function getManagerInformation() {
  return axios.get(`http://${IP_ADDRESS}:8080/api/getManager`).then(res => res.data);
}

export function getSearchManager(searchQuery) {
  return axios.get(`http://${IP_ADDRESS}:8080/api/getSearchManager?fullname=${searchQuery}`).then(res => res.data);
}

export function getUser(user_id) {
  return axios.get(`http://${IP_ADDRESS}:8080/api/getUser?user_id=${user_id}`).then(res => res.data);
}

export function getProfilePic(user_id) {
  return axios.get(`http://${IP_ADDRESS}:8080/api/getProfilePic?user_id=${user_id}`).then(res => res.data);
}

// Ryan
export function executeLogin(email, password) {
  return axios.post(`http://${IP_ADDRESS}:8080/api/login`, {
    Email: { email },
    Password: { password }
  }).then(res => res.data);
}

export function executeRegistration(fullName, email, password) {
  return axios.post(`http://${IP_ADDRESS}:8080/api/register`, {
    FullName: { fullName },
    Email: { email },
    Password: { password }
  }).then(res => res.data);
}

export async function hash(password) {
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA512, password
  )
  return digest;
}

export function startPin(email) {
  return axios.post(`http://${IP_ADDRESS}:8080/api/startPin`, {
    Email: { email }
  }).then(res => res.data);
}

export function sendPin(id, pin) {
  console.log('check');
  return axios.post(`http://${IP_ADDRESS}:8080/api/checkPin`, {
    pinId: { id },
    pin: { pin }
  }).then(res => res.data);
}

export function clearPin(id) {
  return axios.post(`http://${IP_ADDRESS}:8080/api/clearPin`, {
    pinId: { id }
  }).then(res => res.data);
}

export function forgotPassword(email) {
  return axios.post(`http://${IP_ADDRESS}:8080/api/forgotPassword`, {
    Email: { email }
  }).then(res => res.data);
}

export function resetPassword(email, password) {
  return axios.post(`http://${IP_ADDRESS}:8080/api/resetPassword`, {
    Email: { email },
    Password: { password }
  }).then(res => res.data);
}

export function sendBroadcast(userID, category, message, image64) {
  return axios.post(`http://${IP_ADDRESS}:8080/api/sendBroadcast`, {
    UserID: { userID },
    Category: { category },
    Message: { message },
    Image64: { image64 }
  }).then(res => res.data);
}

export function getBroadcastInfo(broadcastId) {
  return axios.get(`http://${IP_ADDRESS}:8080/api/getBroadcast?id=${broadcastId}`)
    .then(res => res.data);
}

export function getCarEntries(date) {
  return axios.post(`http://${IP_ADDRESS}:8080/api/getCarEntries`, {
    SendDate: { date }
  }).then(res => res.data);
}

export function getWeek(date) {
  return axios.get(`http://${IP_ADDRESS}:8080/api/getWeek?date=${date}`)
    .then(res => res.data);
}

export function getWeekCarEntries(start, end) {
  return axios.post(`http://${IP_ADDRESS}:8080/api/getWeekCarEntries`, {
    startDate: { start },
    endDate: { end }
  }).then(res => res.data);
}

export function getMonthCarEntries(month, year) {
  return axios.post(`http://${IP_ADDRESS}:8080/api/getMonthCarEntries`, {
    month: { month },
    year: { year }
  }).then(res => res.data);
}

export function getPricing() {
  return axios.get(`http://${IP_ADDRESS}:8080/api/getPricing`)
    .then(res => res.data);
}

export function getBalance(items) {
  return axios.post(`http://${IP_ADDRESS}:8080/api/getBalance`, {
    items: { items }
  })
    .then(res => res.data);
}

export function FaceRecog(photo, id) {
  console.log("Sending photo")
  return axios.post(`http://${IP_ADDRESS}:8080/api/face`, {
    Photo: { photo },
    id: { id }
  }).then(res => res.data);
}

export function UserFaceCapture(photo, id) {
  console.log("Sending photo")
  return axios.post(`http://${IP_ADDRESS}:8080/api/UserFaceCapture`, {
    Photo: { photo },
    id: { id }
  }).then(res => res.data);
}


// Wei Qiang
// export function getall() {
//   return axios.get(`http://${IP_ADDRESS}:8080/api`).then(res => res.data);
// }
export function getGuest(vrn) {
  return axios.get(`http://${IP_ADDRESS}:8080/api/guest/${vrn}`).then(res => res.data);
}

export function createReservation(name, email, vrn, date, stime, etime, vip, evc, id, guest) {
  return axios.post(`http://${IP_ADDRESS}:8080/api/createReservation`, {
    name: name,
    email: email,
    vrn: vrn,
    date: date,
    stime: stime,
    etime: etime,
    vip: vip,
    evc: evc,
    id: id,
    guest: guest
  }).then(res => res.data);
}

export function getRole() {
  return axios.get(`http://${IP_ADDRESS}:8080/api/role`).then(res => res.data);
}

export function getall(userId) {
  return axios.get(`http://${IP_ADDRESS}:8080/api/report/${userId}`).then(res => res.data);
}

export function delReservation(id) {
  return axios.delete(`http://${IP_ADDRESS}:8080/api/report/${id}`).then(res => res.data);
}



// Ariel
export async function saveCarParkFeeSettings(EntryFee, IntervalFee, Intervaltime, Buffertime, trafficThreshold) {

  return await axios.post(`http://${IP_ADDRESS}:8080/api/insert`, {
    entryFee: { EntryFee },
    intervalFee: { IntervalFee },
    intervalTime: { Intervaltime },
    bufferTime: { Buffertime },
    trafficThreshold: trafficThreshold
  }).then(res => res.data);
}

export async function saveRobotFeeSettings(RobotFee) {

  console.log("called");
  return await axios.post(`http://${IP_ADDRESS}:8080/api/insertRobotFee`, {
    robotFee: { RobotFee }

  }).then(res => res.data);
}

export async function updateGuestRole1(User1) {

  console.log("called");
  return await axios.post(`http://${IP_ADDRESS}:8080/api/updateGuestRole1`, {
    user1: { User1 }

  }).then(res => res.data);
}

export async function updateGuestRole2(User2) {

  console.log("called");
  return await axios.post(`http://${IP_ADDRESS}:8080/api/updateGuestRole2`, {
    user2: { User2 }

  }).then(res => res.data);
}

export async function updateGuestRole3(User3) {

  console.log("called");
  return await axios.post(`http://${IP_ADDRESS}:8080/api/updateGuestRole3`, {
    user3: { User3 }

  }).then(res => res.data);
}

// Leslie
export function getReservationInformation(user_id) {
  return axios.get(`http://${IP_ADDRESS}:8080/api/getReservation?user_id=${user_id}`).then(res => res.data);
}

export function getSearchReservation(user_id, searchQuery) {
  return axios.get(`http://${IP_ADDRESS}:8080/api/getSearchReservation/${user_id}?searchQuery=${searchQuery}`).then(res => res.data);
}

export function getSearchStaffShare(searchQuery) {
  return axios.get(`http://${IP_ADDRESS}:8080/api/getSearchStaffShare?fullname=${searchQuery}`).then(res => res.data);
}

export function postReservationShare(user_id, reservation_id) {
  return axios.post(`http://${IP_ADDRESS}:8080/api/postReservationShare/${user_id}`, {
    reservation_id: reservation_id
  }).then(res => res.data);
}

export function createRobotReservation(vrn, date, stime, etime) {
  axios.post(`http://${IP_ADDRESS}:8080/api/createRobotReservation`, {
    vrn: vrn,
    date: date,
    stime: stime,
    etime: etime,
  });
}

export function getAllStaffInformation(user_id) {
  return axios.get(`http://${IP_ADDRESS}:8080/api/getAllStaff?user_id=${user_id}`).then(res => res.data);
}

export function getDayGuest() {
  return axios.get(`http://${IP_ADDRESS}:8080/api/getDayGuests`).then(res => res.data);
}
