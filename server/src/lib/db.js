import mongoose from 'mongoose'
export const connetDB = async () => {
    try {
       const connection =await mongoose.connect(process.env.MONGODB_URI )
       console.log(`MongoDB Connected ${connection.connection.host}`)
    } catch (error) {
        console.log(`Error mongodb: ${error.message}`)
    }
};