module.exports = function(req, res, next) {
    if(req.decoded.id == req.params.user_id) {
        next();
    } else {
        return res.status(401).send({ 
            success: false, 
            message: 'Insufficient permissions'
        });
    }
};