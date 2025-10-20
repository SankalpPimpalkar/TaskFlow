
const AsyncHandler = (fn) => {
    return async (req, res, next) => {
        try {
            return await fn(req, res, next)
        } catch (error) {
            if (error instanceof Error) {
                return res
                    .status(500)
                    .json({
                        success: false,
                        message: error.message
                    })
            }
            return res
                .status(500)
                .json({
                    success: false,
                    message: 'Internal Server Error (Unknown)'
                })
        }
    }
}

export default AsyncHandler;