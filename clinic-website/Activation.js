document.getElementById('activation-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const codeInput = document.getElementById('activation-code');
    const activationCode = codeInput.value.trim();
    const btn = document.querySelector('.btn-activate');
    const btnText = btn.querySelector('span');

    if (activationCode === "") {
        alert("Please enter your activation code.");
        return;
    }

    btn.disabled = true;
    btnText.innerText = "Checking Code...";
    btn.style.opacity = "0.7";

    console.log("Attempting to activate with code: " + activationCode);


    setTimeout(() => {
        alert("Verification logic will be connected here by the developer. \nYour code: " + activationCode);

        btn.disabled = false;
        btnText.innerText = "Activate Now";
        btn.style.opacity = "1";
    }, 2000);
});