module.exports = {
    secret: process.env.JWT_SECRET,
    jwtExpirationTime: 7200,    // 2 hours.
    jwtRefreshExpirationTime: 43200,    // 12 hours.

    // jwtExpirationTime: 60,    // 1 min.
    // jwtRefreshExpirationTime: 43200,    // 12 hours.
}
