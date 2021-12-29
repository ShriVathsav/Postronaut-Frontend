import {blogContentEnum} from "./Enums"
import {v4 as uuidv4} from "uuid"

class Title {
    /*

    id = "",
    type = blogContentEnum.TITLE,
    content = "Edit Title of your Post",
    firstContent = "<h1 style='font-size: 36px;'>",
    thirdContent = "</h1>"

    */

   type = blogContentEnum.TITLE

    constructor(
        id = uuidv4(),
        content = "Edit Title of your Post",
        textContent = "",
        firstContent = "<h1 style='font-size: 36px;'>",
        thirdContent = "</h1>"
    ) {
        this.id = id
        this.content = content
        this.textContent = textContent
        this.firstContent = firstContent
        this.thirdContent = thirdContent        
    }
}

export default Title