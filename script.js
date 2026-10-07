document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CURRENT YEAR
    ===================================================== */

    const yearElement =
        document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent =
            new Date().getFullYear();
    }


    /* =====================================================
       GITHUB SETTINGS
    ===================================================== */

    const GITHUB_OWNER =
        "manishhaatwa-dot";

    /*
       IMPORTANT:
       Ye GitHub ka actual repository name hai.
       Website par ye naam kahin display nahi hoga.
    */

    const GITHUB_REPO =
        "jaii-mewar-safa-pali-";

    const GITHUB_BRANCH =
        "main";


    /* =====================================================
       PRODUCT FOLDERS
    ===================================================== */

    const categories = {

        safa:
            "safa-products",

        wedding:
            "wedding-products",

        jutti:
            "jutti-products"

    };


    /* =====================================================
       SUPPORTED IMAGE TYPES
    ===================================================== */

    const imageExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".gif"
    ];


    /* =====================================================
       LOAD PRODUCTS
    ===================================================== */

    async function loadProducts() {

        for (const category in categories) {

            const container =
                document.getElementById(
                    categories[category]
                );


            if (!container) {
                continue;
            }


            try {

                /*
                   GitHub API se folder ki
                   complete file list lenge.
                */

                const apiUrl =
                    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/assets/products/${category}?ref=${GITHUB_BRANCH}`;


                const response =
                    await fetch(apiUrl, {
                        cache: "no-store"
                    });


                if (!response.ok) {

                    throw new Error(
                        `GitHub API Error: ${response.status}`
                    );

                }


                const files =
                    await response.json();


                /*
                   Sirf image files
                */

                const images =
                    files.filter(file => {

                        return (
                            file.type === "file" &&
                            imageExtensions.some(ext =>
                                file.name
                                    .toLowerCase()
                                    .endsWith(ext)
                            )
                        );

                    });


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



    /* =====================================================
       DISPLAY PRODUCTS
    ===================================================== */

    function renderProducts(
        container,
        images
    ) {

        container.innerHTML = "";


        /*
           Folder empty hai
        */

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



        /* =================================================
           EACH IMAGE
        ================================================= */

        images.forEach(file => {


            /* ================= CARD ================= */

            const card =
                document.createElement("div");

            card.className =
                "product-card";



            /* ================= IMAGE WRAPPER ================= */

            const imageWrap =
                document.createElement("div");

            imageWrap.className =
                "product-image-wrap";



            /* ================= IMAGE ================= */

            const image =
                document.createElement("img");

            image.className =
                "product-image";


            /*
               GitHub API ka download_url use karenge.

               Isse Hindi filename bhi properly
               load hoga.
            */

            image.src =
                file.download_url;


            image.loading =
                "lazy";


            image.decoding =
                "async";



            /* =================================================
               PRODUCT NAME
               Filename se automatically
               ================================================= */

            let productName =
                file.name
                    .replace(/\.[^/.]+$/, "")
                    .replace(/[-_]+/g, " ")
                    .replace(/\s+/g, " ")
                    .trim();



            /*
               English filename ke first letters
               capital honge.

               Hindi filename par iska koi
               unwanted effect nahi hoga.
            */

            productName =
                productName.replace(
                    /\b[a-z]/g,
                    letter => letter.toUpperCase()
                );



            image.alt =
                `${productName} - Jai Mewar safa House Pali`;



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
                        color:#c6284a;
                        background:#fce1e7;
                        font-size:35px;
                    ">

                        <i class="fa-regular fa-image"></i>

                    </div>

                `;

            };



            imageWrap.appendChild(
                image
            );



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
               ADD CARD
            ================================================= */

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



    /* =====================================================
       START
    ===================================================== */

    loadProducts();

});
