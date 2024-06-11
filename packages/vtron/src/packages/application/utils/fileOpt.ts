import { BrowserWindow, Dialog } from '@/packages/services';
import * as fspath from '@/packages/util/Path';
import FileProps from '@packages/application/FileProps.vue';
import OpenWiteDialogVue from '@packages/application/OpenWiteDialog.vue';
import { VtronFileWithoutContent, useSystem } from '@packages/kernel';
import { i18n } from '@packages/ui';

async function createNewFile(path: string) {
  const system = useSystem();
  if (!system) return;
  let newFilePath = fspath.join(path, i18n('new.file') + '.txt');
  if (await system.fs.exists(newFilePath)) {
    let i = 1;
    while (await system.fs.exists(fspath.join(path, `${i18n('new.file')}(${i}).txt`))) {
      i++;
    }
    newFilePath = fspath.join(path, `${i18n('new.file')}(${i}).txt`);
  }
  return await system.fs.writeFile(newFilePath, '');
}
async function createNewDir(path: string) {
  const system = useSystem();
  if (!system) return;
  let newFilePath = fspath.join(path, i18n('new.folder'));
  if (await system.fs.exists(newFilePath)) {
    let i = 1;
    while (await system.fs.exists(fspath.join(path, `${i18n('new.folder')}(${i})`))) {
      i++;
    }
    newFilePath = fspath.join(path, `${i18n('new.folder')}(${i})`);
  }
  return await system.fs.mkdir(newFilePath);
}

function openPropsWindow(path: string) {
  new BrowserWindow({
    title: i18n('props'),
    content: FileProps,
    config: {
      content: path,
    },
    width: 350,
    height: 400,
    resizable: false,
  }).show();
}
function deleteFile(file: VtronFileWithoutContent) {
  const system = useSystem();
  if (!system) return;
  if (file.isDirectory) {
    return system?.fs.rmdir(file.path);
  } else {
    return system?.fs.unlink(file.path);
  }
}
async function openWith(file: VtronFileWithoutContent) {
  const tempWin = new BrowserWindow({
    title: i18n('open.with'),
    content: OpenWiteDialogVue,
    config: {
      content: file.path,
    },
    width: 300,
    height: 300,
    center: true,
    frame: false,
    resizable: false,
  });
  tempWin.on('blur', () => {
    tempWin.close();
  });
  tempWin.show();
}

async function copyFile(files: VtronFileWithoutContent[]) {
  const system = useSystem();
  const rootState = system.stateManager;
  if (!system) return;
  rootState.clipboard.setClipboard(files.map((file) => file.path));
}
async function pasteFile(path: string) {
  const system = useSystem();
  if (!system) return;
  const rootState = system.stateManager;
  const clipLen = Object.keys(rootState.clipboard).length;
  if (clipLen) {
    const clipFiles = rootState.clipboard.getClipboard();

    if (!clipFiles.forEach) {
      return;
    }
    await clipFiles.forEach(async (clipFile: string) => {
      let tempName = fspath.filename(clipFile);
      const ext = fspath.extname(clipFile);

      if (await system.fs.exists(fspath.join(path, tempName) + ext)) {
        let i = 1;
        while (await system.fs.exists(fspath.join(path, `${tempName}(${i})`) + ext)) {
          i++;
        }
        tempName = `${tempName}(${i})`;
      }
      return system.fs.copyFile(clipFile, fspath.join(path, tempName) + ext);
    });
  } else {
    system.emitError('no file in clipboard');
  }
}
// 创建快捷方式
async function createLink(path: string) {
  const system = useSystem();
  if (!system) return;
  if (fspath.extname(path) === '.ln') {
    Dialog.showMessageBox({
      title: i18n('error'),
      message: i18n('cannot.create.shortcut'),
      type: 'error',
    });
    return;
  }
  const parentPath = fspath.dirname(path);
  const baseName = fspath.basename(path);
  const linkPath = fspath.join(parentPath, baseName + '.ln');
  if (await system.fs.exists(linkPath)) {
    Dialog.showMessageBox({
      title: i18n('error'),
      message: i18n('shortcut.has.been.created'),
      type: 'error',
    });
    return;
  }
  return await system.fs.writeFile(linkPath, path);
}

export {
  copyFile,
  createLink,
  createNewDir,
  createNewFile,
  deleteFile,
  openPropsWindow,
  openWith,
  pasteFile,
};