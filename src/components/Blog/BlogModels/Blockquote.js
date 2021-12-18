import {blogContentEnum} from "./Enums"
import {v4 as uuidv4} from "uuid"

class Blockquote {
    /*

    id = ""
    index = ""
    type = blogContentEnum.BLOCKQUOTE
    color = "#000000"
    backgroundColor = ""
    padding = 10
    borderThickness = 2
    content = "Write a Blockquote"
    firstContent = "<blockquote style='border-left: 2px solid #000000; background-color: ; padding: 10px;' >"
    thirdContent = "</blockquote>"

    */

   type = blogContentEnum.BLOCKQUOTE

    constructor(
        id = uuidv4(),        
        color = "black",
        backgroundColor = "",
        padding = 10,
        borderThickness = 2,
        content = "Write a Blockquote",
        textContent = "Write a Blockquote",
        //firstContent = "<blockquote style='border-left: 2px solid #000000; background-color: ; padding: 10px;' >",
        thirdContent = "</blockquote>"
    ) {
        this.id = id
        this.color = color
        this.backgroundColor = backgroundColor
        this.padding = padding
        this.borderThickness = borderThickness
        this.content = content
        this.textContent = textContent
        this.composeFirstContent()        
        this.thirdContent = thirdContent
    }

    composeFirstContent() {
        this.firstContent = `<blockquote style='border-left: ${this.borderThickness}px solid ${this.color}; 
                background-color: ${this.backgroundColor}; padding: ${this.padding}px;' >`
    }
}

export default Blockquote