const {connect} = require('mongoose')

const connectToDb = async(url) =>{
    try {
        await connect(url)
        console.log('Connected to Database')
    } catch (error) {
        console.log('Error in connecting to Database', error)
    }
}

module.exports = connectToDb