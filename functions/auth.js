require('dotenv').config({path: './config/config.env'})

const loginSuccess = async (req, res) => {
    
    return res.json({ message: "Success!"})
        
        
}

module.exports = {loginSuccess};