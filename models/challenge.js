class Challenge {
    constructor(id,name, startDate, endDate, rules, status, stocks, awards, leaderboard) {
        this.id = id;
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.rules = rules;
        this.status = status;
        this.stocks = stocks;
        this.awards = awards;
        this.leaderboard = leaderboard;
    }
}

module.exports = Challenge;