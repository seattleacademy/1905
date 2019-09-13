if (location.protocol !== "https:") {
    location.protocol = "https:";
}
const video = document.getElementById('video')
console.log('hello2')
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('models'),
    faceapi.nets.faceExpressionNet.loadFromUri('models')
]).then(startVideo)

function startVideo() {
    document.getElementById('status').innerHTML = "startVideo";
    navigator.getUserMedia({ video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
    )
}

video.addEventListener('play', () => {
    document.getElementById('status').innerHTML = "video play event received";
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
        console.log(detections);
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        document.getElementById('status').innerHTML = "Drawing";
        document.getElementById('faceCount').innerHTML = detections.length;
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    }, 100)
})

// Based on starter code from https://www.youtube.com/watch?v=CVClHLwv-4I