const users = new Map();

function addNewUser(username) {
    const userId = Date.now();
    newEntry = {
        username: username,
        _id: userId,
        count: 0,
        log: []
    };
    users.set(userId, newEntry);
    return newEntry;
};

function getAllUsers() {
    return Array.from(users.values()).map(user => ({
        username: user.username,
        _id: user._id
    }))
};

function getUserById(id) {
    const user = users.get(Number(id));
    return user ? user : null;
};

function getUserLogById(id) {
    const user = users.get(Number(id));
    return user ? user.log : null;
};

function addExerciseLog(userId, exercise) {
    const user = users.get(Number(userId));
    if (user) {
        user.log.push(exercise);
        user.count += 1;
    };
    newEntry = {
        _id: user._id,
        username: user.username,
        date: exercise.date,
        duration: Number(exercise.duration),
        description: exercise.description
    };
    return newEntry
};

module.exports = {
    addNewUser,
    getAllUsers,
    getUserById,
    getUserLogById,
    addExerciseLog
};