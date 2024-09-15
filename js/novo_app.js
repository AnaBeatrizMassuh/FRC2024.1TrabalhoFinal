function startWebSite() {
  getConnectedDevices("videoinput").then((cameras) => {
    updateCameraList(cameras);
    if (cameras && cameras.length > 0) {
      openMediaDevices(cameras[0].deviceId);
    }
  }); // atualiza a lista de câmeras

  getConnectedDevices("audioinput").then((microphones) => {
    updateMicrophoneList(microphones);
  }); // atualiza a lista de microfones
}

startWebSite();

const openMediaDevices = async (cameraId) => {
  const constraints = {
    audio: { echoCancellation: true },
    video: {
      deviceId: cameraId,
      width: { min: 640, ideal: 1280, max: 1920 },
      height: { min: 480, ideal: 720, max: 1080 },
    },
  };
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    const videoElement = document.querySelector("video#localVideo");
    videoElement.srcObject = stream;
    console.log("Got MediaStream:", stream);
  } catch (error) {
    console.error("Error accessing media devices.", error);
  }
};

async function getConnectedDevices(type) {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const cameras = devices.filter((device) => device.kind === type);
  return cameras;
}

function updateCameraList(cameras) {
  const listElement = document.querySelector("select#availableCameras");
  listElement.innerHTML = "";
  cameras
    .map((camera) => {
      const cameraOption = document.createElement("option");
      cameraOption.label = camera.label || `Sem Câmera`;
      cameraOption.value = camera.deviceId;
      return cameraOption;
    })
    .forEach((cameraOption) => listElement.add(cameraOption));
}
function updateMicrophoneList(mics) {
  const listElement = document.querySelector("select#availableMics");
  listElement.innerHTML = "";
  mics
    .map((mic) => {
      const micOption = document.createElement("option");
      micOption.label = mic.label || `Sem Microfone`;
      micOption.value = mic.deviceId;
      return micOption;
    })
    .forEach((micOption) => listElement.add(micOption));
}
