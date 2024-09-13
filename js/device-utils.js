// Função para abrir dispositivos de mídia (câmera e microfone) com base nas restrições fornecidas
async function openMediaDevices(constraints) {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('Got MediaStream:', stream);
        return stream;
    } catch (error) {
        console.error('Error accessing media devices.', error);
        throw error;
    }
}

// Restrições padrão para capturar vídeo e áudio
const constraints = {
    video: true,
    audio: true
};

// Chama a função para abrir dispositivos de mídia
openMediaDevices(constraints)
    .then(stream => {
        console.log('Stream recebido com sucesso:', stream);
    })
    .catch(error => {
        console.error('Falha ao acessar os dispositivos de mídia:', error);
    });

// Função para retornar os dispositivos de mídia conectados com base no tipo especificado (áudio/vídeo)
async function getConnectedDevices(type) {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === type);
}

// Obtém as câmeras conectadas
getConnectedDevices('videoinput').then(cameras => {
    console.log('Câmeras conectadas:', cameras);
});

// Função para atualizar a lista de câmeras exibida na interface
function updateCameraList(cameras) {
    const listElement = document.querySelector('select#availableCameras');
    listElement.innerHTML = ''; // Limpa a lista existente
    cameras.map(camera => {
        const cameraOption = document.createElement('option');
        cameraOption.label = camera.label || `Camera ${camera.deviceId}`;
        cameraOption.value = camera.deviceId;
        return cameraOption;
    }).forEach(cameraOption => listElement.add(cameraOption)); // Adiciona cada câmera à lista
}

// Atualiza a lista inicial de câmeras
getConnectedDevices('videoinput').then(cameras => {
    updateCameraList(cameras);
});

// Listener para detectar mudanças nos dispositivos conectados
navigator.mediaDevices.addEventListener('devicechange', async () => {
    const cameras = await getConnectedDevices('videoinput');
    updateCameraList(cameras);
});

// Função para abrir uma câmera com capacidades mínimas
async function openCamera(cameraId, minWidth, minHeight) {
    const constraints = {
        audio: { echoCancellation: true },
        video: {
            deviceId: cameraId,
            width: { min: minWidth },
            height: { min: minHeight }
        }
    };

    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        return stream;
    } catch (error) {
        console.error('Erro ao abrir a câmera.', error);
        throw error;
    }
}

// Abre a primeira câmera conectada com resolução mínima de 1280x720
getConnectedDevices('videoinput').then(cameras => {
    if (cameras.length > 0) {
        openCamera(cameras[0].deviceId, 1280, 720).then(stream => {
            console.log('Câmera aberta com sucesso:', stream);
        });
    }
});

