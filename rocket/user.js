


class User {
	userId = ''

	client = null

	history = []

	constructor(userId) {
		this.userId = userId;
	}

	insertHistory(history) {
		this.history.unshift(history);
	}

	getHistory() {
		return this.history;
	}

	getClient() {
		return this.client;
	}

	setClient(client) {
		this.client = client;
	}
}

class UserMgr {
	users = {}

	addUser(user) {
		this.users[user.userId] = user;
	}

	getUser(id) {
		return this.users[id];
	}
}

let userMgr = new UserMgr();

module.exports = {
	userMgr,
	User,
}