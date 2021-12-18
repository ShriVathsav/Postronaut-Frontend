export const validateNumeric = (num, min, max) => {
    if(Object.is(Number(num), NaN)) return false
    console.log(num <= max, num >=min, num, num <= max && num >=min)
    return num <= max && num >=min
}

export const removeSpacesFromTextInput = (val) => {
    return val.replace(/\s\s+/g, ' ')
}

export const isNumber = (evt) => {
    evt = (evt) ? evt : window.event;
    console.log("CALLING IS NUMBER", evt)
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
    } else {
        return true;
    }
}

export const validateEmail = (email) => {
    return new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(email)
}

export const removeSpacesFromPasswordInput = (val) => {
    return val.replace(/\s/g, "")
}