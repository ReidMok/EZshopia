export async function GET() {
	// 返回基础运行状态，但不泄露敏感信息
	const apiKeyConfigured = Boolean(process.env.API_KEY && String(process.env.API_KEY).length > 0);
	return Response.json({
		status: 'ok',
		runtime: 'next-ssr',
		apiKeyConfigured,
		timestamp: new Date().toISOString(),
	});
}


