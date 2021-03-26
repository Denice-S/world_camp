//bootstrap code validate our forms

(function () {
    'use strict'
    //fetch all the form we want to apply custom bootstrap validation styles to.
    const forms = document.querySelectorAll(".validated-form")
    // turn it into an array and then loop over them and prevent submission 
    Array.from(forms)
        .forEach(function (form) {
            form.addEventListener("submit", function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }
                form.classList.add("was-validated")
            }, false)
        })
})()