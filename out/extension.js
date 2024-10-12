"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const axios_1 = __importDefault(require("axios"));
function activate(context) {
    let typingTimeout; // Timeout reference for debouncing
    const inlineCompletionProvider = vscode.languages.registerInlineCompletionItemProvider({ pattern: '**' }, // This can be limited to specific languages
    {
        provideInlineCompletionItems(document, position) {
            // Return a Promise to handle asynchronous suggestion
            return new Promise(resolve => {
                // Clear the previous timer if the user types again
                if (typingTimeout) {
                    clearTimeout(typingTimeout);
                }
                // Start a new timeout to wait 1.5 seconds after the user stops typing
                typingTimeout = setTimeout(async () => {
                    // try {
                    const textBeforeCursor = document.getText(new vscode.Range(new vscode.Position(0, 0), position));
                    // Provide inline suggestions'
                    const response = await axios_1.default.post('http://185.211.58.37:51234/v1/completions', {
                        model: 'qwen2.5-coder-7b-instruct',
                        prompt: textBeforeCursor, // Send all the text before the cursor
                        max_tokens: 20
                    });
                    const completionText = response.data.choices[0].text;
                    const item = new vscode.InlineCompletionItem(completionText);
                    resolve([item]);
                    // }
                    // catch (error) {
                    //     console.error('Error contacting LLM:', error);
                    //     resolve([]); // Return an empty array if there is an error
                    // }
                }, 1500);
            });
        }
    });
    context.subscriptions.push(inlineCompletionProvider);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map