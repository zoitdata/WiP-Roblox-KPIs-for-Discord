local HttpService = game:GetService("HttpService")
local Auth = {}

function Auth.buildHeaders(body, secret)
	local ts = tostring(os.time())
	local raw = body .. "|" .. ts .. "|" .. secret
	local sig = HttpService:HashString(raw)

	return {
		["X-Timestamp"] = ts,
		["X-Signature"] = "rbx_" .. sig,
		["Content-Type"] = "application/json"
	}
end

return Auth
