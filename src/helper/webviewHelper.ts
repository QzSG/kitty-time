export default {
    getTitle : () : string => {
        const titles: string[] = [
            'Aww. Such a cute kitty',
            'Cats for days!',
            'There! A Cat!',
            'It\'s Cat Hour',
            'Kitty Time!'
        ];
        return titles[Math.floor(Math.random() * titles.length)]
    },
    getType : (imageType: string) : string => {
        if (imageType) {
            switch (imageType) {
                case "static": return "&type=png";
                case "animated": return "&type=gif";
                case "both": return "";
                default: return "";
            }
        }
        return "";
    },
    getHead : (nonce : string, bulmaCSSPath : string, fontAwesomeCSSPath : string) :string => {
        return `
            <head>
                <meta charset="UTF-8">
                <!--
                Use a content security policy to only allow loading images from https or from our extension directory,
                and only allow scripts that have a specific nonce.
                -->
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src *; style-src vscode-resource: https: 'nonce-${nonce}';font-src vscode-resource: https: 'nonce-${nonce}'; script-src vscode-resource: 'nonce-${nonce}';">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>It's Kitty Time! =(＾● ⋏ ●＾)= ෆ</title>
                <link rel="stylesheet" href="${bulmaCSSPath}" integrity="sha256-zIG416V1ynj3Wgju/scU80KAEWOsO5rRLfVyRDuOv7Q=" crossorigin="anonymous" />
                <link rel="stylesheet" href="${fontAwesomeCSSPath}" integrity="sha384-lKuwvrZot6UHsBSfcMvOkWwlCMgc0TaWr+30HWe3a4ltaBwTZhyTEggF5tJv8tbt" crossorigin="anonymous">
            </head>
        `;
    },
    getCustomInlineStyle : (nonce : string) : string => {
        return `
            <style nonce="${nonce}" >
                .hero, {background-color: var(--background-color) !important; color: var(--color) !important;} .title,.subtitle,.navbar-item,.navbar-link {color: var(--color) !important;}
                a:hover { background-color: var( --vscode-button-hoverBackground) !important;}
                body { color: var(--color) !important; background-color: var(--background-color) !important; justify-content: center; display: flex;} img{align-self: center; max-height: 60vh; max-width: 100vw;} body {animation: fadein ease 2s;
                animation-iteration-count: 1;  animation-fill-mode:forwards; /*when the spec is finished*/  -webkit-animation: fadein ease 2s;
                -webkit-animation-iteration-count: 1;  -webkit-animation-fill-mode:forwards; /*Chrome 16+, Safari 4+*/ }
                h6.subtitle.is-6 {margin-top: 1rem;}
                
                @keyframes fadein{0%{opacity:0;}100%{opacity:1; }}
                @-webkit-keyframes fadein{0%{opacity:0;}100%{opacity:1;}}
                .hero-foot .content {padding-top: 0.5em !important; padding-bottom: 0.5em !important;}
            </style>
        `;
    },
    getBody : (catSrc : string, catUrl : string, title: string) : string => {
        return `
        <section class="hero is-fullheight is-fullwidth">
        <!-- Hero head: will stick at the top -->
        <div class="hero-head">
            <nav class="navbar">
            <div class="container">
                <div class="navbar-brand">
                <a class="navbar-item">
                =(＾● ⋏ ●＾)= ෆ
                </a>
                <span class="navbar-burger burger" data-target="navbarMenuHero">
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
                </div>
                <div id="navbarMenuHero" class="navbar-menu">
                <div class="navbar-end">
                    <a class="navbar-item is-active" href="https://github.com/QzSG/kitty-time">
                        <span class="icon">
                        <i class="fab fa-github-alt fa-lg"></i>
                        </span>
                    </a>
                    </span>
                </div>
                </div>
            </div>
            </nav>
        </div>

        <!-- Hero content: will be in the middle -->
        <div class="hero-body">
            <div class="container has-text-centered">
                <h4 class="title is-4" >
                    ${title}
                </h4>
                <img src="${catSrc}" alt="Logo">
                <h6 class="subtitle is-6">
                    <a class="button is-info" href=${catUrl}>Source</a>
                </h6>
            </div>
        </div>
        `;
    },
    getFooter : (catFact : String) : String => {
        return `
            <!-- Hero footer: will stick at the bottom -->
            <div class="hero-foot">
                <div class="content has-text-centered">
                    <p>
                        ${catFact || "Cat Fact"}
                    </p>
                </div>
            </div>
            </section>
        `;
    } 
}