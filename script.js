document.addEventListener("DOMContentLoaded", () => {

    /* ===============================
       YEAR
    =============================== */

    const yearElement = document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    /* ===============================
       GITHUB SETTINGS
    =============================== */

    const GITHUB_OWNER = "manishhaatwa-dot";
    const GITHUB_REPO = "jaii-mewar-safa-pali";
    const GITHUB_BRANCH = "main";


    /* ===============================
       COLLECTIONS
    =============================== */

    const categories = {
        saafa: "saafa-products",
        wedding: "wedding-products",
        jutti: "jutti-products"
    };


    /* ===============================
       IMAGE TYPES
    =============================== */

    const imageExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".gif"
    ];


    /* ===============================
       LOAD PRODUCTS
    =============================== */

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


                console.log("Loading:", apiUrl);


                const response =
                    await fetch(apiUrl);


                if (!response.ok) {

                    throw new Error(
                        `GitHub API Error: ${response.status}`
                    );

                }


                const files =
                    await response.json();


                const images =
                    files.filter(file => {

                        return (
                            file.type === "file" &&
                            file.name &&
                            imageExtensions.some(ext =>
                                file.name
                                    .toLowerCase()
                                    .endsWith(ext)
                            )
                        );

                    });


                console.log(
                    `${category}:`,
                    images.length,
                    "images found"
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
                        <p>Collection coming soon</p>
                    </div>
                `;

            }

        }

    }


    /* ===============================
       RENDER PRODUCTS
    =============================== */

    function renderProducts(
        container,
        images
    ) {

        container.innerHTML = "";


        if (!images.length) {

            container.innerHTML = `
                <div class="empty-collection">
                    <i class="fa-regular fa-images"></i>
                    <p>Collection coming soon</p>
                </div>
            `;

            return;
        }


        images.forEach(file => {

            /* =========================
               CARD
            ========================= */

            const card =
                document.createElement("div");

            card.className =
                "product-card";


            /* =========================
               IMAGE WRAPPER
            ========================= */

            const imageWrap =
                document.createElement("div");

            imageWrap.className =
                "product-image-wrap";


            /* =========================
               IMAGE
            ========================= */

            const image =
                document.createElement("img");

            image.className =
                "product-image";


            /*
               GitHub API ka download_url
               Hindi filenames ke liye safe hai.
            */

            image.src =
                file.download_url;


            image.loading =
                "lazy";


            /* =========================
               PRODUCT NAME
            ========================= */

            let productName =
                file.name
                    .replace(/\.[^/.]+$/, "")
                    .replace(/[-_]+/g, " ")
                    .replace(/\s+/g, " ")
                    .trim();


            image.alt =
                `${productName} - Jai Mewar Saafa House Pali`;


            /* =========================
               IMAGE ERROR
            ========================= */

            image.onerror = () => {

                imageWrap.innerHTML = `
                    <div style="
                        width:100%;
                        height:100%;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        color:#c62832;
                        background:#fff1f2;
                        font-size:35px;
                    ">
                        <i class="fa-regular fa-image"></i>
                    </div>
                `;

            };


            imageWrap.appendChild(image);


            /* =========================
               NAME
            ========================= */

            const name =
                document.createElement("div");

            name.className =
                "product-name";

            name.textContent =
                productName;


            /* =========================
               ADD TO CARD
            ========================= */

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


    /* ===============================
       START
    =============================== */

    loadProducts();

});
