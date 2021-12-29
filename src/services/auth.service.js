import axios from 'axios'

//const API_URL2 = 'http://localhost:5000/api/auth/'

import AWS from 'aws-sdk'
require("dotenv").config()

AWS.config.update({
    accessKeyId: process.env.VUE_APP_ACCESS_KEY,
    secretAccessKey: process.env.VUE_APP_SECRET_ACCESS_KEY
})

const s3Bucket = process.env.VUE_APP_BUCKET_NAME
const myBucket = new AWS.S3({
    params: { Bucket: process.env.VUE_APP_BUCKET_NAME},
    signatureVersion: 'v4',
    region: process.env.VUE_APP_BUCKET_REGION
})

class AuthService {
    async generatePresignedUrl(key){
        return new Promise((resolve,reject) => {
            const bucketName = s3Bucket
            const myKey = key
            const signedUrlExpireSeconds = 86400
            const params = {
                Bucket: bucketName,
                Key: myKey,
                Expires: signedUrlExpireSeconds
            }
            myBucket.getSignedUrl('getObject', params, (err, url) => {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                console.log(url)
                resolve(url)
            })
        });
    }

    login(user) {
        console.log(user, "FROM AUTHSERVICE")
        return axios.post('/api/auth/signin', {
            email: user.email,
            password: user.password
        })
        .then(async response => {
            console.log(response, "RESPONSE FDROM AUTH SERVICE")
            if (response.data.token) {
                if(response.data.profilePicUrl){
                    response.data.profilePicUrl = await this.generatePresignedUrl(response.data.profilePicUrl)
                }
                console.log(response.data.token)
                localStorage.setItem('user', JSON.stringify(response.data))
            }

            return response.data;
        })
    }

    logout() {
        localStorage.removeItem('user');
    }

    register(user) {
        return axios.post('/api/auth/signup', {
            username: user.username,
            email: user.email,
            password: user.password,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        })
    }
}

export default new AuthService()