import { ref, toRaw } from 'vue';
import { System } from '../../kernel/system';
import DialogProcessVue from './DialogProcess.vue';
import DialogVue from './DialogTemp.vue';
class Dialog {
  public static system: System;
  constructor() {
    // static class
  }
  public static showProcessDialog(option: {
    message?: string;
    type?: 'info' | 'error' | 'question' | 'warning';
    title?: string;
    buttons?: string[];
  }) {
    const opt = Object.assign(
      {
        message: '',
        type: 'info',
        title: '提示',
        buttons: ['OK'],
      },
      option
    );

    const process = ref(0);

    const dialogwin = this.system.createWindow({
      width: 300,
      height: 150,
      content: DialogProcessVue,
      title: opt.title,
      resizable: false,
      minimizable: false,
      center: true,
      skipTaskbar: true,
      config: {
        res: process,
        option: opt,
      },
      alwaysOnTop: true,
    });
    dialogwin.show();

    function setProgress(value: number) {
      process.value = value;
      if (value >= 100) {
        dialogwin.close();
      }
    }

    return {
      setProgress,
    };
  }
  public static showMessageBox(option: {
    message?: string;
    type?: 'info' | 'error' | 'question' | 'warning';
    title?: string;
    buttons?: string[];
  }): Promise<{
    response: number;
  }> {
    const opt = Object.assign(
      {
        message: '',
        type: 'info',
        title: '提示',
        buttons: ['OK'],
      },
      option
    );

    let promres: (value: { response: number }) => void = () => {
      // do nothing
    };

    const porm = new Promise<{
      response: number;
    }>((resolve) => {
      promres = resolve;
    });

    const dialogwin = this.system.createWindow({
      width: 300,
      height: 150,
      content: DialogVue,
      title: opt.title,
      resizable: false,
      minimizable: false,
      center: true,
      skipTaskbar: true,
      config: {
        res: promres,
        option: opt,
      },
      alwaysOnTop: true,
    });
    dialogwin.show();

    Dialog.system.stateManager.windowTree.windowOrder.forEach((win) => {
      if (!(toRaw(win) === dialogwin)) {
        win.setDisable(true);
      }
    });
    dialogwin.on('close', () => {
      Dialog.system.stateManager.windowTree.windowOrder.forEach((win) => {
        if (!(toRaw(win) === dialogwin)) {
          win.setDisable(false);
        }
      });
      promres({
        response: -1,
      });
    });

    return porm;
  }
}

export { Dialog };
