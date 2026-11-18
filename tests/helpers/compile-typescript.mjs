import assert from 'node:assert/strict';
import { mkdtemp, rm, symlink } from 'node:fs/promises';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import ts from 'typescript';

/** Compile real app modules for Node tests, preserving their public interfaces. */
export async function compileTypeScript(entries) {
  const root = process.cwd();
  const directory = await mkdtemp(path.join(os.tmpdir(), 'menucraft-modules-'));
  const program = ts.createProgram(entries, {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.CommonJS,
    moduleResolution: ts.ModuleResolutionKind.Node10,
    jsx: ts.JsxEmit.ReactJSX,
    esModuleInterop: true,
    skipLibCheck: true,
    rootDir: root,
    outDir: directory,
    baseUrl: root,
    paths: { '@/*': ['./*'] },
  });
  const aliases = (context) => (source) => {
    const visit = (node) => {
      if (
        ts.isImportDeclaration(node) &&
        ts.isStringLiteral(node.moduleSpecifier) &&
        node.moduleSpecifier.text.startsWith('@/')
      ) {
        const target = path.join(root, node.moduleSpecifier.text.slice(2));
        let relative = path.relative(path.dirname(source.fileName), target).split(path.sep).join('/');
        if (!relative.startsWith('.')) relative = './' + relative;
        return context.factory.updateImportDeclaration(
          node,
          node.modifiers,
          node.importClause,
          context.factory.createStringLiteral(relative),
          node.attributes
        );
      }
      return ts.visitEachChild(node, visit, context);
    };
    return ts.visitNode(source, visit);
  };
  assert.equal(
    program.emit(undefined, undefined, undefined, undefined, { before: [aliases] }).emitSkipped,
    false
  );
  await symlink(path.join(root, 'node_modules'), path.join(directory, 'node_modules'), 'dir');
  const require = createRequire(import.meta.url);
  return {
    load: (entry) => require(path.join(directory, entry.replace(/\.tsx?$/, '.js'))),
    dispose: () => rm(directory, { recursive: true, force: true }),
  };
}
