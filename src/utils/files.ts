import { readdirSync, unlinkSync, rename } from 'fs'
import { UPLOAD_LOCATION } from "../config/envConfig" 
import { extname } from 'path'

export const deleteFileIfExist = (fileToDelete: string) => {
    
    readdirSync(UPLOAD_LOCATION)
    .forEach((fileName: string) => {
        
        if ( fileName === fileToDelete )
            unlinkSync(`${UPLOAD_LOCATION}/${fileToDelete}`)
    })

}

export const renameFile = (fileName: string, newName: string) => {
    
    const newFileName: string = `${UPLOAD_LOCATION}${newName}${extname(fileName)}`

    rename(fileName, newFileName, (err) => {
        if (err)
            console.log(err);
            
    })
    return newFileName
}