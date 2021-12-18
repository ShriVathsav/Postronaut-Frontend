import {blogContentEnum} from "./Enums"
import {v4 as uuidv4} from "uuid"

class ImageItem {
    /*
    id = ""
    databaseId = ""
    type = blogContentEnum.IMAGE
    imageSource = imageSourceEnum.LOCAL
    content = ""
    imageWidth = ""
    borderWidth = ""
    borderColor = ""
    borderStyle = null
    spaceAround = ""
    alternativeText = "This is an alternative text for the image"
    showCaptions = true
    captions = "This is a caption for the above image"
    firstContent = "<img alt='This is an alternative text for the image' style='width: px; border: 0px ; padding: px; max-width: 100%;' src='"
    thirdContent = "'/><figcaption style='padding: 9px; line-height: 1.4; color: rgba(0,0,0,.68);' >This is a caption for the above image</figcaption>"

    
    constructor(id, imageSource, content, imageWidth, databaseId = 0){
        this.id = id
        this.imageSource = imageSourceEnum[imageSource]
        this.content = content
        this.imageWidth = imageWidth
        this.databaseId = databaseId
    }

    
    constructor(id, databaseId, type, imageSource, content, imageWidth, borderWidth, borderColor,
        borderStyle, spaceAround, alternativeText, showCaptions, captions, firstContent, thirdContent) {
            this.id = id
            this.databaseId = databaseId
            this.type = type
            this.imageSource = imageSource
            this.content = content
            this.imageWidth = imageWidth
            this.borderWidth = borderWidth
            this.borderColor = borderColor
            this.borderStyle = borderStyle
            this.spaceAround = spaceAround
            this.alternativeText = alternativeText
            this.showCaptions = showCaptions
            this.captions = captions
            this.firstContent = firstContent
            this.thirdContent = thirdContent
    }
    */

   type = blogContentEnum.IMAGE

    constructor(
        content = "",
        imageWidth = "",        
        blob = null,
        status = "IN_MEMORY",
        id = uuidv4(),                    
        borderWidth = "",
        borderColor = "",
        borderStyle = null,
        spaceAround = "",
        alternativeText = "This is an alternative text for the image",
        showCaptions = true,
        captions = "This is a caption for the above image",
    ) {
        this.id = id
        this.content = content
        this.imageWidth = imageWidth
        this.status = status
        this.blob = blob
        this.borderWidth = borderWidth
        this.borderColor = borderColor
        this.borderStyle = borderStyle
        this.spaceAround = spaceAround
        this.alternativeText = alternativeText
        this.showCaptions = showCaptions
        this.captions = captions
        this.composeFirstContent()
        this.composeThirdContent()
    }

    composeFirstContent() {
        this.firstContent = `<img alt=${this.alternativeText} 
            style='width: ${this.imageWidth}px; 
                    border: ${this.borderWidth}px ${this.borderStyle || ''} ${this.borderColor}; 
                    padding: ${this.spaceAround}px; max-width: 100%;' 
            src='`
    }

    composeThirdContent() {
        this.thirdContent = `'/><figcaption style='padding: 9px; line-height: 1.4; color: rgba(0,0,0,.68);' >
            ${this.captions}</figcaption>`
    }
}

export default ImageItem