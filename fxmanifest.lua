fx_version 'cerulean'
game 'gta5'
lua54 'yes'

name 'len_ticketsystem'
description 'len_ticketsystem - Support & Ticket System for ESX'
version '2.0.0'

dependencies {
    'es_extended'
}

shared_scripts {
    'config.lua',
    'locales/locale.lua',
    'locales/de.lua',
    'locales/en.lua'
}

client_script 'client/main.lua'
server_script 'server/main.lua'

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/style.css',
    'html/script.js'
}
