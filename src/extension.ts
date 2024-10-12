
import * as vscode from 'vscode';
import axios from 'axios';

export function activate(context: vscode.ExtensionContext) {
	console.log("Starting the extension");
	let typingTimeout: NodeJS.Timeout | undefined; // Timeout reference for debouncing
    const inlineCompletionProvider = vscode.languages.registerInlineCompletionItemProvider(
        { pattern: '**' }, // This can be limited to specific languages
        {
			provideInlineCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				// Return a Promise to handle asynchronous suggestion
				return new Promise<vscode.InlineCompletionItem[]>(resolve => {
					// Clear the previous timer if the user types again
					if (typingTimeout) {
						clearTimeout(typingTimeout);
					}
					// Start a new timeout to wait 1.5 seconds after the user stops typing
					typingTimeout = setTimeout(async () => {
						// try {
						console.log("User stop typing");
						const textBeforeCursor = document.getText(new vscode.Range(new vscode.Position(0, 0), position));
						console.log("Sending data to server");
						// Provide inline suggestions'
						const response = await axios.post('https://api.infinitai.ir/space', {
							text: textBeforeCursor,
						});
						const responseData = JSON.parse(response.data);
						console.log("Parsing the response");
						const completionText = responseData.choices[0].text;
						const item = new vscode.InlineCompletionItem(completionText);
						resolve([item]);
					}, 1000);
                });
            }
        }
    );

    context.subscriptions.push(inlineCompletionProvider);
}

export function deactivate() {}
