ESX = exports['es_extended']:getSharedObject()

local Tickets, ChatHistory, LiveStats, Cooldowns, AdminDuty = {}, {}, {}, {}, {}
local TicketCounter = 0

local AdminGroups = {}
for _, group in ipairs(Config.AdminGroups) do
    AdminGroups[group] = true
end

local ClientActions = {
    setHealth = { min = 0, max = 200 },
    setArmor = { min = 0, max = 100 },
    setFuel = { min = 0, max = 100 },
    setVehEngine = { min = 0, max = 1000 },
    setVehBody = { min = 0, max = 1000 },
    setVehTank = { min = 0, max = 1000 },
    fixVeh = {},
}

local function notify(target, title, message, typ, extra)
    TriggerClientEvent('len_ts:notify', target, title, message, typ, extra)
end

local function clean(str, max)
    if type(str) ~= 'string' then return '' end
    str = str:gsub('^%s+', ''):gsub('%s+$', '')
    return str:sub(1, max)
end

local function isAdmin(src)
    if not src then return false end
    local xPlayer = ESX.GetPlayerFromId(src)
    return xPlayer ~= nil and AdminGroups[xPlayer.getGroup()] == true
end

local function syncAdmin(src)
    if isAdmin(src) then
        AdminDuty[src] = AdminDuty[src] or { duty = true }
    else
        AdminDuty[src] = nil
    end
end

local function getIdentifiers(src)
    local ids = { steam = L('none'), license = L('none'), discord = L('none'), fivem = L('none') }
    for i = 0, GetNumPlayerIdentifiers(src) - 1 do
        local id = GetPlayerIdentifier(src, i)
        if id then
            for kind in pairs(ids) do
                if id:find(kind .. ':', 1, true) then
                    ids[kind] = id
                end
            end
        end
    end
    return ids
end

local function findTicket(id)
    for i, t in ipairs(Tickets) do
        if t.id == id then return t, i end
    end
end

local function ticketPayload()
    local out = {}
    for _, t in ipairs(Tickets) do
        out[#out + 1] = {
            id = t.id,
            playerId = t.playerId,
            playerName = t.playerName,
            charName = t.charName,
            job = t.job,
            subject = t.subject,
            message = t.message,
            identifiers = t.identifiers,
            status = t.status,
            claimedBy = t.claimedBy,
            timestamp = t.timestamp,
            online = GetPlayerName(t.playerId) ~= nil,
            stats = LiveStats[t.playerId],
        }
    end
    return out
end

local function adminList()
    local list = {}
    for id, data in pairs(AdminDuty) do
        list[#list + 1] = { id = id, name = GetPlayerName(id) or '?', duty = data.duty }
    end
    return list
end

local function broadcastAdmins()
    local tickets, admins = ticketPayload(), adminList()
    for id, data in pairs(AdminDuty) do
        TriggerClientEvent('len_ts:refresh', id, { tickets = tickets, admins = admins, duty = data.duty })
    end
end

local function sendWebhook(title, description)
    local cfg = Config.Webhook
    if not cfg.enabled or cfg.url == '' then return end
    PerformHttpRequest(cfg.url, function() end, 'POST', json.encode({
        username = cfg.name,
        embeds = { { title = title, description = description, color = cfg.color } },
    }), { ['Content-Type'] = 'application/json' })
end

local function createTicket(src, subject, message)
    local xPlayer = ESX.GetPlayerFromId(src)
    if not xPlayer then return end

    local cfg = Config.Ticket
    local now = os.time()
    local since = Cooldowns[src] and (now - Cooldowns[src]) or nil

    if since and since < cfg.cooldown then
        return notify(src, L('title_error'), L('err_cooldown', cfg.cooldown - since), 'error')
    end

    local open = 0
    for _, t in ipairs(Tickets) do
        if t.playerId == src then open = open + 1 end
    end
    if open >= cfg.maxOpenPerPlayer then
        return notify(src, L('title_error'), L('err_max_open'), 'error')
    end
    if #Tickets >= cfg.maxTickets then
        return notify(src, L('title_error'), L('err_full'), 'error')
    end

    message = clean(message, cfg.maxMessageLength)
    if #message < cfg.minMessageLength then
        return notify(src, L('title_error'), L('err_too_short', cfg.minMessageLength), 'error')
    end

    subject = clean(subject, cfg.maxSubjectLength)
    if subject == '' then
        subject = L('default_subject')
    end

    local job = xPlayer.getJob()
    TicketCounter = TicketCounter + 1

    local ticket = {
        id = TicketCounter,
        playerId = src,
        playerName = GetPlayerName(src),
        charName = xPlayer.getName(),
        job = job.label .. ' - ' .. job.grade_label,
        subject = subject,
        message = message,
        identifiers = getIdentifiers(src),
        status = 'open',
        claimedBy = nil,
        timestamp = os.date('%H:%M'),
    }

    table.insert(Tickets, ticket)
    Cooldowns[src] = now

    local onDuty, offDuty = 0, {}
    for adminId, data in pairs(AdminDuty) do
        if data.duty then
            onDuty = onDuty + 1
            TriggerClientEvent('len_ts:notifyAdmin', adminId, {
                id = ticket.id,
                subject = ticket.subject,
                playerName = ticket.playerName,
                charName = ticket.charName,
                job = ticket.job,
                message = ticket.message,
            })
        else
            offDuty[#offDuty + 1] = adminId
        end
    end

    if onDuty > 0 then
        notify(src, L('title_success'), L('msg_ticket_created'), 'success')
    else
        notify(src, L('title_info'), L('msg_ticket_no_admin'), 'info')
        if Config.Admin.notifyOffDuty then
            for _, adminId in ipairs(offDuty) do
                TriggerClientEvent('len_ts:notifyOffDuty', adminId, ticket.id)
            end
        end
    end

    sendWebhook(L('webhook_new', ticket.id), ('**%s** (%s)\n%s'):format(ticket.playerName, ticket.charName, ticket.message))
    broadcastAdmins()
end

local function openAdminPanel(src)
    if not isAdmin(src) then return end
    syncAdmin(src)

    for _, t in ipairs(Tickets) do
        if GetPlayerName(t.playerId) then
            TriggerClientEvent('len_ts:requestStats', t.playerId)
        end
    end

    SetTimeout(Config.Admin.statsTimeout, function()
        if not isAdmin(src) or not AdminDuty[src] then return end
        TriggerClientEvent('len_ts:openAdmin', src, {
            tickets = ticketPayload(),
            admins = adminList(),
            duty = AdminDuty[src].duty,
        })
    end)
end

local function handleTarget(src, ticket, action, value)
    local target = ticket.playerId
    local cfg = Config.Admin
    local targetPed = GetPlayerPed(target)

    if action == 'goto' and cfg.allowTeleport then
        local c = GetEntityCoords(targetPed)
        SetEntityCoords(GetPlayerPed(src), c.x, c.y, c.z)
    elseif action == 'bring' and cfg.allowTeleport then
        local c = GetEntityCoords(GetPlayerPed(src))
        SetEntityCoords(targetPed, c.x, c.y, c.z)
    elseif action == 'waypoint' then
        local c = GetEntityCoords(targetPed)
        TriggerClientEvent('len_ts:setWaypoint', src, c.x, c.y)
        return
    elseif action == 'kick' and cfg.allowKick then
        DropPlayer(target, L('kick_reason'))
    elseif action == 'revive' and cfg.allowRevive then
        TriggerClientEvent(cfg.reviveEvent, target)
    elseif action == 'freeze' and cfg.allowFreeze then
        TriggerClientEvent('len_ts:toggleFreeze', target)
    elseif ClientActions[action] then
        local range = ClientActions[action]
        local num = tonumber(value)
        if range.min then
            if not num then return end
            num = math.max(range.min, math.min(range.max, num))
        end
        TriggerClientEvent('len_ts:executeAction', target, action, num)
    else
        return
    end

    notify(src, L('title_admin_action'), L('msg_done'), 'success')
end

AddEventHandler('onResourceStart', function(resourceName)
    if GetCurrentResourceName() ~= resourceName then return end
    Wait(1000)
    for _, playerId in ipairs(ESX.GetPlayers()) do
        syncAdmin(tonumber(playerId))
    end
end)

AddEventHandler('esx:playerLoaded', function(playerId)
    syncAdmin(playerId)
end)

AddEventHandler('playerDropped', function()
    local src = source
    AdminDuty[src] = nil
    LiveStats[src] = nil
    if Config.Ticket.removeOnDisconnect then
        for i = #Tickets, 1, -1 do
            if Tickets[i].playerId == src then
                table.remove(Tickets, i)
            end
        end
    end
    broadcastAdmins()
end)

RegisterCommand(Config.Command.player, function(src, args)
    if src == 0 then return end
    if #args > 0 then
        createTicket(src, L('default_subject'), table.concat(args, ' '))
    else
        TriggerClientEvent('len_ts:openPlayer', src)
    end
end, false)

RegisterCommand(Config.Command.admin, function(src)
    if src == 0 then return end
    openAdminPanel(src)
end, false)

RegisterCommand(Config.Command.chat, function(src)
    if src == 0 or not isAdmin(src) then return end
    TriggerClientEvent('len_ts:openChat', src, ChatHistory)
end, false)

RegisterNetEvent('len_ts:server:openAdmin', function()
    openAdminPanel(source)
end)

RegisterNetEvent('len_ts:server:stats', function(stats)
    if type(stats) == 'table' then
        LiveStats[source] = stats
    end
end)

RegisterNetEvent('len_ts:server:submit', function(subject, message)
    createTicket(source, subject, message)
end)

RegisterNetEvent('len_ts:server:action', function(ticketId, action, value)
    local src = source
    if not isAdmin(src) then return end

    local ticket, idx = findTicket(tonumber(ticketId))
    if not ticket then return end

    if action == 'claim' then
        ticket.status = 'claimed'
        ticket.claimedBy = GetPlayerName(src)
        notify(ticket.playerId, L('title_update'), L('msg_claimed', ticket.claimedBy), 'success')
    elseif action == 'unclaim' then
        ticket.status = 'open'
        ticket.claimedBy = nil
    elseif action == 'close' then
        notify(ticket.playerId, L('title_closed'), L('msg_closed'), 'info')
        sendWebhook(L('webhook_closed', ticket.id, GetPlayerName(src)), ticket.message)
        table.remove(Tickets, idx)
    else
        if not GetPlayerName(ticket.playerId) then
            return notify(src, L('title_error'), L('err_offline'), 'error')
        end
        handleTarget(src, ticket, action, value)
    end

    broadcastAdmins()
end)

RegisterNetEvent('len_ts:server:pollStats', function()
    local src = source
    if not isAdmin(src) or not AdminDuty[src] then return end
    for _, t in ipairs(Tickets) do
        if GetPlayerName(t.playerId) then
            TriggerClientEvent('len_ts:requestStats', t.playerId)
        end
    end
    SetTimeout(200, function()
        if not isAdmin(src) or not AdminDuty[src] then return end
        TriggerClientEvent('len_ts:refresh', src, {
            tickets = ticketPayload(),
            admins = adminList(),
            duty = AdminDuty[src].duty,
        })
    end)
end)

RegisterNetEvent('len_ts:server:toggleDuty', function()
    local src = source
    if not isAdmin(src) then return end
    syncAdmin(src)
    AdminDuty[src].duty = not AdminDuty[src].duty
    notify(src, L('title_info'), L(AdminDuty[src].duty and 'msg_duty_on' or 'msg_duty_off'), 'info')
    broadcastAdmins()
end)

RegisterNetEvent('len_ts:server:chat', function(message)
    local src = source
    if not isAdmin(src) then return end

    message = clean(message, Config.Admin.maxChatLength)
    if message == '' then return end

    local entry = { sender = GetPlayerName(src), message = message, time = os.date('%H:%M') }
    table.insert(ChatHistory, entry)
    while #ChatHistory > Config.Admin.chatHistory do
        table.remove(ChatHistory, 1)
    end

    for _, id in ipairs(ESX.GetPlayers()) do
        local pid = tonumber(id)
        if isAdmin(pid) then
            TriggerClientEvent('len_ts:chatMessage', pid, entry)
        end
    end
end)
