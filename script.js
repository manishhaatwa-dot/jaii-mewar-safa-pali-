document.addEventListener("DOMContentLoaded", () => {

    /* ===============================
       YEAR
    =============================== */

    const yearElement = document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    /* ===============================
       GITHUB
    =============================== */

    const GITHUB_OWNER = "manishhaatwa-dot";
    const GITHUB_REPO = "jai-mewar-safa-pali";
    const GITHUB_BRANCH = "main";


    /* ===============================
       PRODUCT FOLDERS
    =============================== */

    const categories = {
        saafa: "saafa-products",
        wedding: "wedding-products",
        jutti: "jutti-products"
    };


    /* ===============================
       IMAGE EXTENSIONS
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

        for (const folder in categories) {

            const container =
                document.getElementById(categories[folder]);

            if (!container) continue;


            try {

                const apiUrl =
                    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/assets/products/${folder}?ref=${GITHUB_BRANCH}`;


                const response =
                    await fetch(apiUrl);


                if (!response.ok) {
                    throw new Error(
                        `GitHub Error: ${response.status}`
                    );
                }


                const files =
                    await response.json();


                /*
                   Folder ke andar jo bhi
                   Hindi / English filename ho,
                   automatically image milegi.
                */

                const images = files.filter(file => {

                    if (file.type !== "file") {
                        return false;
                    }

                    if (!file.name) {
                        return false;
                    }

                    const lowerName =
                        file.name.toLowerCase();

                    return imageExtensions.some(ext =>
                        lowerName.endsWith(ext)
                    );

                });


                renderProducts(
                    container,
                    images
                );


            } catch (error) {

                console.error(
                    `Error loading ${folder}:`,
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
       DISPLAY PRODUCTS
    =============================== */

    function renderProducts(
        container,
        images
    ) {

        container.innerHTML = "";


        if (images.length === 0) {

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
               IMAGE
            ========================= */

            const imageWrap =
                document.createElement("div");

            imageWrap.className =
                "product-image-wrap";


            const image =
                document.createElement("img");

            image.className =
                "product-image";


            /*
               GitHub API ka download_url
               use kar rahe hain.

               Isse Hindi filenames bhi
               properly load honge.
            */

            image.src =
                file.download_url;


            image.loading =
                "lazy";


            /* =========================
               FILE NAME → PRODUCT NAME
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
                        background:#fff1f2;
                        color:#c62832;
                        font-size:35px;
                    ">
                        <i class="fa-regular fa-image"></i>
                    </div>
                `;

            };


            imageWrap.appendChild(image);


            /* =========================
               PRODUCT NAME
            ========================= */

            const name =
                document.createElement("div");

            name.className =
                "product-name";

            name.textContent =
                productName;


            /* =========================
               CARD COMPLETE
            ========================= */

            card.appendChild(imageWrap);

            card.appendChild(name);

            container.appendChild(card);

        });

    }


    /* ===============================
       START
    =============================== */

    loadProducts();

});
