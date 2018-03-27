function attachEvents() {
    const players = $('#players');
    const addPlayerInput = $('#addName');
    const addPlayerBtn = $('#addPlayer');
    const saveBtn = $('#save');
    const reloadBtn = $('#reload');

    let player = {};

    loadPlayers();

    addPlayerBtn.on('click', (event) => {
        event.preventDefault();

        if (addPlayerInput.val() === '') return;

        request('POST', '', {
            name: addPlayerInput.val(),
            money: 500,
            bullets: 6
        }).then(loadPlayers)
            .catch(handleError);

        addPlayerInput.val('');
    });

    saveBtn.on('click', (event) => {
        event.preventDefault();

        if (player.name !== undefined) {
            request('PUT', player.id, {
                    name: player.name,
                    money: player.money,
                    bullets: player.bullets
                }
            ).then(loadPlayers)
                .catch(handleError);
        }

        $('#canvas').css('display', 'none');
        saveBtn.css('display', 'none');
        reloadBtn.css('display', 'none');

        clearInterval(canvas.intervalId);
    });

    reloadBtn.on('click', () => {
        if (player.money !== undefined || player.bullets !== undefined) {
            if (player.money < 0 || player.money - 60 < 0) {
                alert('Gave Over! Not enough money!');
                request('DELETE', player.id, {})
                    .then(loadPlayers)
                    .catch(handleError);

                $('#canvas').css('display', 'none');
            }

            player.money -= 60;
            player.bullets = 6;
        }
    });

    function loadPlayers() {
        request('GET', '', {})
            .then(displayPlayers)
            .catch(handleError);
    }

    function displayPlayers(data) {
        players.empty();
        for (let pl of data) {
            let newPlayer = new Player(
                pl._id,
                pl.name,
                pl.money,
                pl.bullets
            );

            newPlayer.render('#players');
        }
    }

    function handleError(reason) {
        alert(`Error: ${reason.status} (${reason.statusText})`);
    }

    class Player {
        constructor(id, name, money, bullets) {
            this.id = id;
            this.name = name;
            this.money = Number(money);
            this.bullets = Number(bullets);
            this._player = this._createPlayer();
        }

        static handleError(reason) {
            alert(`Error: ${reason.status} (${reason.statusText})`);
        }

        render(selector) {
            $(selector).append(this._player);
        }

        _createPlayer() {
            let playerDiv = $('<div>')
                .addClass('player')
                .attr('data-id', `${this.id}`);

            let nameDiv = $('<div>')
                .addClass('row')
                .append('<label>Name: </label>')
                .append(`<label class="name">${this.name}</label>`);

            let moneyDiv = $('<div>')
                .addClass('row')
                .append('<label>Money: </label>')
                .append(`<label class="money">${this.money}</label>`);

            let bulletsDiv = $('<div>')
                .addClass('row')
                .append('<label>Bullets: </label>')
                .append(`<label class="bullets">${this.bullets}</label>`);

            let playBtn = $('<button class="play">Play</button>');
            let delBtn = $('<button class="delete">Delete</button>');

            playBtn.on('click', this._startGame.bind(this));
            delBtn.on('click', this._sendDeleteRequest.bind(this));

            playerDiv
                .append(nameDiv)
                .append(moneyDiv)
                .append(bulletsDiv)
                .append(playBtn)
                .append(delBtn);

            return playerDiv;
        }

        _startGame() {
            $('#save').trigger('click').css('display', 'block');
            $('#canvas').css('display', 'block');
            $('#reload').css('display', 'block');

            player = {
                name: this.name,
                money: this.money,
                bullets: this.bullets,
                id: this.id
            };

            loadCanvas(player);
        }

        _sendDeleteRequest() {
            request('DELETE', this.id, {})
                .then(() => $(this._player).remove())
                .catch(Player.handleError)
        }
    }
}