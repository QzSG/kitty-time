import * as vscode from 'vscode';
import * as path from 'path';
import axios from 'axios';
import { parseString } from 'xml2js';
import './helper/webviewHelper';
import webviewHelper from './helper/webviewHelper';
class KittyPanel {

    public static currentPanel: KittyPanel | undefined;

    private static readonly viewType = 'kittyTime';

    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionPath: string;
    
    private _config: vscode.WorkspaceConfiguration;
    private _disposables: vscode.Disposable[] = [];

    public static createOrShow(extensionPath: string) {
        const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;
        let configChange = false;
        vscode.workspace.onDidChangeConfiguration(() => {
            const currentDocument = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.document : undefined;
            if (KittyPanel.currentPanel) {
                KittyPanel.currentPanel.dispose();
                KittyPanel.currentPanel = new KittyPanel(column || vscode.ViewColumn.One, extensionPath);
                if (currentDocument) { vscode.window.showTextDocument(currentDocument, column);}
                configChange = true;
            }
        });
        
        if (KittyPanel.currentPanel) {
            if (!configChange){
                configChange = false;
                KittyPanel.currentPanel._panel.reveal(column);
            }
        } else {
            KittyPanel.currentPanel = new KittyPanel(column || vscode.ViewColumn.One, extensionPath);
        }
        
    }

    private constructor(column: vscode.ViewColumn, extensionPath: string) {
        
        this._config = this._updateConfig();
        this._extensionPath = extensionPath;
        this._panel = vscode.window.createWebviewPanel(KittyPanel.viewType, "It's Kitty Time! =(＾● ⋏ ●＾)= ෆ", column, {
        
            enableScripts: true,

            // Restrict all local paths
            localResourceRoots: [
                vscode.Uri.file(path.join(extensionPath, 'files'))
            ],

            retainContextWhenHidden: true
        });

        // Initial
        this._update();

        // Listens to panel close through code or human and calls dispose()
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        // Update the content based on view changes
        this._panel.onDidChangeViewState(e => {
            if (this._panel.visible) {
                //this._update()
            }
        }, null, this._disposables);

    }
    
    
    private _updateConfig = () => {
        return vscode.workspace.getConfiguration("kittyTime");
    };

    public dispose() {
        KittyPanel.currentPanel = undefined;

        // Clean up resources
        this._panel.dispose();

        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    private async _update() {
        await this._updateConfig();
        let {apiKey , imageType} = this._config;
        //console.log(apiKey , imageType);
        let type = webviewHelper.getType(imageType);        

        let title = webviewHelper.getTitle();
        // Cat Api Usage
        // TODO: Allow user to add custom api for more cats, allow switching to png or both png and gif
        let CatApiUrl = `https://thecatapi.com/api/images/get?format=xml${type}&size=full&count=1&api_key=${apiKey}`;
        //console.log(CatApiUrl);
        let CatApiPromise = axios.get(CatApiUrl); 
        let CatFactUrl = `https://catfact.ninja/fact`;
        //console.log(CatApiUrl);
        let CatFactPromise = axios.get(CatFactUrl); 

        const [apiRes, factRes] = await Promise.all([CatApiPromise, CatFactPromise]);
        
        //Cat Api returns XML Body, pass to XML2JS for parsing
        parseString(apiRes.data, (err, result) => {
            //console.log(result);

            //XML2JS is pretty awful, look for better XML parser
            const catSrc = result.response.data[0].images[0].image[0].url[0];
            const catUrl = result.response.data[0].images[0].image[0].source_url[0];
            //console.log(catSrc);
            const catFact = factRes.data.fact;
            this._updateCat(catSrc, catUrl, title, catFact);
        });

    }

    private _updateCat(catSrc: string, catUrl: string, title: string, catFact: string) {
        this._panel.title = "It's Kitty Time! =(＾● ⋏ ●＾)= ෆ";
        this._panel.webview.html = this._getHtmlForWebview( {catSrc, catUrl, title, catFact});
    }

    private _getHtmlForWebview( data : { catSrc: string, catUrl: string, title: string, catFact: string} ) {
        
        const {catSrc, catUrl, title, catFact} = data;

        const bulmaCSSPathOnDisk = vscode.Uri.file(path.join(this._extensionPath, 'files', 'bulma.min.css'));
        
        // And the uri we use to load this script in the webview
        const bulmaCSSPath = bulmaCSSPathOnDisk.with({ scheme: 'vscode-resource' });
        
        // Use a nonce to whitelist inline srcs to be allowed to run
        const nonce = this.getNonce();

        return `
        <!DOCTYPE html>
        <html lang="en">
            ${webviewHelper.getHead(nonce, bulmaCSSPath.toString())}
            <body>
                ${webviewHelper.getCustomInlineStyle(nonce)}
                ${webviewHelper.getBody(catSrc, catUrl, title)}
                ${webviewHelper.getFooter(catFact)}
            </body>
        </html>`;
    }

    //Nonce generator for inline *-src usage required by CSP
    public getNonce() {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    } 
}


export default KittyPanel;