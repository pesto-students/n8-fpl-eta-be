class Portfolio {
    constructor(id, userId, username, challengeId, stocks, submitTimestamp) {
        this.id = id;
        this.userId = userId;
        this.username = username;
        this.challengeId = challengeId;
        this.stocks = stocks;
        this.submitTimestamp = submitTimestamp;
    }
}

module.exports = Portfolio;