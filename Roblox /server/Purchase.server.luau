local MarketplaceService = game:GetService("MarketplaceService")
local HttpService = game:GetService("HttpService")
local Config = require(script.Config)
local Auth = require(script.Auth)

local URL = Config.BACKEND_BASE_URL .. "/roblox/purchase"

MarketplaceService.ProcessReceipt = function(r)
	local body = HttpService:JSONEncode({
		receiptId = r.PurchaseId,
		amount = r.CurrencySpent
	})
	HttpService:PostAsync(URL, body, Enum.HttpContentType.ApplicationJson, false, Auth.buildHeaders(body, Config.API_SECRET))
	return Enum.ProductPurchaseDecision.PurchaseGranted
end