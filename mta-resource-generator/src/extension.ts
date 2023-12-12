'use strict';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.createMTAFiles', (resource) => {
        if (resource instanceof vscode.Uri) {
            const folderPath = resource.fsPath;
            const projectNamePromptOptions: vscode.InputBoxOptions = {
                prompt: 'Enter the project name',
                value: path.basename(folderPath)
            };

            vscode.window.showInputBox(projectNamePromptOptions).then(projectName => {
                if (projectName) {
                    const authorNamePromptOptions: vscode.InputBoxOptions = {
                        prompt: 'Enter the author name'
                    };

                    vscode.window.showInputBox(authorNamePromptOptions).then(authorName => {
                        const descriptionPromptOptions: vscode.InputBoxOptions = {
                            prompt: 'Enter the resource description'
                        };

                        vscode.window.showInputBox(descriptionPromptOptions).then(description => {
                            createMTAFiles(projectName, authorName, description, folderPath);
                        });
                    });
                }
            });
        }
    });

    context.subscriptions.push(disposable);

    vscode.commands.registerCommand('extension.createMTAFiles', () => {
        vscode.window.showErrorMessage('This command should be triggered from the context menu of a folder.');
    });
}

function createMTAFiles(projectName: string, authorName: string | undefined, description: string | undefined, folderPath: string) {
    const projectPath = path.join(folderPath, projectName);
    fs.mkdirSync(projectPath);

    // Create MTA files
    createFile(projectPath, 'meta.xml', generateMetaXML(projectName, authorName, description));
    createFile(projectPath, 'client.lua', '-- client code');
    createFile(projectPath, 'server.lua', '-- server code');
    createFile(projectPath, 'shared.lua', '-- shared code');

    vscode.window.showInformationMessage('MTA files created successfully!');
}

function createFile(projectPath: string, fileName: string, content: string) {
    const filePath = path.join(projectPath, fileName);
    fs.writeFileSync(filePath, content, 'utf-8');
}

function generateMetaXML(projectName: string, authorName: string | undefined, description: string | undefined): string {
    return `<meta>
    <info name="${projectName}" version="1.0" author="${authorName || 'Unknown'}" type="script" description="${description || 'No description provided'}" />
    <script src="client.lua" type="client" />
    <script src="server.lua" type="server" />
    <script src="shared.lua" type="shared" />
</meta>`;
}
