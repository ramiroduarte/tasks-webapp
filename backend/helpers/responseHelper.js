export const createRes = (statusCode = 200, { msg = '', data = null, error = null } = {}) => {
	const statusCodes = [200, 201, 400, 404, 500];
	if (!statusCodes.includes(statusCode)) {
		throw new Error(`Invalid status code: ${statusCode}`);
	}
	return {
		success: statusCode >= 200 && statusCode < 300,
		statusCode,
		msg,
		data,
		error
	};
};

export const sendRes = (res, statusCode, { msg = '', data = null, error = null } = {}) => {
	return res.status(statusCode).json(createRes(statusCode, { msg, data, error }));
}