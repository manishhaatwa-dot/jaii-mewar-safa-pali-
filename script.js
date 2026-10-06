document.addEventListener("DOMContentLoaded", () => {

    const yearElement = document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    /* =====================================================
       GITHUB SETTINGS
    ===================================================== */

    const GITHUB_OWNER = "manishhaatwa-dot";

    // GitHub par screenshot me exact repository name
    const GITHUB_REPO = "jaii-mewar-saafa-pali";

    const GITHUB_BRANCH = "main";


    /* =====================================================
       WEBSITE COLLECTIONS
    ===================================================== */

    const categories = {
        saafa: "saafa-products",
        wedding: "wedding-products",
        formal: "formal-products",
        jutti: "jutti-products"
    };


    const imageExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".gif"
    ];


    /* =====================================================
       LOAD PRODUCTS FROM GITHUB
    ===================================================== */

    async function loadProducts() {

        for (const category in categories) {

            const container =
                document.getElementById(categories[category]);

            if (!container) continue;


            try {

                const apiUrl =
                    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/assets/products/${category}?ref=${GITHUB_BRANCH}`;


                const response = await fetch(apiUrl);


                if (!response.ok) {

                    throw new Error(
                        `GitHub API Error: ${response.status}`
                    );

                }


                const files = await response.json();


                const images = files.filter(file => {

                    return (
                        file.type === "file" &&
                        imageExtensions.some(ext =>
                            file.name.toLowerCase().endsWith(ext)
                        )
                    );

                });


                renderProducts(container, images);


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


    /* =====================================================
       RENDER PRODUCTS
    ===================================================== */

    function renderProducts(container, images) {

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

            const card =
                document.createElement("div");

            card.className =
                "product-card";


            const imageWrap =
                document.createElement("div");

            imageWrap.className =
                "product-image-wrap";


            const image =
                document.createElement("img");

            image.className =
                "product-image";


            /* =================================================
               IMPORTANT:
               GitHub API ka direct download_url use kar rahe hain.
               Hindi filenames bhi properly load honge.
            ================================================= */

            image.src = file.download_url;


            image.loading = "lazy";


            /* =================================================
               PRODUCT NAME
            ================================================= */

            let productName =
                file.name
                    .replace(/\.[^/.]+$/, "")
                    .replace(/[-_]+/g, " ")
                    .replace(/\s+/g, " ")
                    .trim();


            image.alt =
                `${productName} - Jai Mewar Saafa House Pali`;


            /* =================================================
               IMAGE ERROR
            ================================================= */

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


            /* =================================================
               PRODUCT NAME
            ================================================= */

            const name =
                document.createElement("div");

            name.className =
                "product-name";

            name.textContent =
                productName;


            /* =================================================
               CARD
            ================================================= */

            card.appendChild(imageWrap);

            card.appendChild(name);

            container.appendChild(card);

        });

    }


    /* =====================================================
       START
    ===================================================== */

    loadProducts();

});
