class Portfolio {
    constructor(id, userId, challengeId, stocks, submitTimestamp) {
        this.id = id;
        this.userId = userId;
        this.challengeId = challengeId;
        this.stocks = stocks;
        this.submitTimestamp = submitTimestamp;
    }
}

module.exports = Portfolio;