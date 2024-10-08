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

// Função para abrir câmera com base em restrições definidas
async function openCameraWithConstraints(constraints) {
    try {
        // Obtém o stream de mídia com as restrições passadas
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('Stream de mídia capturado:', stream);
        return stream;
    } catch (error) {
        console.error('Erro ao acessar os dispositivos de mídia com as restrições.', error);
        throw error;
    }
}

// Definir restrições específicas de resolução (exemplo: resolução exata)
const exactResolutionConstraints = {
    video: {
        width: { exact: 1024 },
        height: { exact: 768 }
    }
};

// Tenta abrir a câmera com a resolução exata de 1024x768
openCameraWithConstraints(exactResolutionConstraints)
    .then(stream => {
        // Manipular o stream capturado (ex.: exibir em um <video> element)
        const videoElement = document.querySelector('video#localVideo');
        videoElement.srcObject = stream;
    })
    .catch(error => {
        console.error('Falha ao abrir a câmera com a resolução exata.', error);
    });

// Função para ajustar as restrições de uma faixa de vídeo já capturada
async function adjustTrackConstraints(track, newConstraints) {
    try {
        await track.applyConstraints(newConstraints);
        console.log('Restrições aplicadas com sucesso:', newConstraints);
    } catch (error) {
        console.error('Erro ao aplicar as novas restrições.', error);
    }
}

// Nova restrição de resolução mínima
const newResolutionConstraints = {
    width: { min: 640 },
    height: { min: 480 }
};

// Obtém o stream e ajusta a faixa de vídeo com novas restrições
openCameraWithConstraints(exactResolutionConstraints)
    .then(stream => {
        const videoTrack = stream.getVideoTracks()[0]; // Obtém a faixa de vídeo
        adjustTrackConstraints(videoTrack, newResolutionConstraints); // Aplica novas restrições
    })
    .catch(error => {
        console.error('Falha ao ajustar as restrições da câmera.', error);
    });

// Função para capturar a tela com restrições específicas
async function captureScreen() {
    try {
        const displayConstraints = {
            video: {
                cursor: 'always', // Sempre mostrar o cursor
                displaySurface: 'monitor' // Captura o monitor inteiro
            }
        };
        const screenStream = await navigator.mediaDevices.getDisplayMedia(displayConstraints);
        console.log('Stream de captura de tela:', screenStream);
        return screenStream;
    } catch (error) {
        console.error('Erro ao capturar a tela.', error);
        throw error;
    }
}

// Chama a função para capturar a tela
captureScreen()
    .then(stream => {
        const videoElement = document.querySelector('video#screenVideo');
        videoElement.srcObject = stream; // Exibir a captura de tela no <video>
    })
    .catch(error => {
        console.error('Falha ao capturar a tela.', error);
    });

// Função para desativar/ativar uma faixa de vídeo
function toggleTrack(track, enable) {
    track.enabled = enable; // Ativa ou desativa a faixa
    console.log(`Track ${enable ? 'ativada' : 'desativada'}`);
}

// Obtém o stream e desativa a faixa de vídeo
openCameraWithConstraints(exactResolutionConstraints)
    .then(stream => {
        const videoTrack = stream.getVideoTracks()[0]; // Obtém a faixa de vídeo
        toggleTrack(videoTrack, false); // Desativa a faixa de vídeo
    })
    .catch(error => {
        console.error('Falha ao manipular a faixa de vídeo.', error);
    });

