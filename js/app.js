// Import the functions from device-utils.js
import { getConnectedDevices, updateCameraList, openCameraWithConstraints, adjustTrackConstraints, captureScreen, toggleTrack } from './device-utils.js';

// Function to start playing the video from the selected camera
async function playVideoFromCamera(cameraId) {
    try {
        const constraints = { 
            'video': { 'deviceId': cameraId ? { exact: cameraId } : undefined },
            'audio': true 
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        const videoElement = document.querySelector('video#localVideo');
        videoElement.srcObject = stream;
    } catch (error) {
        console.error('Error opening video camera.', error);
    }
}

// Initializing the camera list
(async () => {
    const cameras = await getConnectedDevices('videoinput');
    updateCameraList(cameras);

    // Automatically play video from the first camera
    if (cameras.length > 0) {
        playVideoFromCamera(cameras[0].deviceId);
    }
})();

// Listen for changes to media devices and update the list accordingly
navigator.mediaDevices.addEventListener('devicechange', async () => {
    const newCameraList = await getConnectedDevices('videoinput');
    updateCameraList(newCameraList);
});

// Uso para abrir câmera com restrições de resolução exata
const exactResolutionConstraints = {
    video: {
        width: { exact: 1024 },
        height: { exact: 768 }
    }
};

openCameraWithConstraints(exactResolutionConstraints)
    .then(stream => {
        const videoElement = document.querySelector('video#localVideo');
        videoElement.srcObject = stream;
    })
    .catch(error => {
        console.error('Falha ao abrir a câmera com a resolução exata.', error);
    });
