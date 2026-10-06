document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       YEAR
    ========================================= */

    const yearElement =
        document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent =
            new Date().getFullYear();
    }


    /* =========================================
       GITHUB SETTINGS
    ========================================= */

    const GITHUB_OWNER =
        "manishhaatwa-dot";

    /*
       Screenshot me exact repository:
       jaii-mewar-safa-pali-
    */

    const GITHUB_REPO =
        "jaii-mewar-safa-pali-";

    const GITHUB_BRANCH =
        "main";


    /* =========================================
       GITHUB PRODUCT FOLDERS
    ========================================= */

    const categories = {

        saafa: "saafa-products",

        wedding: "wedding-products",

        jutti: "jutti-products"

    };


    /* =========================================
       ALLOWED IMAGE FILES
    ========================================= */

    const imageExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".gif"
    ];


    /* =========================================
       LOAD PRODUCTS
    ========================================= */

    async function loadProducts() {

        for (const folder in categories) {

            const container =
                document.getElementById(
                    categories[folder]
                );


            if (!container) {

                console.error(
                    "HTML container missing:",
                    categories[folder]
                );

                continue;
            }


            try {

                const apiUrl =
                    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/assets/products/${folder}?ref=${GITHUB_BRANCH}`;


                console.log(
                    "GitHub loading:",
                    apiUrl
                );


                const response =
                    await fetch(apiUrl);


                if (!response.ok) {

                    throw new Error(
                        `GitHub API Error: ${response.status}`
                    );

                }


                const files =
                    await response.json();


                console.log(
                    folder,
                    "files:",
                    files
                );


                /*
                   Folder ke andar jo bhi image hogi:
                   Hindi
                   English
                   Number
                   Space
                   Underscore
                   etc.

                   sab automatically load hogi.
                */

                const images =
                    files.filter(file => {

                        if (
                            file.type !== "file"
                        ) {
                            return false;
                        }


                        if (!file.name) {
                            return false;
                        }


                        const filename =
                            file.name.toLowerCase();


                        return imageExtensions.some(
                            extension =>
                                filename.endsWith(
                                    extension
                                )
                        );

                    });


                console.log(
                    folder,
                    "images found:",
                    images.length
                );


                renderProducts(
                    container,
                    images
                );

            }


            catch (error) {

                console.error(
                    "PRODUCT LOAD ERROR:",
                    folder,
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
    ========================================= */

    function renderProducts(
        container,
        images
    ) {

        container.innerHTML = "";


        if (
            !images ||
            images.length === 0
        ) {

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

            /* =================================
               PRODUCT CARD
            ================================= */

            const card =
                document.createElement("div");

            card.className =
                "product-card";


            /* =================================
               IMAGE WRAPPER
            ================================= */

            const imageWrap =
                document.createElement("div");

            imageWrap.className =
                "product-image-wrap";


            /* =================================
               IMAGE
            ================================= */

            const image =
                document.createElement("img");

            image.className =
                "product-image";


            /*
               GitHub API ka download_url.
               Hindi filename ke liye bhi safe.
            */

            image.src =
                file.download_url;


            image.loading =
                "lazy";


            /* =================================
               PRODUCT NAME
            ================================= */

            let productName =
                file.name
                    .replace(
                        /\.[^/.]+$/,
                        ""
                    )
                    .replace(
                        /[-_]+/g,
                        " "
                    )
                    .replace(
                        /\s+/g,
                        " "
                    )
                    .trim();


            image.alt =
                `${productName} - Jai Mewar Saafa House Pali`;


            /* =================================
               IMAGE ERROR
            ================================= */

            image.onerror = () => {

                imageWrap.innerHTML = `
                    <div
                        style="
                            width:100%;
                            height:100%;
                            display:flex;
                            align-items:center;
                            justify-content:center;
                            background:#fff1f2;
                            color:#c62832;
                            font-size:35px;
                        "
                    >
                        <i class="fa-regular fa-image"></i>
                    </div>
                `;

            };


            imageWrap.appendChild(
                image
            );


            /* =================================
               NAME
            ================================= */

            const name =
                document.createElement("div");

            name.className =
                "product-name";

            name.textContent =
                productName;


            /* =================================
               CARD
            ================================= */

            card.appendChild(
                imageWrap
            );

            card.appendChild(
                name
            );

            container.appendChild(
                card
            );

        });

    }


    /* =========================================
       START
    ========================================= */

    console.log(
        "Jai Mewar script.js connected successfully."
    );


    loadProducts();

});
