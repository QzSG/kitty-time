import * as vscode from 'vscode';

class KittyBar {

    private _sbItem : vscode.StatusBarItem;

    public constructor() {
        
        this._sbItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
        this._sbItem.text = "=(＾● ⋏ ●＾)= ෆ";
        this._sbItem.command = "kittyTime.run";
        this._sbItem.tooltip = "Click to start Kitty Time."
        this._sbItem.show();
     
    }

    public dispose() {
        this._sbItem.dispose();
    }
}


export default KittyBar;