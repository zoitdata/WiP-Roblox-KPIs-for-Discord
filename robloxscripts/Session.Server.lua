local Players = game:GetService("Players")
local HttpService = game:GetService("HttpService")
local Config = require(script.Config)
local Auth = require(script.Auth)

local START = Config.BACKEND_BASE_URL .. "/roblox/session/start"
local END = Config.BACKEND_BASE_URL .. "/roblox/session/end"

Players.PlayerAdded:Connect(function(p)
	local body = HttpService:JSONEncode({ playerId = p.UserId, timestamp = os.time() })
	HttpService:PostAsync(START, body, Enum.HttpContentType.ApplicationJson, false, Auth.buildHeaders(body, Config.API_SECRET))
end)

Players.PlayerRemoving:Connect(function(p)
	local body = HttpService:JSONEncode({ playerId = p.UserId, timestamp = os.time() })
	HttpService:PostAsync(END, body, Enum.HttpContentType.ApplicationJson, false, Auth.buildHeaders(body, Config.API_SECRET))
end)