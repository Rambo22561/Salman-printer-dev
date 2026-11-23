/* =========================================================
   SALMAN PRINTER
   Main JavaScript
   ========================================================= */

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js")
            .then(() => console.log("Service worker registered"))
            .catch((error) => console.log("Service worker registration failed", error));
    });
}

const splash = document.getElementById("appSplash");
const offlineBanner = document.getElementById("offlineBanner");

if (splash) {
    setTimeout(() => {
        splash.classList.add("hidden");
    }, 1200);
}

const updateOfflineStatus = () => {
    if (!offlineBanner) return;

    if (!navigator.onLine) {
        offlineBanner.hidden = false;
        offlineBanner.classList.add("show");
    } else {
        offlineBanner.hidden = true;
        offlineBanner.classList.remove("show");
    }
};

window.addEventListener("online", updateOfflineStatus);
window.addEventListener("offline", updateOfflineStatus);
updateOfflineStatus();

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       BUSINESS SETTINGS
       Change these later when needed
       ===================================================== */

    const BUSINESS = {
        name: "Salman Printer",

        // Business contact number
        whatsapp: "923420887705",

        phone: "+92 342 0887705",

        email: "khan561salman@gmail.com",

        currency: "Rs."
    };


    /* =====================================================
       MOBILE MENU
       ===================================================== */

    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav");

    if (menuToggle && nav) {

        menuToggle.addEventListener("click", () => {
            nav.classList.toggle("open");
            menuToggle.classList.toggle("active");
        });

        // Close menu when clicking a navigation link
        const navLinks = document.querySelectorAll(".nav-link");

        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                nav.classList.remove("open");
                menuToggle.classList.remove("active");
            });
        });
    }


    /* =====================================================
       SMOOTH SCROLL
       ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (target) {

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });

    });


    /* =====================================================
       ACTIVE NAVIGATION LINK
       ===================================================== */

    const sections = document.querySelectorAll("section[id]");
    const navigationLinks = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", () => {

        let currentSection = "";

        sections.forEach(section => {

            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;

            if (
                window.scrollY >= sectionTop &&
                window.scrollY < sectionTop + sectionHeight
            ) {
                currentSection = section.getAttribute("id");
            }

        });

        navigationLinks.forEach(link => {

            link.classList.remove("active");

            const href = link.getAttribute("href");

            if (href === `#${currentSection}`) {
                link.classList.add("active");
            }

        });

    });


    /* =====================================================
       SCROLL REVEAL ANIMATION
       ===================================================== */

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        observer.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach(element => {
            element.classList.add("visible");
        });

    }


    /* =====================================================
       PRICING DATA
       ===================================================== */

    const prices = {

        normal: {
            withInstallation: 60,
            withoutInstallation: 50
        },

        star: {
            withInstallation: 90,
            withoutInstallation: 65
        },

        vinyl: {
            withInstallation: 130,
            withoutInstallation: 100
        },

        oneVision: {
            withInstallation: 150,
            withoutInstallation: 140
        },

        backlight: {
            withInstallation: 500,
            withoutInstallation: 350
        },

        wallpaper: {
            withInstallation: 150,
            withoutInstallation: 100
        }

    };


    /* =====================================================
       PRICE CALCULATOR
       ===================================================== */

    const calculatorForm = document.querySelector("#calculatorForm");

    if (calculatorForm) {

        calculatorForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const widthInput = document.querySelector("#calcWidth");
            const heightInput = document.querySelector("#calcHeight");
            const materialInput = document.querySelector("#calcMaterial");
            const installationInput = document.querySelector("#calcInstallation");

            const resultBox = document.querySelector("#calculatorResult");

            if (
                !widthInput ||
                !heightInput ||
                !materialInput ||
                !installationInput ||
                !resultBox
            ) {
                return;
            }

            const width = parseFloat(widthInput.value);
            const height = parseFloat(heightInput.value);

            const material = materialInput.value;
            const installation = installationInput.value;

            if (
                isNaN(width) ||
                isNaN(height) ||
                width <= 0 ||
                height <= 0
            ) {

                resultBox.innerHTML = `
                    <div class="calculator-error">
                        Please enter a valid width and height.
                    </div>
                `;

                return;
            }

            const area = width * height;

            let pricePerSqFt = 0;

            if (prices[material]) {

                if (installation === "yes") {

                    pricePerSqFt =
                        prices[material].withInstallation;

                } else {

                    pricePerSqFt =
                        prices[material].withoutInstallation;
                }

            }

            let estimatedPrice = area * pricePerSqFt;

            /*
              Large quantity discount
              500+ square feet
            */

            let discount = 0;

            if (area >= 500) {
                discount = estimatedPrice * 0.05;
            }

            const finalPrice = estimatedPrice - discount;

            resultBox.innerHTML = `
                <div class="calculator-result-inner">

                    <h3>Estimated Cost</h3>

                    <div class="result-row">
                        <span>Area</span>
                        <strong>${area.toFixed(2)} sq ft</strong>
                    </div>

                    <div class="result-row">
                        <span>Rate</span>
                        <strong>Rs. ${pricePerSqFt}/sq ft</strong>
                    </div>

                    ${
                        discount > 0
                        ? `
                        <div class="result-row">
                            <span>Quantity Discount</span>
                            <strong>- Rs. ${discount.toFixed(0)}</strong>
                        </div>
                        `
                        : ""
                    }

                    <div class="result-total">
                        <span>Estimated Total</span>
                        <strong>Rs. ${finalPrice.toFixed(0)}</strong>
                    </div>

                    <p class="calculator-note">
                        This is an estimated price. Final price may vary
                        depending on material, location, design, quantity
                        and installation requirements.
                    </p>

                </div>
            `;

        });

    }


    /* =====================================================
       GALLERY FILTER
       ===================================================== */

    const filterButtons = document.querySelectorAll(".filter-btn");
    const workCards = document.querySelectorAll(".work-card");

    if (filterButtons.length > 0 && workCards.length > 0) {

        filterButtons.forEach(button => {

            button.addEventListener("click", () => {

                // Remove active class
                filterButtons.forEach(btn => {
                    btn.classList.remove("active");
                });

                // Add active class
                button.classList.add("active");

                const filter = button.dataset.filter;

                workCards.forEach(card => {

                    const category = card.dataset.category;

                    if (
                        filter === "all" ||
                        category === filter
                    ) {

                        card.style.display = "";

                        setTimeout(() => {
                            card.classList.add("visible");
                        }, 10);

                    } else {

                        card.style.display = "none";
                        card.classList.remove("visible");

                    }

                });

            });

        });

    }


    /* =====================================================
       QUOTE FORM
       ===================================================== */

    const quoteForm = document.querySelector("#quoteForm");

    if (quoteForm) {

        quoteForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const name = document.querySelector("#customerName")?.value.trim();
            const phone = document.querySelector("#customerPhone")?.value.trim();
            const service = document.querySelector("#quoteService")?.value;
            const width = document.querySelector("#quoteWidth")?.value.trim();
            const height = document.querySelector("#quoteHeight")?.value.trim();
            const location = document.querySelector("#quoteLocation")?.value.trim();
            const message = document.querySelector("#quoteDetails")?.value.trim();

            const successMessage =
                document.querySelector(".form-success");

            if (!name || !phone || !service) {

                if (successMessage) {

                    successMessage.style.display = "block";

                    successMessage.innerHTML = `
                        <span>
                            Please fill in your name, phone number
                            and required service.
                        </span>
                    `;

                    successMessage.classList.add("error");
                }

                return;
            }

            const size = [width, height]
                .filter(value => value && value !== "0")
                .join(" ft x ") + (width || height ? " ft" : "");

            /*
              WhatsApp message
            */

            let whatsappMessage =
                `Assalam-o-Alaikum Salman Printer,%0A%0A` +

                `I want to request a quotation.%0A%0A` +

                `Name: ${encodeURIComponent(name)}%0A` +

                `Phone: ${encodeURIComponent(phone)}%0A` +

                `Service: ${encodeURIComponent(service)}%0A`;

            if (size) {
                whatsappMessage +=
                    `Size: ${encodeURIComponent(size)}%0A`;
            }

            if (location) {
                whatsappMessage +=
                    `Location: ${encodeURIComponent(location)}%0A`;
            }

            if (message) {
                whatsappMessage +=
                    `Details: ${encodeURIComponent(message)}%0A`;
            }

            whatsappMessage +=
                `%0APlease provide me with an estimated quotation.`;


            const whatsappURL =
                `https://wa.me/${BUSINESS.whatsapp}?text=${whatsappMessage}`;


            /*
              Show success message
            */

            if (successMessage) {

                successMessage.style.display = "block";

                successMessage.classList.remove("error");

                successMessage.innerHTML = `
                    <span>
                        Your quotation request is ready.
                        Opening WhatsApp...
                    </span>
                `;

            }


            /*
              Open WhatsApp
            */

            setTimeout(() => {
                window.open(
                    whatsappURL,
                    "_blank"
                );
            }, 700);

        });

    }


    /* =====================================================
       WHATSAPP BUTTONS
       ===================================================== */

    const whatsappButtons =
        document.querySelectorAll("[data-whatsapp]");

    whatsappButtons.forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();

            const message =
                button.dataset.message ||
                "Assalam-o-Alaikum Salman Printer, I want to ask about your printing and installation services.";

            const url =
                `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`;

            window.open(url, "_blank");

        });

    });


    /* =====================================================
       PHONE BUTTONS
       ===================================================== */

    const phoneButtons =
        document.querySelectorAll("[data-phone]");

    phoneButtons.forEach(button => {

        button.addEventListener("click", event => {

            if (BUSINESS.phone === "03XX-XXXXXXX") {

                event.preventDefault();

                alert(
                    "Please add your real phone number inside script.js."
                );

            }

        });

    });


    /* =====================================================
       COPY PHONE NUMBER
       ===================================================== */

    const copyPhoneButton =
        document.querySelector("#copyPhone");

    if (copyPhoneButton) {

        copyPhoneButton.addEventListener("click", async () => {

            try {

                await navigator.clipboard.writeText(
                    BUSINESS.phone
                );

                copyPhoneButton.textContent =
                    "Copied!";

                setTimeout(() => {

                    copyPhoneButton.textContent =
                        "Copy Number";

                }, 2000);

            } catch (error) {

                console.log(
                    "Could not copy phone number."
                );

            }

        });

    }


    /* =====================================================
       CURRENT YEAR
       ===================================================== */

    const yearElements =
        document.querySelectorAll(".current-year");

    yearElements.forEach(element => {

        element.textContent =
            new Date().getFullYear();

    });


    /* =====================================================
       HEADER SHADOW ON SCROLL
       ===================================================== */

    const header =
        document.querySelector(".header");

    if (header) {

        window.addEventListener("scroll", () => {

            if (window.scrollY > 30) {

                header.classList.add("scrolled");

            } else {

                header.classList.remove("scrolled");

            }

        });

    }


    /* =====================================================
       BACK TO TOP BUTTON
       ===================================================== */

    const backToTop =
        document.querySelector("#backToTop");

    if (backToTop) {

        window.addEventListener("scroll", () => {

            if (window.scrollY > 500) {

                backToTop.classList.add("show");

            } else {

                backToTop.classList.remove("show");

            }

        });


        backToTop.addEventListener("click", () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }


    /* =====================================================
       IMAGE ERROR HANDLING
       ===================================================== */

    document.querySelectorAll("img").forEach(image => {

        image.addEventListener("error", () => {

            image.classList.add("image-error");

            console.log(
                "Image could not be loaded:",
                image.src
            );

        });

    });


    /* =====================================================
       SERVICE CARD CLICK
       ===================================================== */

    const serviceCards =
        document.querySelectorAll(".service-card");

    serviceCards.forEach(card => {

        card.addEventListener("click", () => {

            const quoteSection =
                document.querySelector("#quote");

            if (quoteSection) {

                quoteSection.scrollIntoView({
                    behavior: "smooth"
                });

            }

        });

    });


    /* =====================================================
       CONSOLE MESSAGE
       ===================================================== */

    console.log(
        "%c Salman Printer Website Loaded ",
        "font-size:16px;font-weight:bold;"
    );

    console.log(
        "Printing • Installation • Branding • Design"
    );

});