local uiOpen, chatOpen, frozen = false, false, false

local function notify(title, message, typ, extra)
    SendNUIMessage({
        action = 'notify',
        title = title,
        message = message,
        type = typ or 'info',
        extra = extra,
        position = Config.Notify.position,
        duration = Config.Notify.duration,
    })
end

local function playSound()
    if Config.Notify.sound.enabled then
        PlaySoundFrontend(-1, Config.Notify.sound.name, Config.Notify.sound.dict, true)
    end
end

local function openUI(action, payload)
    uiOpen = true
    chatOpen = action == 'openChat'
    SetNuiFocus(true, true)
    payload = payload or {}
    payload.action = action
    payload.ui = Locales[Config.Locale] or Locales.en
    payload.config = { theme = Config.Theme, limits = Config.Ticket, admin = Config.Admin }
    SendNUIMessage(payload)
end

local function closeUI()
    uiOpen = false
    chatOpen = false
    SetNuiFocus(false, false)
end

local function setFuel(veh, level)
    SetVehicleFuelLevel(veh, level)
    for _, res in ipairs(Config.FuelScripts) do
        if GetResourceState(res) == 'started' then
            exports[res]:SetFuel(veh, level)
            return
        end
    end
end

RegisterCommand('len_ts_player', function()
    openUI('openPlayer')
end, false)

RegisterCommand('len_ts_admin', function()
    TriggerServerEvent('len_ts:server:openAdmin')
end, false)

if Config.Keybinds.player ~= '' then
    RegisterKeyMapping('len_ts_player', L('keymap_player'), 'keyboard', Config.Keybinds.player)
end

if Config.Keybinds.admin ~= '' then
    RegisterKeyMapping('len_ts_admin', L('keymap_admin'), 'keyboard', Config.Keybinds.admin)
end

RegisterNetEvent('len_ts:openPlayer', function()
    openUI('openPlayer')
end)

RegisterNetEvent('len_ts:openAdmin', function(data)
    openUI('openAdmin', data)
end)

RegisterNetEvent('len_ts:refresh', function(data)
    SendNUIMessage({ action = 'refresh', tickets = data.tickets, admins = data.admins, duty = data.duty })
end)

RegisterNetEvent('len_ts:openChat', function(history)
    openUI('openChat', { history = history })
end)

RegisterNetEvent('len_ts:chatMessage', function(entry)
    if chatOpen then
        SendNUIMessage({ action = 'addChat', data = entry })
    else
        playSound()
        notify(L('chat_title', entry.sender), entry.message, 'chat')
    end
end)

RegisterNetEvent('len_ts:notify', function(title, message, typ, extra)
    notify(title, message, typ, extra)
end)

RegisterNetEvent('len_ts:notifyAdmin', function(info)
    playSound()
    SendNUIMessage({
        action = 'notify',
        type = 'admin',
        title = L('notify_new_ticket', info.id),
        rows = {
            { label = L('ui_subject'), value = info.subject },
            { label = L('ui_player'), value = info.playerName },
            { label = L('ui_char'), value = info.charName },
            { label = L('ui_job'), value = info.job },
        },
        message = info.message,
        hint = L('notify_hint', Config.Command.admin),
        position = Config.Notify.position,
        duration = Config.Notify.duration,
    })
end)

RegisterNetEvent('len_ts:notifyOffDuty', function(id)
    playSound()
    notify(L('notify_support_needed'), L('notify_support_text', id, Config.Command.admin), 'admin')
end)

RegisterNetEvent('len_ts:setWaypoint', function(x, y)
    SetNewWaypoint(x, y)
    notify(L('title_admin_action'), L('msg_waypoint'), 'success')
end)

RegisterNetEvent('len_ts:toggleFreeze', function()
    frozen = not frozen
    FreezeEntityPosition(PlayerPedId(), frozen)
    notify(L('title_admin'), L(frozen and 'msg_frozen' or 'msg_unfrozen'), frozen and 'info' or 'success')
end)

RegisterNetEvent('len_ts:requestStats', function()
    local ped = PlayerPedId()
    local veh = GetVehiclePedIsIn(ped, false)
    local stats = {
        hp = GetEntityHealth(ped),
        armor = GetPedArmour(ped),
        inVehicle = veh ~= 0,
        fuel = 0,
        engine = 0,
        body = 0,
        tank = 0,
    }
    if veh ~= 0 then
        stats.fuel = GetVehicleFuelLevel(veh)
        stats.engine = GetVehicleEngineHealth(veh)
        stats.body = GetVehicleBodyHealth(veh)
        stats.tank = GetVehiclePetrolTankHealth(veh)
    end
    TriggerServerEvent('len_ts:server:stats', stats)
end)

RegisterNetEvent('len_ts:executeAction', function(action, value)
    local ped = PlayerPedId()
    local veh = GetVehiclePedIsIn(ped, false)
    local v = (tonumber(value) or 0) + 0.0

    local vehicleActions = {
        fixVeh = function(x)
            SetVehicleFixed(x)
            SetVehicleDeformationFixed(x)
            SetVehicleEngineHealth(x, 1000.0)
            SetVehicleBodyHealth(x, 1000.0)
            SetVehiclePetrolTankHealth(x, 1000.0)
            SetVehicleDirtLevel(x, 0.0)
        end,
        setFuel = function(x) setFuel(x, v) end,
        setVehEngine = function(x) SetVehicleEngineHealth(x, v) end,
        setVehBody = function(x) SetVehicleBodyHealth(x, v) end,
        setVehTank = function(x) SetVehiclePetrolTankHealth(x, v) end,
    }

    if action == 'setHealth' then
        SetEntityHealth(ped, math.floor(v))
    elseif action == 'setArmor' then
        SetPedArmour(ped, math.floor(v))
    elseif vehicleActions[action] then
        if veh == 0 then
            return notify(L('title_admin_action'), L('msg_no_vehicle'), 'error')
        end
        vehicleActions[action](veh)
    else
        return
    end

    notify(L('title_admin_action'), L('msg_done'), 'success')
end)

RegisterNUICallback('close', function(_, cb)
    closeUI()
    cb('ok')
end)

RegisterNUICallback('submit', function(data, cb)
    closeUI()
    TriggerServerEvent('len_ts:server:submit', data.subject, data.message)
    cb('ok')
end)

RegisterNUICallback('action', function(data, cb)
    TriggerServerEvent('len_ts:server:action', data.id, data.action, data.value)
    cb('ok')
end)

RegisterNUICallback('toggleDuty', function(_, cb)
    TriggerServerEvent('len_ts:server:toggleDuty')
    cb('ok')
end)

RegisterNUICallback('poll', function(_, cb)
    TriggerServerEvent('len_ts:server:pollStats')
    cb('ok')
end)

RegisterNUICallback('chatSend', function(data, cb)
    TriggerServerEvent('len_ts:server:chat', data.message)
    cb('ok')
end)
