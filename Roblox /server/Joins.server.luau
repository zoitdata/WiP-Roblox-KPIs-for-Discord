-- @02zoit | 12.02.2026

local Players = game:GetService("Players")
local HttpService = game:GetService("HttpService")
local Config = require(script.Config)
local Auth = require(script.Auth)

local URL = Config.BACKEND_BASE_URL .. "/roblox/join"		--change accordingly

Players.PlayerAdded:Connect(function()
	local body = "{}"
	HttpService:PostAsync(URL, body, Enum.HttpContentType.ApplicationJson, false, Auth.buildHeaders(body, Config.API_SECRET))
end)
