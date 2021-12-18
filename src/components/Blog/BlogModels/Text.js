import {blogContentEnum} from "./Enums"
import {v4 as uuidv4} from "uuid"

class Text {
    /*

    id = ""
    index = ""
    type = blogContentEnum.TEXT
    content = "Your content goes here"
    firstContent = ""
    thirdContent = ""

    */

   type = blogContentEnum.TEXT

    constructor(
        id = uuidv4(),
        content = "Your content goes here",
        textContent = "Your content goes here",
        firstContent = "",
        thirdContent = ""
    ) {        
        this.id = id
        this.content = content
        this.textContent = textContent
        this.firstContent = firstContent
        this.thirdContent = thirdContent        
    }
}

export default Text