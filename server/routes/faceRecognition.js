const express = require('express');
const tf = require('@tensorflow/tfjs-node')
const faceapi = require('face-api.js')
const canvas = require('canvas')
var fs = require('fs');
const util = require('util');
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

var file1 = 'Test.jpg'
var file2 = 'testing.jpg'
/*
const rImage = fs.access(file1, fs.constants.F_OK, (err) => {
    console.log(`${file1} ${err ? 'does not exist' : 'exists'}`);
  })
const qImage = fs.access(file2, fs.constants.F_OK, (err) => {
    console.log(`${file2} ${err ? 'does not exist' : 'exists'}`);
})
*/

const readImg = util.promisify(fs.readFile);

async function faceRecog() {
  console.log('this works')
  await faceapi.nets.ssdMobilenetv1.loadFromDisk('server/models');
  await faceapi.nets.faceRecognitionNet.loadFromDisk('server/models');
  await faceapi.nets.faceLandmark68Net.loadFromDisk('server/models');
  const rImage = await readImg(file1);
  const qImage = await readImg(file2);
  console.log('testing!')

  const referenceImage = tf.node.decodeImage(rImage, 3);
  const queryImage1 = tf.node.decodeImage(qImage, 3);

  console.log("hello?!")

  const results = await faceapi
    .detectAllFaces(referenceImage)
    .withFaceLandmarks()
    .withFaceDescriptors()
  console.log('I am here');

  if (!results.length) {
    console.log('uh oh')
    return
  }
  console.log("Reached");

  const faceMatcher = new faceapi.FaceMatcher(results)

  const singleResult = await faceapi
    .detectSingleFace(queryImage1)
    .withFaceLandmarks()
    .withFaceDescriptor()

  if (singleResult) {
    const bestMatch = faceMatcher.findBestMatch(singleResult.descriptor)
    console.log(bestMatch.toString())

    return bestMatch.distance
  }
}

module.exports = { faceRecog };