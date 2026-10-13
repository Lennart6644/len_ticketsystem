Config = {}

Config.Locale = 'en'

Config.Command = {
    player = 'ticket',
    admin = 'tickets',
    chat = 'tc',
}

Config.Keybinds = {
    player = '',
    admin = '',
}

Config.AdminGroups = { 'superadmin', 'admin', 'mod', 'support' }

Config.Ticket = {
    minMessageLength = 10,
    maxMessageLength = 800,
    maxSubjectLength = 40,
    maxOpenPerPlayer = 1,
    cooldown = 60,
    maxTickets = 100,
    removeOnDisconnect = false,
}

Config.Admin = {
    notifyOffDuty = true,
    statsTimeout = 300,
    allowTeleport = true,
    allowKick = true,
    allowRevive = true,
    allowFreeze = true,
    reviveEvent = 'esx_ambulancejob:revive',
    chatHistory = 50,
    maxChatLength = 300,
}

Config.Notify = {
    position = 'top-right',
    duration = 6000,
    sound = {
        enabled = true,
        dict = 'GTAO_FM_Events_Soundset',
        name = 'Event_Message_Purple',
    },
}

Config.Webhook = {
    enabled = false,
    url = '',
    name = 'len_ticketsystem',
    color = 3447003,
}

Config.FuelScripts = { 'ox_fuel', 'LegacyFuel', 'cdn-fuel' }

Config.Theme = {
    accent = '#7c6cff',
    accent2 = '#2dd4bf',
    panel = 'rgba(14,16,26,0.88)',
    panelBorder = 'rgba(255,255,255,0.09)',
    text = '#eef0f8',
    muted = '#8b90a8',
    success = '#34d399',
    danger = '#f87171',
    warning = '#fbbf24',
    radius = '16px',
    font = "'Segoe UI', Roboto, Arial, sans-serif",
}
