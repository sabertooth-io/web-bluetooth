/**
*
*
*/
function errorHandler(error, context, nativeErrorObject) {
	// Big object mapping error codes (keys) to error messages (values)
	console.error(error, context, nativeErrorObject);
}

module.exports = { errorHandler };
