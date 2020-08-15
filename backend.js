const modules = require("./modules.js");

function find_user(db, username, clb) {
    db.find({ username: username }, (err, docs) => {
        console.log(username, docs);
        if (docs.length === 0) {
            clb("not found", docs);
        } else {
            clb(err, docs);
        }
    });
}

function compare_user(db, username, passwordhash, clb) {
    db.find(
        { username: username, password: passwordhash.toString() },
        (err, docs) => {
            if (docs.length === 0) {
                clb("error", docs);
            } else {
                clb(err, docs);
            }
        }
    );
}

function create_password(db, user, description, passwordhash, clb) {
    db.update(
        { username: user.username, password: user.password },
        {$set: {'passwords.description': description,'passwords.password':passwordhash}},
        {},
        (err, docs) => {
            console.log(err, docs);
        }
    );
}

function insert_user(db, name, username, passwordhash, clb) {
    if (username && passwordhash) {
        db.insert(
            {
                username: username,
                name: name,
                password: passwordhash,
            },
            (err, docs) => {
                if (err) {
                    clb(err, docs);
                } else {
                    clb(err, docs);
                }
            }
        );
    }
}

module.exports = { insert_user, find_user, compare_user, create_password };
