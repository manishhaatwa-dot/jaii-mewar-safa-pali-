document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       CURRENT YEAR
    ========================================== */

    const yearElement = document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    /* =========================================
       GITHUB SETTINGS
    ========================================== */

    const GITHUB_OWNER = "manishhaatwa-dot";
    const GITHUB_REPO = "Jaii-Mewar-Saafa";
    const GITHUB_BRANCH = "main";


    /* =========================================
       PRODUCT FOLDERS
    ========================================== */

    const categories = {

        saafa: "saafa-products",

        menswear: "menswear-products",

        wedding: "wedding-products",

        formal: "formal-products",

        jutti: "jutti-products"

    };


    /* =========================================
       SUPPORTED IMAGE TYPES
    ========================================== */

    const imageExtensions = [

        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".gif"

    ];


    /* =========================================
       LOAD ALL PRODUCTS
    ========================================== */

    async function loadProducts() {

        for (const category in categories) {

            const container =
                document.getElementById(categories[category]);

            if (!container) {
                continue;
            }


            try {

                const apiUrl =
                    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/assets/products/${category}?ref=${GITHUB_BRANCH}`;


                const response =
                    await fetch(apiUrl);


                if (!response.ok) {

                    throw new Error(
                        `GitHub API error: ${response.status}`
                    );

                }


                const files =
                    await response.json();


                const images =
                    files.filter(file =>

                        file.type === "file" &&

                        imageExtensions.some(ext =>
                            file.name
                                .toLowerCase()
                                .endsWith(ext)
                        )

                    );


                renderProducts(
                    container,
                    images
                );


            } catch (error) {

                console.error(
                    `Error loading ${category}:`,
                    error
                );


                container.innerHTML = `

                    <div class="empty-collection">

                        <i class="fa-regular fa-images"></i>

                        <p>
                            Collection coming soon
                        </p>

                    </div>

                `;

            }

        }

    }


    /* =========================================
       RENDER PRODUCTS
    ========================================== */

    function renderProducts(
        container,
        images
    ) {

        container.innerHTML = "";


        if (!images.length) {

            container.innerHTML = `

                <div class="empty-collection">

                    <i class="fa-regular fa-images"></i>

                    <p>
                        Collection coming soon
                    </p>

                </div>

            `;

            return;

        }


        images.forEach(file => {


            /* PRODUCT CARD */

            const card =
                document.createElement("div");

            card.className =
                "product-card";


            /* IMAGE WRAPPER */

            const imageWrap =
                document.createElement("div");

            imageWrap.className =
                "product-image-wrap";


            /* IMAGE */

            const image =
                document.createElement("img");

            image.className =
                "product-image";


            image.src =
                `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${file.path}`;


            image.loading = "lazy";


            /* =====================================
               PRODUCT NAME FROM FILE NAME
            ===================================== */

            let productName =
                file.name

                    .replace(/\.[^/.]+$/, "")

                    .replace(/[-_]+/g, " ")

                    .replace(/\s+/g, " ")

                    .trim();


            /* Title Case */

            productName =
                productName.replace(
                    /\b\w/g,
                    letter =>
                        letter.toUpperCase()
                );


            image.alt =
                `${productName} - Jai Mewar Saafa House Pali`;


            /* =====================================
               IMAGE ERROR
            ===================================== */

            image.onerror = () => {

                imageWrap.innerHTML = `

                    <div style="
                        width:100%;
                        height:100%;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        color:#a51c24;
                        background:#f5ead8;
                        font-size:35px;
                    ">

                        <i class="fa-regular fa-image"></i>

                    </div>

                `;

            };


            imageWrap.appendChild(image);


            /* =====================================
               PRODUCT NAME
            ===================================== */

            const name =
                document.createElement("div");

            name.className =
                "product-name";

            name.textContent =
                productName;


            /* =====================================
               ADD TO CARD
            ===================================== */

            card.appendChild(imageWrap);

            card.appendChild(name);

            container.appendChild(card);

        });

    }


    /* =========================================
       START
    ========================================== */

    loadProducts();

});
