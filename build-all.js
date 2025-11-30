#!/usr/bin/env node
import { cwd } from 'node:process';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { join } from 'node:path';

const execAsync = promisify(exec);

const base = cwd();
const paths = [
    'collider',
    'vector',
    'domside'
];

const promises = paths.map((path) => {
    const dir = join(base, path);

    console.info(`Building ${path}...`);

    return execAsync('npm install && npx c3fo doc && npx c3fo build', {
        cwd: dir
    });
});

await Promise.all(promises);

console.info('Finished!');
