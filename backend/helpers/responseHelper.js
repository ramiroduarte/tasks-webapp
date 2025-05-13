export const createResponse = ({ success = true, msg = '', data = null, statusCode = 200, error = null } = {}) => {
	return {
		success,
		msg,
		data,
		error,
		statusCode
	};
};