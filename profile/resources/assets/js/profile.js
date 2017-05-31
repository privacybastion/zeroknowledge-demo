$(document).ready(function () {

    function PB_Profile() {
    }

    PB_Profile.user_data = {};

    PB_Profile.init = function () {

        var $this = this;

        // On login submit, hash password
        $("form#login").submit(function (e) {

            // Grab password, save to session storage, then blank the input field
            var password = $("#password", e.target).val();
            console.log('Got password ' + password);
            sessionStorage.setItem("password", password);
            $("#password", e.target).val("");

            // Salt is 22 chars long. Use email address and pad if required
            var salt = ($("#email", e.target).val() + "#cihgmalgbakneismcoidf").substring(0, 22);
            salt = "$2y$10$" + salt;

            // Crypt and set bcrypt field
            var bcrypt = require("bcryptjs");
            var hashPassword = bcrypt.hashSync(password, salt);
            $("#bcrypt", e.target).val(hashPassword);
        });

        // Get this user's profile data and check it has a public key (new users don't).
        $.ajax({
            url: "/api/user",
            type: "GET",
            context: $this

        }).done(function (user_data) {
            $this.user_data = user_data;
            $this.checkPublicKey();

        });

    };

    PB_Profile.checkPublicKey = function () {
        var $this = this;

        // Does the user have a profile keypair yet?
        if ($this.user_data.profile_private_key == "") {

            // No keypair - create one using the user's login password
            $this.asyncCreateKeyPair({
                passphrase: sessionStorage.getItem("password")
            }).done(function (profile_key) {

                // Save new keypair to user profile
                $.ajax({
                    url: "/api/user",
                    type: "POST",
                    data: {
                        profile_private_key: profile_key.private_key,
                        profile_public_key: profile_key.public_key
                    },
                    dataType: "json",
                    context: $this

                }).done(function (user_data) {
                    $this.user_data = user_data;
                    $this.checkPrivateData();

                });
            });

        } else {
            $this.checkPrivateData();
        }
    };

    PB_Profile.checkPrivateData = function () {

        var $this = this;

        // Does the user have profile_data yet?
        if ($this.user_data.profile_data == "") {

            // User needs profile data, which comprises a keypair for transaction data

            // User will be prompted for a secure passphrase
            var promptText = "Please provide a secure passphrase for your transaction data.\n" +
                "\n" +
                "This must be different to the password used to log in to your profile.";

            // Create the keypair for transaction data
            $this.asyncCreateKeyPair({
                promptText: promptText
            }).done(function (transaction_key) {

                // Encrypt the data using the profile key
                var profile_data = {
                    account_references: [],
                    transaction_private_key: transaction_key.private_key,
                    transaction_public_key: transaction_key.public_key
                };

                $this.asyncEncrypt(
                    profile_data,
                    $this.user_data.profile_public_key
                ).done(function (ciphertext) {

                    // Save the encrypted profile data to the user profile
                    $.ajax({
                        url: "/api/user",
                        type: "POST",
                        data: {
                            profile_data: ciphertext.data
                        },
                        dataType: "json",
                        context: $this

                    }).done(function (user_data) {
                        $this.user_data = user_data;
                        $this.startApp();

                    });

                });

            });

        } else {
            $this.startApp();
        }
    };

    PB_Profile.startApp = function () {

        var $this = this;

        // Decrypt the profile data
        var openpgp = require("openpgp");
        var privKeyObj = openpgp.key.readArmored($this.user_data.profile_private_key).keys[0];
        privKeyObj.decrypt(sessionStorage.getItem("password"));
        var options = {
            message: openpgp.message.readArmored($this.user_data.profile_data),
            publicKeys: openpgp.key.readArmored($this.user_data.profile_public_key).keys,
            privateKey: privKeyObj
        };
        openpgp.decrypt(options).then(function (plaintext) {
            $this.user_data.profile_data = JSON.parse(plaintext.data);
            $this.renderAccounts();
        });
    };

    PB_Profile.renderAccounts = function () {

        var $this = this;

        $("#js-panel .panel-body").html("");
        for (var account_ptr = 0; account_ptr < $this.user_data.profile_data.account_references.length; account_ptr++) {
            $("#js-panel .panel-body").append("<p>" + $this.user_data.profile_data.account_references[account_ptr] + "</p>");
        }
        $("#js-panel .panel-body").append("<hr/>");
        $("#js-panel .panel-body").append('<button id="new-account">Create new account</button>');


        $("#new-account").click(function (e) {

            $("#js-panel .panel-body").html("<p>Loading Account Information</p>");

            $.ajax({
                url: "http://transaction.example/api/v1/accounts",
                type: "POST",
                crossDomain: true,
                data: {
                    public_key: $this.user_data.profile_data.transaction_public_key
                },
                dataType: "json",
                xhrFields: {
                    withCredentials: true
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", "Bearer " + window.PrivacyBastion.transactionToken);
                },
                context: $this

            }).done(function (account) {

                $this = this;

                if(account.hasOwnProperty('id') && account.id != null) {

                    // Add this new account number to the list of accounts in the profile data
                    var profile_data = $this.user_data.profile_data;
                    profile_data.account_references.push(account.id);
                    console.log(profile_data);

                    $this.asyncEncrypt(
                        profile_data,
                        $this.user_data.profile_public_key
                    ).done(function (ciphertext) {

                        // Save the encrypted profile data to the user profile
                        $.ajax({
                            url: "/api/user",
                            type: "POST",
                            data: {
                                profile_data: ciphertext.data
                            },
                            dataType: "json",
                            context: $this

                        }).done(function (user_data) {
                            $this = this;

                            $this.user_data = user_data;
                            $this.startApp();

                        });

                    });
                }


            });

        });

    };

    PB_Profile.asyncCreateKeyPair = function (options) {
        var d = $.Deferred();

        // Get or use passphrase
        var passphrase;
        if (options.passphrase && options.passphrase != "") {
            passphrase = options.passphrase;
        } else {
            var promptText = options.promptText || "Please provide a password";
            passphrase = prompt(promptText);
        }

        // Build key options
        var options = {
            userIds: [{name: "Privacy Bastion", email: "privacy.bastion@example.com"}],
            numBits: 1024,
            passphrase: passphrase
        };

        // Generate Key and resolve this promise
        var openpgp = require("openpgp");
        openpgp.generateKey(options).then(function (key) {
            d.resolve({
                private_key: key.privateKeyArmored,
                public_key: key.publicKeyArmored
            });
        });
        return d.promise()
    };

    PB_Profile.asyncEncrypt = function (data, public_key) {
        var d = $.Deferred();
        var openpgp = require("openpgp");
        var options = {
            data: JSON.stringify(data),
            publicKeys: openpgp.key.readArmored(public_key).keys
        };
        openpgp.encrypt(options).then(function (ciphertext) {
            d.resolve(ciphertext);
        });
        return d.promise();
    };

    $(".panel").parent().append(
        '<div class="panel panel-default" id="js-panel">' +
        '<div class="panel-heading">Accounts</div>' +
        '<div class="panel-body"></div>' +
        '</div>'
    );

    PB_Profile.init();
});