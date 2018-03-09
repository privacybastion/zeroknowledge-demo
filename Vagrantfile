# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant::DEFAULT_SERVER_URL.replace('https://vagrantcloud.com')

Vagrant.configure(2) do |config|
  config.vm.box = "debian/jessie64"
  config.vm.network "forwarded_port", guest: 81, host: 8081, auto_correct: true
  config.vm.network "forwarded_port", guest: 82, host: 8082, auto_correct: true
  config.vm.provision :shell, path: "bootstrap.sh"
  config.vm.synced_folder ".", "/vagrant",
    type: "virtualbox",
    owner: "www-data", group: "www-data"
end
