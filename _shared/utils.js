function registerSocketEventLoggers(socket) {
    socket.onopen = () => { console.log('Successfully Connected'); };
    socket.onclose = event => { console.log('Socket Closed Connection: ', event); socket.send('Client Closed!'); };
    socket.onerror = error => { console.log('Socket Error: ', error); };
}

function createTosuWsSocket(path = "/ws") {
    let socket = new ReconnectingWebSocket('ws://' + location.host + path);
    registerSocketEventLoggers(socket);
    return socket;
}

const delay = async time => new Promise(resolve => setTimeout(resolve, time));