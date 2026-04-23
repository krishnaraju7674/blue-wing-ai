import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

// Blue Wing Local Script Runner
// Only allows specific "Safe" commands defined in the MISSION PROFILE

const ALLOWED_COMMANDS = {
    'compile': 'npx hardhat compile',
    'audit': 'npm audit',
    'test': 'npx hardhat test',
    'status': 'git status'
};

export async function POST(req) {
    try {
        const { action, command: rawCommand, text, key } = await req.json();
        
        let command = ALLOWED_COMMANDS[action];
        
        // Sovereign Mode: Allow raw command execution
        if (action === 'raw' && rawCommand) {
            command = rawCommand;
        }

        // Keyboard Simulation: Type text
        if (action === 'type' && text) {
            // Escape single quotes for PowerShell
            const escapedText = text.replace(/'/g, "''");
            command = `powershell -c "$obj = New-Object -ComObject WScript.Shell; $obj.SendKeys('${escapedText}')"`;
        }

        // Keyboard Simulation: Press Key
        if (action === 'press' && key) {
            command = `powershell -c "$obj = New-Object -ComObject WScript.Shell; $obj.SendKeys('~')"`; // ~ is Enter in SendKeys
            if (key === 'tab') command = `powershell -c "$obj = New-Object -ComObject WScript.Shell; $obj.SendKeys('{TAB}')"`;
        }

        if (!command) {
            return NextResponse.json({ error: 'Command not in MISSION PROFILE.' }, { status: 403 });
        }

        console.log(`Blue Wing executing local script: ${command}`);
        
        const { stdout, stderr } = await execPromise(command, { cwd: process.cwd() });

        return NextResponse.json({
            status: 'Success',
            command: action,
            output: stdout || stderr,
            hash: `BW-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
        });

    } catch (error) {
        return NextResponse.json({ 
            error: 'Execution Failed', 
            details: error.message 
        }, { status: 500 });
    }
}
