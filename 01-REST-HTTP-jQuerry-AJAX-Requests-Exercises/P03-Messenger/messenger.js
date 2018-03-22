function attachEvents() {
    const textArea = $('#messages');
    const authorInput = $('#author');
    const messageInput = $('#content');
    const sendBtn = $('#submit');
    const refreshBtn = $('#refresh');

    const baseUrl = 'https://messenger-jeliozver.firebaseio.com/messenger/';
    // change baseUrl to your own firebase project to test add/send message functionality

    const getReq = {
        method: 'GET',
        url: baseUrl + '.json',
        success: displayMessages,
        error: handleError
    };
    
    const postReq = {
        method: 'POST',
        url: baseUrl + '.json',
        data: {},
        success: getMessages,
        error: handleError
    };

    refreshBtn.on('click', getMessages);
    sendBtn.on('click', sendMessage);

    function getMessages() {
        $.ajax(getReq);
    }

    function sendMessage() {
        let author = authorInput.val();
        let message = messageInput.val();

        if (author === '' || message === '') {
            return;
        }

        let json = {
            author: author,
            content: message,
            timestamp: Date.now()
        };

        postReq.data = JSON.stringify(json);
        $.ajax(postReq);

        authorInput.val('');
        messageInput.val('');
    }

    function displayMessages(res) {
        textArea.html('');
        let messages = [];
        for (let key in res) {
            if (res.hasOwnProperty(key)) {
                messages.push(res[key]);
            }
        }

        messages = messages
            .sort((a,b) => a.timestamp - b.timestamp);

        for (let msg of messages) {
            textArea.append(`${msg.author}: ${msg.content}\n`);
        }
    }

    function handleError(err) {
        alert(err.statusText);
    }
}

attachEvents();