
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
						const response = await axios.post('http://185.211.58.37:51234/v1/completions', {
							model: 'qwen2.5-coder-7b-instruct',
							prompt: textBeforeCursor, // Send all the text before the cursor
							max_tokens: 30
						});
						console.log("Parsing the response");
						const completionText = response.data.choices[0].text;
						const item = new vscode.InlineCompletionItem(completionText);
						resolve([item]);
						// }
						// catch (error) {
                        //     console.error('Error contacting LLM:', error);
                        //     resolve([]); // Return an empty array if there is an error
						// }
					}, 700);
                });
            }
        }
    );

    context.subscriptions.push(inlineCompletionProvider);
}

export function deactivate() {}
