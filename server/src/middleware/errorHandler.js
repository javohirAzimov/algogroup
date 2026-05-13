// Global Express error handler — catches anything thrown in routes/controllers
export default function errorHandler(err, req, res, next) {
  console.error(err.stack)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  })
}
