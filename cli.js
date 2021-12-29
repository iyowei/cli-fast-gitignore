#!/usr/bin/env node

import { realpathSync, existsSync, writeFile } from 'fs';
import path from 'path';
import { homedir } from 'os';

import { callsiteHomeSync } from '@iyowei/callsite-home';
import { fastGitignoreSync } from '@iyowei/fast-gitignore';
import { writeJsonFile, writeJsonFileSync } from 'write-json-file';
import { loadJsonFileSync } from 'load-json-file';
import { cosmiconfigSync } from 'cosmiconfig';
import updateNotifier from 'update-notifier';
import terminalLink from 'terminal-link';
import redent from 'redent';
import chalk from 'chalk'; // eslint-disable-line
import meow from 'meow';
import shell from 'shelljs';

class CliFastGitignore {
  CLI = undefined;

  NO_INPUT = false;

  WP = undefined;

  USER_DEFINED_CONFIG = undefined;

  LAST_CACHE = undefined;

  LAST_SAVING_PATH = path.join(homedir(), `cli-fast-gitignore-last.json`);

  EMPTY_CONFIG = { topics: undefined, custom: undefined };

  CONFIRMED_TOPICS = undefined;

  DEST = undefined;

  constructor() {
    this.CLI = meow(
      `
        命令行工具，用来生成、更新 .gitignore 文件。 "${terminalLink(
          'github/gitignore',
          'https://github.com/github/gitignore',
        )}" 模板库已内嵌。

        ${chalk.bold('使用方式')}
          $ fast-gitignore|fgi [主题] [...] [选项] [...]

        ${chalk.bold('选项')}
          --out, -o,                                       '.gitignore' 文件存储位置，默认：'process.cwd()'
          --config-from-cwd                                使用从当前工作路径处读取到的预设，跨项目操作时如有需要可使用

          --version, -V,                                   查看版本号
          --help, -h                                       查看帮助

        ${chalk.bold('示例')}
          $ fgi macOS Windows Linux Node                   在当前工作路径读取预设并生成 .gitignore 文件
      `,
      {
        description: false,
        importMeta: import.meta,
        flags: {
          out: {
            type: 'string',
            alias: 'o',
          },
          configFromCwd: {
            type: 'boolean',
            default: false,
          },
          help: {
            type: 'boolean',
            alias: 'h',
          },
          version: {
            type: 'boolean',
            alias: 'V',
          },
        },
      },
    );

    updateNotifier({ pkg: this.CLI.pkg }).notify();

    this.WP = CliFastGitignore.getWorkingDirectory(this.CLI.flags.out);

    shell.echo('');

    this.collectTopics();

    this.DEST = this.getDest();
  }

  collectTopics() {
    shell.echo('  前提：收集主题');

    if (this.CLI.input.length === 0) {
      shell.echo('  前提：未手动输入主题');

      this.NO_INPUT = true;

      shell.echo('  前提：选择读取预设');

      // 从 "工作路径" 或 "指定路径" 读取预设，取决于是否指定了 `--config-from-cwd` 参数
      this.USER_DEFINED_CONFIG = CliFastGitignore.getUserDefinedConfig(
        this.CLI.flags.configFromCwd ? this.WP.cwd : this.WP.twd,
      );

      if (CliFastGitignore.isEmpty(this.USER_DEFINED_CONFIG.topics)) {
        shell.echo('  前提：没有预设，选择读取上次预设');
        this.CONFIRMED_TOPICS = this.getLast().topics;
      } else {
        shell.echo('  前提：选择预设中的主题');
        this.CONFIRMED_TOPICS = this.USER_DEFINED_CONFIG.topics;
      }
    } else {
      shell.echo('  前提：选择手动输入的主题');
      this.CONFIRMED_TOPICS = this.CLI.input;
    }
  }

  getDest() {
    const { flags } = this.CLI;
    const { out } = flags;

    if (CliFastGitignore.isEmpty(out)) {
      shell.echo(`  前提：提供的输出位置为当前工作路径 ${this.WP.twd}`);
      return this.WP.twd;
    }

    shell.echo(`  前提：提供的输出位置为指定路径 ${out}`);
    return out;
  }

  getLast() {
    if (this.LAST_CACHE) {
      shell.echo('  前提：使用缓存');
      return this.LAST_CACHE;
    }

    if (existsSync(this.LAST_SAVING_PATH)) {
      shell.echo('  前提：读取上次预设');

      this.LAST_CACHE = loadJsonFileSync(this.LAST_SAVING_PATH);

      shell.echo(
        CliFastGitignore.isEmpty(this.LAST_CACHE)
          ? '  前提：上次预设为空'
          : '  前提：已读取上次预设',
      );

      return this.LAST_CACHE;
    }

    shell.echo('  前提：使用空预设');
    return this.EMPTY_CONFIG;
  }

  prerequisites() {
    shell.echo(`  前提：检查输出路径 '${this.DEST}' 是否真实`);
    if (!existsSync(this.DEST)) {
      CliFastGitignore.terminateCli(`'${this.DEST}' 位置无效`);
    }

    // TODO: 待定，指定了主题，或者有自定义，2 者皆空则退出程序
    shell.echo('  前提：检查主题是否有效');
    if (!this.CONFIRMED_TOPICS) {
      CliFastGitignore.terminateCli('未读取到主题预设');
    }
  }

  async main() {
    this.prerequisites();
    shell.echo('  前提：通过');

    const PAYLOAD = {
      topic: this.CONFIRMED_TOPICS,
      templatesDir: path.join(
        callsiteHomeSync('cli-fast-gitignore'),
        'templates',
      ),
    };

    // 只可能在用户未输入主题的情况下，使用预设文件或者上次操作预设时才可能会有 custom
    if (this.NO_INPUT) {
      // 1
      // 判断读取到的预设是否有效
      if (this.USER_DEFINED_CONFIG.topics) {
        // 2
        if (!CliFastGitignore.isEmpty(this.USER_DEFINED_CONFIG.custom)) {
          // 合并定制的规则，前提：1. `this.USER_DEFINED_CONFIG` 有效；2. `this.USER_DEFINED_CONFIG.custom` 非空
          PAYLOAD.custom = this.USER_DEFINED_CONFIG.custom;
        }
      } else if (!CliFastGitignore.isEmpty(this.LAST_CACHE.custom)) {
        // 没有预设，则读取上次操作的 custom,
        PAYLOAD.custom = this.LAST_CACHE.custom;
      }
    }

    shell.echo('  构造：模板获取参数');

    const TMP_PRESET = {
      topics: PAYLOAD.topic,
    };

    if (PAYLOAD.custom) {
      TMP_PRESET.custom = PAYLOAD.custom;
    }

    shell.echo('  构造：预设文件、上次预设内容');

    // 获取、组织 gitignore 模板内容 =========================>
    const gotObjIgnore = fastGitignoreSync(PAYLOAD);
    const tplData = Object.values(gotObjIgnore).join('\n\n\n');

    shell.echo('  生成：开始异步任务');
    await Promise.all([
      new Promise((resolve, reject) => {
        writeFile(
          CliFastGitignore.resolveRoot('.gitignore', this.DEST),
          tplData,
          (err) => {
            if (err) {
              reject(err);
              return;
            }

            shell.echo('  生成：创建 .gitignore');
            resolve(true);
          },
        );
      }),

      new Promise((resolve, reject) => {
        if (
          CliFastGitignore.isEmpty(
            CliFastGitignore.getUserDefinedConfig(this.WP.twd).topics,
          )
        ) {
          shell.echo(
            '  生成：期望生成 .gitignore 的位置没有读取到预设，生成一个预设文件，方便后期更新',
          );

          writeJsonFile(
            path.join(this.WP.twd, '.gitignorerc.json'),
            TMP_PRESET,
          ).then(
            () => {
              resolve(true);
            },
            (err) => {
              reject(err);
            },
          );
        }

        resolve(true);
      }),

      //
      new Promise((resolve, reject) => {
        shell.echo('  生成：全局储备当前预设，作为 "上次预设" 使用');

        try {
          writeJsonFileSync(this.LAST_SAVING_PATH, TMP_PRESET);
          // 不需要更新 this.LAST_CACHE，因为任务到这里没有任何地方再需要使用 this.LAST_CACHE 了
          resolve(true);
        } catch (err) {
          reject(err);
        }
      }),
    ]).catch((err) => {
      this.terminateCli(err);
    });

    shell.echo('  生成：完成');

    this.success();
  }

  static getUserDefinedConfig(searchPath) {
    const explorer = cosmiconfigSync('gitignore');
    const foundConfig = explorer.search(searchPath);

    return CliFastGitignore.isEmpty(foundConfig)
      ? this.EMPTY_CONFIG
      : CliFastGitignore.get(foundConfig, 'config');
  }

  success() {
    shell.echo(
      redent(
        `
      ${chalk.greenBright.bold('完成！')}
      ${chalk.grey(path.join(this.DEST, '.gitignore'))}
    `,
        2,
      ),
    );
  }

  // twd 永远指向生成目录
  // --config-from-cwd 参数只影响从 twd 还是 cwd 读取预设
  static getWorkingDirectory(twd) {
    return {
      twd: CliFastGitignore.isEmpty(twd) ? process.cwd() : twd,
      cwd: process.cwd(),
    };
  }

  static resolveRoot(relativePath, base) {
    return path.resolve(realpathSync(base), relativePath);
  }

  static isEmpty(obj) {
    return (
      [Object, Array].includes((obj || {}).constructor) &&
      !Object.entries(obj || {}).length
    );
  }

  static get(obj, objPath, defaultValue = undefined) {
    return String.prototype.split
      .call(objPath, /[,[\].]+?/)
      .filter(Boolean)
      .reduce(
        (a, c) => (Object.hasOwnProperty.call(a, c) ? a[c] : defaultValue),
        obj,
      );
  }

  static terminateCli(msg) {
    shell.echo(`\n  ${chalk.bold.redBright(msg)}\n`);

    shell.exit(1);
  }
}

(async () => {
  const ins = new CliFastGitignore();
  await ins.main();
})();
