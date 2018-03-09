#!/usr/bin/env bash

export DEBIAN_FRONTEND=noninteractive
sudo debconf-set-selections <<< 'mariadb-server-10.0 mysql-server/root_password password pass'
sudo debconf-set-selections <<< 'mariadb-server-10.0 mysql-server/root_password_again password pass'

aptitude update
aptitude install -y vim php5 php5-cli php5-mcrypt php5-mysql mariadb-client mariadb-server libapache2-mod-php5 curl

#Install Composer, and make sure www-data can cache composer files
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php -r "if (hash_file('SHA384', 'composer-setup.php') === '544e09ee996cdf60ece3804abc52599c22b1f40f4323403c44d44fdfdd586475ca9813a858088ffbc1f233e9b180f061') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
php composer-setup.php --install-dir=/usr/local/bin --filename=composer
php -r "unlink('composer-setup.php');"
chown www-data.www-data /var/www

#Install Node/NPM
curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
sudo apt-get install -y nodejs build-essential

cd /vagrant/profile
mysql -ppass -e "create database profile"
su www-data -s /bin/bash -c "composer install"
su www-data -s /bin/bash -c "cp .env.example .env"
su www-data -s /bin/bash -c "php artisan key:generate"
su www-data -s /bin/bash -c "php artisan migrate --seed"
su www-data -s /bin/bash -c "npm install"

cd /vagrant/transaction
mysql -ppass -e "create database transaction"
su www-data -s /bin/bash -c "composer install"
su www-data -s /bin/bash -c "cp .env.example .env"
su www-data -s /bin/bash -c "php artisan key:generate"
su www-data -s /bin/bash -c "php artisan migrate --seed"
su www-data -s /bin/bash -c "npm install"

cp /vagrant/vagrant_files/000-default.conf /etc/apache2/sites-enabled/000-default.conf
cp /vagrant/vagrant_files/ports.conf /etc/apache2/ports.conf

a2enmod rewrite
apache2ctl restart
