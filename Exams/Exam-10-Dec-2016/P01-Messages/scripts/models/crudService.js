let crudService = (() => {
    const APPDATA_MODULE = 'appdata';
    const USER_MODULE = 'user';
    const AUTH = 'kinvey';
    const MESSAGES_ENTITY = 'messages/';

    function myMessagesQuery() {
        return `messages?query={"recipient_username":"${authService.getUsername()}"}`;
    }

    function messagesSentQuery() {
        return `messages?query={"sender_username":"${authService.getUsername()}"}`;
    }

    function listMyMessages() {
        return requestService.get(APPDATA_MODULE, myMessagesQuery(), AUTH);
    }

    function listMessagesSent() {
        return requestService.get(APPDATA_MODULE, messagesSentQuery(), AUTH);
    }

    function listUsers() {
        return requestService.get(USER_MODULE, '', AUTH);
    }

    function sendMessage(recipient_username, text) {
        let body = {
            sender_username: authService.getUsername(),
            sender_name: authService.getName(),
            recipient_username: recipient_username,
            text: text
        };

        return requestService.post(APPDATA_MODULE, MESSAGES_ENTITY, AUTH, body);
    }

    function deleteMessage(id) {
        return requestService.remove(APPDATA_MODULE, MESSAGES_ENTITY + id, AUTH);
    }

    return {
        listMyMessages,
        listMessagesSent,
        listUsers,
        sendMessage,
        deleteMessage
    };
})();