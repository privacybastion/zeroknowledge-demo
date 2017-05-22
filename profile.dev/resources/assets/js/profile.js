$(document).ready(function () {

    // Some form elements are trimmed on change
    $('input#email').change(function (e) {
        e.target.value = e.target.value.trim();
    });

    // On login submit, hash password
    $('form#login').submit(function (e) {

        // Salt is 22 chars long. Use email address and pad if required
        var salt = ($('#email', e.target).val() + "#cihgmalgbakneismcoidf").substring(0, 22);
        salt = "$2y$10$" + salt;

        // Grab password, then blank the box
        var password = $('#password', e.target).val();
        $('#password', e.target).val('');

        // Crypt and set bcrypt field
        var bcrypt = require('bcryptjs');
        var hashPassword = bcrypt.hashSync(password, salt);
        $('#bcrypt', e.target).val(hashPassword);
    });

    $.get('/api/user')
        .done(function (user_data) {
            checkPublicKey(user_data);
        })
        .fail(function (user_data) {
        });

    function asyncCreateKeyPair(options) {
        var d = $.Deferred();

        var passphrase;
        if (!options.passphrase && options.passphrase != '') {
            var promptText = options.promptText || "Please provide a password";
            passphrase = prompt(promptText);
        }

        var options = {
            userIds: [{}],
            numBits: 1024,
            passphrase: passphrase
        };

        var openpgp = require('openpgp');
        openpgp.generateKey(options).then(function (key) {
            d.resolve({
                private_key: key.privateKeyArmored,
                public_key: key.publicKeyArmored
            });
        });

        return d.promise()
    }

    function asyncEncrypt(data, public_key) {

        var d = $.Deferred();

        var openpgp = require('openpgp');

        var options = {
            data: JSON.stringify(data),
            publicKeys: openpgp.key.readArmored(public_key).keys
        };

        openpgp.encrypt(options).then(function (ciphertext) {
            d.resolve(ciphertext);
        });

        return d.promise();

    }

    function checkPublicKey(user_data) {
        if (user_data.profile_private_key == '') {

            asyncCreateKeyPair({passphrase: ""})
                .done(function (profile_key) {
                    $.post('/api/user', {
                        profile_private_key: profile_key.private_key,
                        profile_public_key: profile_key.public_key
                    })
                        .done(function (user_data) {
                            checkPrivateData(user_data);
                        });
                });

        } else {
            checkPrivateData(user_data);
        }
    }

    function checkPrivateData(user_data) {
        if (user_data.profile_data == '') {

            var promptText = "Please provide a password for your transaction data.\n" +
                "\n" +
                "This must be different to the password used to log in to your profile.";

            asyncCreateKeyPair({promptText: promptText})
                .done(function (transaction_key) {
                    var profile_data = {
                        account_references: [1, 3, 5],
                        transaction_private_key: transaction_key.private_key,
                        transaction_public_key: transaction_key.public_key
                    };

                    asyncEncrypt(profile_data, user_data.profile_public_key)
                        .done(function (ciphertext) {

                            var profile_data = ciphertext.data;

                            $.post('/api/user', {
                                profile_data: profile_data
                            })
                                .done(function (user_data) {
                                    startApp(user_data);
                                });

                        });

                });

        } else {
            startApp(user_data);
        }
    }

    function getAccountReferences(user_data) {

        var d = $.Deferred();

        $('.panel').parent().append('<div class="panel panel-default" id="js-panel"><div class="panel-heading">Accounts</div><div class="panel-body"><p>Loading Account Information</p></div></div>');

        var openpgp = require('openpgp');

        var privKeyObj = openpgp.key.readArmored(user_data.profile_private_key).keys[0];
        privKeyObj.decrypt("");

        var options = {
            message: openpgp.message.readArmored(user_data.profile_data),
            publicKeys: openpgp.key.readArmored(user_data.profile_public_key).keys,
            privateKey: privKeyObj
        };

        openpgp.decrypt(options).then(function (plaintext) {
            d.resolve(JSON.parse(plaintext.data));
        });

        return d.promise();
    }

    function startApp(user_data) {

        getAccountReferences(user_data)
            .done(function (val) {
                console.log(val);

                var account_references = val.account_references;

                $('#js-panel .panel-body').html('');
                for (var account_ptr = 0; account_ptr < account_references.length; account_ptr++) {
                    $('#js-panel .panel-body').append('<p>' + account_references[account_ptr] + '</p>');
                }

                $('#js-panel .panel-body').append('<hr/>');
                $('#js-panel .panel-body').append('<button id="new-account">Crate new account</button>');

                $('#new-account').click(function (e) {
                    $.post('http://transaction.dev/api/v1/accounts')
                        .done(function (a) {
                            console.log(a);
                        });
                });

            });

    }

});