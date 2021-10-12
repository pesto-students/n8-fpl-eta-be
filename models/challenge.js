class Challenge {
    constructor(id,name, startDate, endDate, rules, status) {
        this.id = id;
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.rules = rules;
        this.status = status;
    }
}

module.exports = Challenge;