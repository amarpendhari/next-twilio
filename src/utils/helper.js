export function objectDeepClone(obj) {
    return JSON.parse(JSON.stringify(obj))
}

export const validateForm = async (obj, objValidation, notRequired) => {
    let errors = {}
    if (notRequired !== undefined) {
        for (const [key, value] of Object.entries(obj)) {
            if (value === null || value === '' || value?.length === 0) {
                if (!notRequired.includes(key)) {
                    errors[key] = unSlugify(key) + ' is required'
                }
            } else {
                for (const [key, value] of Object.entries(obj)) {
                    if (value === null || value === '' || value?.length === 0) {
                        if (!notRequired.includes(key)) errors[key] = unSlugify(key) + ' is required'
                    } else {
                        // console.log(key, value)
                        let err = await customValidate(key, objValidation[key], value)
                        if (err !== true) {
                            errors[key] = err
                        }
                        // console.log('customValidate final eroororo',err)
                    }
                }
                // console.log(err)
            }
        }
    } else {
        for (const [key, value] of Object.entries(obj)) {
            if (key === 'supportingAssetMediaFiles') continue
            // console.log({ value, key });
            // console.log(objValidation, objValidation[key])
            if (value === null || value === '' || value?.length === 0) {
                errors[key] = key === 'primarySalePrice' ? unSlugify('basePrice') : unSlugify(key)
                errors[key] = errors[key] + ' is required'
            } else {
                // console.log(key, value)
                let err = await customValidate(key, objValidation[key], value)
                if (err !== true) {
                    errors[key] = err
                }
                // console.log('customValidate final eroororo',err)
            }
        }
    }
    if (Object.keys(errors).length) {
        return errors
    } else {
        return true
    }
}

// extra validation
const customValidate = async (key, keyValidation, value) => {
    // console.log('customValidate', key, keyValidation, value)
    if (keyValidation === 'email') {
        let res = await ValidateEmail(value)
        if (res) return true
        if (!res) return 'Enter a valid email address'
        // console.log('customValidate res', res)
    } else if (keyValidation === 'password') {
        let res = await checkPassword(value)
        // console.log('customValidate res', res)
        if (res) return true
        if (!res) return 'Password length must be atleast 8 characters with uppercase, lowercase, number and special characters'
    } if (keyValidation?.toString()?.includes('min') && !keyValidation?.toString()?.includes('max') && acceptOnlyNumbers(keyValidation) && key !== 'rsvpUrl') {
        let minVal = keyValidation?.split('|')
        let limit = minVal.find(el => el?.includes('min'))
        let res = await ValidateMinLength(key, acceptOnlyNumbers(limit), value)
        // console.log('validate min here', limit, res, keyValidation, keyValidation?.includes('min') , acceptOnlyNumbers(keyValidation))
        if (res) return true
        if (!res) return `The ${key} field requires ${acceptOnlyNumbers(limit)} min characters.`
    } else if (keyValidation?.toString()?.includes('max') && acceptOnlyNumbers(keyValidation) && key !== 'rsvpUrl') {
        let maxVal = keyValidation?.split('|')
        let limit = maxVal.find(el => el?.includes('max'))
        let res = await ValidateMaxLength(key, acceptOnlyNumbers(limit), value)
        // console.log('validate max here', limit, res, keyValidation, keyValidation?.includes('max') , acceptOnlyNumbers(keyValidation))
        if (res) return true
        if (!res) return `The ${key} field can have ${acceptOnlyNumbers(limit)} max characters.`
    } else {
        return true
    }
}

export function checkPassword(str) {
    if (str) {
        var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return re.test(str);
    }
    return null
}

// specific validation
function ValidateEmail(value) {
    var pattern = /^([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z]{2,4})+$/
    return pattern.test(value)
}
function ValidateMinLength(key, validate, value) {
    if (validate && value?.length >= validate) {
        return true
    } else {
        return false
    }
}
function ValidateMaxLength(key, validate, value) {
    if (validate && value?.length <= validate) {
        return true
    } else {
        return false
    }
}

export const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',')
    // const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1])
    let n = bstr.length
    let u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename)
    // return new File([u8arr], filename, {type:mime});
}

export const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w-]+/g, '') // Remove all non-word chars
        .replace(/--+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '') // Trim - from end of text
}

export const unSlugify = (slug) => {
    if (slug.includes('-') || slug.includes('_')) {
        var words = slug.split(/-|_/)
        return words
            .map(function (word) {
                return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()
            })
            .join(' ')
    } else {
        const str = slug.replace(/([A-Z])/g, ' $1')
        const finalStr = str.charAt(0).toUpperCase() + str.slice(1)
        return finalStr
    }
}