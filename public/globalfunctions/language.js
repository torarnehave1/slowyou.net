// language.js

function loadLanguage(language) {
    fetch(`/languages/${language}.json`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('navHome').innerText = data.navHome;
            document.getElementById('navFeatures').innerText = data.navFeatures;
            document.getElementById('navPricing').innerText = data.navPricing;
            document.getElementById('navFAQs').innerText = data.navFAQs;
            document.getElementById('navAbout').innerText = data.navAbout;
            document.getElementById('loginButton').innerText = data.loginButton;
            document.getElementById('signupButton').innerText = data.signupButton;
            document.getElementById('titlelanguage').innerText = data.titlelanguage;
            document.getElementById('heroTitle').innerText = data.heroTitle;
            document.getElementById('heroSubtitle').innerText = data.heroSubtitle;
            document.getElementById('heroText1').innerText = data.heroText1;
            document.getElementById('heroText2').innerText = data.heroText2;
            document.getElementById('learnMoreButton').innerText = data.learnMoreButton;
            document.getElementById('maintitlefirstpage').innerText = data.maintitlefirstpage;
        });
}

export default loadLanguage;