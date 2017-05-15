$(document).ready(function () {

    $.get('/api/user')
        .done(function (user_data) {
            checkPublicKey(user_data);
        })
        .fail(function (user_data) {
        });

    function checkPublicKey(user_data) {
        if (user_data.profile_private_key == '') {

            var options = {
                userIds: [{name: 'Jon Smith', email: 'jon@example.com'}],
                numBits: 1024,
                passphrase: prompt("Please provide a password for your transaction data. " +
                    "This must be different to the password used to log in to your profile.")
            };

            var openpgp = require('openpgp');
            openpgp.generateKey(options).then(function (key) {

                var profile_private_key = key.privateKeyArmored;
                var profile_public_key = key.publicKeyArmored;

                var update = $.post('/api/user', {
                    profile_private_key: profile_private_key,
                    profile_public_key: profile_public_key
                });

                update.done(function (user_data) {
                    checkPrivateData(user_data);
                });

            });
        } else {
            checkPrivateData(user_data);
        }
    }

    function checkPrivateData(user_data) {
        if (user_data.profile_data == '') {

            var profile_data = {
                account_references: []
            };

            var openpgp = require('openpgp');

            var options = {
                data: JSON.stringify(profile_data),
                publicKeys: openpgp.key.readArmored(user_data.profile_public_key).keys
            };

            openpgp.encrypt(options).then(function (ciphertext) {

                var profile_data = ciphertext.data;

                var update = $.post('/api/user', {
                    profile_data: profile_data
                });

                update.done(function (user_data) {
                    startApp(user_data);
                });
            });
        } else {
            startApp(user_data);
        }
    }

    function getAccountReferences(user_data) {

        var d = $.Deferred();

        var openpgp = require('openpgp');

        var passphrase = prompt("Please provide your password so we can unlock your transaction data. " +
            "This is different to the password used to log in to your profile.");

        var privKeyObj = openpgp.key.readArmored(user_data.profile_private_key).keys[0];
        privKeyObj.decrypt(passphrase);

        var options = {
            message: openpgp.message.readArmored(user_data.profile_data),
            publicKeys: openpgp.key.readArmored(user_data.profile_public_key).keys,
            privateKey: privKeyObj
        };

        openpgp.decrypt(options).then(function (plaintext) {
            console.log('DONE');
            d.resolve(JSON.parse(plaintext.data));
        });

        return d.promise();
    }

    function startApp(user_data) {

        var account_references = getAccountReferences(user_data);
        account_references.done(function (val) {
            console.log(val);
            alert("You are connected to account number(s) " + val.account_references.join(', '));
        });

    }

});
