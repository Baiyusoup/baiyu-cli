const path = require('path');
const fs = require('fs-extra');
const Generator = require('../lib/Generator').default;

describe('@baiyusoup/cli Generator', () => {
  const templateDir = path.resolve(__dirname, 'test-template');
  const resolve = (dir) => path.resolve(templateDir, dir);
  fs.ensureDirSync(templateDir);

  // 创建测试项目
  fs.writeFileSync(resolve('foo.js'), 'foo(<%- n %>)');

  fs.ensureDirSync(resolve('bar'));
  // 以点开头的文件以及文件夹
  fs.ensureDirSync(resolve('_vscode'));
  fs.writeFileSync(resolve('_vscode/config.json'), '{}');
  fs.writeFileSync(resolve('_gitignore'), 'foo');

  test('api: extendPackage', async () => {
    const generator = new Generator({
      context: templateDir,
      pkg: {
        name: 'hello',
        list: [1],
      },
      plugins: [
        {
          id: 'extendPackage',
          apply: (api) => {
            api.extendPackage({
              name: 'hello2',
              list: [2],
            });
          },
          options: {},
        },
      ],
    });

    await generator.generate();

    const pkg = JSON.parse(fs.readFileSync(resolve('package.json'), 'utf-8'));
    expect(pkg).toEqual({
      name: 'hello2',
      list: [1, 2],
    });
  });

  test('api: extendPackage dependencies conflict', async () => {
    const generator = new Generator({
      context: templateDir,
      pkg: {},
      plugins: [
        {
          id: 'p1',
          apply: (api) => {
            api.extendPackage({
              dependencies: {
                test1: '^0.1.0',
              },
            });
          },
          options: {},
        },
        {
          id: 'p2',
          apply: (api) => {
            api.extendPackage({
              dependencies: {
                test1: '^0.1.5',
              },
            });
          },
          options: {},
        },
      ],
    });

    await generator.generate();

    const pkg = JSON.parse(fs.readFileSync(resolve('package.json'), 'utf-8'));
    expect(pkg).toEqual({
      dependencies: {
        test1: '^0.1.5',
      },
    });
  });

  test('api: extendPackage function', async () => {
    const generator = new Generator({
      context: templateDir,
      pkg: {
        foo: 1,
      },
      plugins: [
        {
          id: 'test',
          apply: (api) => {
            api.extendPackage((pkg) => ({
              foo: pkg.foo + 1,
            }));
          },
        },
      ],
    });

    await generator.generate();

    const pkg = JSON.parse(fs.readFileSync(resolve('package.json'), 'utf-8'));
    expect(pkg).toEqual({ foo: 2 });
  });

  test('api: render fs directory', async () => {
    const generator = new Generator({
      context: templateDir,
      pkg: {},
      plugins: [
        {
          id: 'render1',
          apply: (api, options) => {
            api.render('./test-template', options);
          },
          options: {
            n: 1,
          },
        },
      ],
    });

    await generator.generate();

    expect(fs.readFileSync(resolve('foo.js'), 'utf-8')).toMatch('foo(1)');
    expect(fs.readFileSync(resolve('.gitignore'), 'utf-8')).toMatch('foo');
    expect(fs.readFileSync(resolve('.vscode/config.json'), 'utf-8')).toMatch('{}');
  });

  test('api: render middleware', async () => {
    const generator = new Generator({
      context: templateDir,
      pkg: {},
      plugins: [
        {
          id: 'test1',
          apply: (api, options) => {
            api.render((files, render) => {
              files['foo2.js'] = render('foo(<%- m %>)', options);
              files['bar/bar2.js'] = render('bar(<%- m %>)', options);
            });
          },
          options: {
            m: 3,
          },
        },
      ],
    });

    await generator.generate();

    expect(fs.readFileSync(resolve('foo2.js'), 'utf-8')).toMatch('foo(3)');
    expect(fs.readFileSync(resolve('bar/bar2.js'), 'utf-8')).toMatch('bar(3)');
  });

  test('api: hasPlugin', () => {
    new Generator({
      context: templateDir,
      pkg: {},
      plugins: [
        {
          id: 'foo',
          apply: (api) => {
            expect(api.hasPlugin('foo')).toBe(true);
            expect(api.hasPlugin('bar')).toBe(true);
            expect(api.hasPlugin('baz')).toBe(true);
            expect(api.hasPlugin('baiyusoup-cli-plugin-bar')).toBe(true);
            expect(api.hasPlugin('@baiyusoup/cli-plugin-baz')).toBe(true);
          },
          options: {},
        },
        {
          id: 'baiyusoup-cli-plugin-bar',
          apply: () => {},
          options: {},
        },
        {
          id: '@baiyusoup/cli-plugin-baz',
          apply: () => {},
          options: {},
        },
      ],
    });
  });

  test('api: resolve', () => {
    new Generator({
      context: '/foo/bar',
      pkg: {},
      plugins: [
        {
          id: 'test',
          apply: (api) => {
            expect(api.resolve('baz')).toBe(path.resolve('/foo/bar', 'baz'));
          },
        },
      ],
    });
  });
});
