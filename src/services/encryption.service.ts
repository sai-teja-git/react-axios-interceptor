


const encryptData = (data: any) => {
    return btoa(JSON.stringify(data))
}

const decryptData = (data: string) => {
    return JSON.parse(atob(data))
}



const encryptionService = {
    encryptData,
    decryptData,
}

export default encryptionService