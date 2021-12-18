import {blogContentEnum} from "./Enums"
import {v4 as uuidv4} from "uuid"

class Heading {
    /*
    
    id = ""
    index = ""
    type = blogContentEnum.HEADING
    content = "Type a Heading"
    firstContent = "<div style='font-weight: bold; font-size: 22px;'>"
    thirdContent = "</div>"
    
    */

   type = blogContentEnum.HEADING

    constructor(
        id = uuidv4(),
        content = "Type a Heading",
        textContent = "Type a Heading",
        firstContent = "<div style='font-weight: bold; font-size: 22px;'>",
        thirdContent = "</div>",
    ) {
        this.id = id
        this.content = content
        this.textContent = textContent
        this.firstContent = firstContent
        this.thirdContent = thirdContent
    }
}

export default Heading