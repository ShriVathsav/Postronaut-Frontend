import axios from "axios"
import authHeader from "../../services/auth-header"

export const setAxiosHeader = () => {
    /*
    const tokenPresence = () => {
        //console.log(store)
          if(store.state.auth.user && Object.keys(store.state.auth.user).length !== 0){
              return store.state.auth.user.token ? store.state.auth.user.token : ""
          }
      }
      console.log(authHeader(), "UTILITY AUTH HEADER")
      */
      
      //axios.defaults.headers.common['Authorization'] = `Bearer ${tokenPresence()}`
      axios.defaults.headers.common['Authorization'] = authHeader()
}



export const textTemplate = () => {
    return {
        id: "",
        index: "",
        type: "Text",
        content: "Your content goes here",
        firstContent: "",
        thirdContent: ""
    }
}

export const headingTemplate = () => {
    return {
        id: "",
        index: "",
        type: "Heading",
        content: "Type a Heading",
        firstContent: "<div style='font-weight: bold; font-size: 22px;'>",
        thirdContent: "</div>"
    }
}

export const titleTemplate = () => {
    return {
        index: "",
        type: "Title",
        content: "Edit Title of your Post",
        firstContent: "<h1 style='font-size: 36px;'>",
        thirdContent: "</h1>"
    }
}

export const blockquoteTemplate = () => {
    return {
        id: "",
        index: "",
        type: "Blockquote",
        color: "#000000",
        backgroundColor: "",
        padding: 10,
        borderThickness: 2,
        content: "Write a Blockquote",
        firstContent: "<blockquote style='border-left: 2px solid #000000; background-color: ; padding: 10px;' >",
        thirdContent: "</blockquote>"
    }
}

export const imageTemplate = () => {
    return {
        id: "",
        databaseId: "",
        type: "Image",
        imageSource: "1",
        content: "",
        imageWidth: "",
        borderWidth: "",
        borderColor: "",
        borderStyle: null,
        spaceAround: "",
        alternativeText: "This is an alternative text for the image",
        showCaptions: true,
        captions: "This is a caption for the above image",
        firstContent: "<img alt='This is an alternative text for the image' style='width: px; border: 0px ; padding: px; max-width: 100%;' src='",
        thirdContent: "'/><figcaption style='padding: 9px; line-height: 1.4; color: rgba(0,0,0,.68);' >This is a caption for the above image</figcaption>"
    }
}


