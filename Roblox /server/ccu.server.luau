-- @02zoit | 12.02.2026

local Players = game:GetService("Players")
local HttpService = game:GetService("HttpService")
local Config = require(script.Config)
local Auth = require(script.Auth)

local URL = Config.BACKEND_BASE_URL .. "/roblox/ccu" --change accordingly

local function send()
	local body = HttpService:JSONEncode({ ccu = #Players:GetPlayers() })
	HttpService:PostAsync(URL, body, Enum.HttpContentType.ApplicationJson, false, Auth.buildHeaders(body, Config.API_SECRET))
end

Players.PlayerAdded:Connect(send)
Players.PlayerRemoving:Connect(send)
