/*
 * @Author: RoyalKnight
 * @LastEditTime: 2022-07-14 19:54:50
 * @Description: 
 */
import { Power } from "@libs/Power";
import { Notify } from "@libs/Notify";
import { ContextMenu } from "@libs/ContextMenu";
import { DWM } from "@libs/DWM"
import {
  State,
  stateInit
} from "@state/index";
import type {appInfo} from "@state/type";
import {DragWindowFactory} from "@libs/DragWindow"
import { defaultOption } from '@libs/option'
import { SystemConfig,OptionType,partialOption } from "@/packages/window/libs/SystemConfig";

class System {
  id:string;
  SystemConfig:SystemConfig;
  Power: Power;
  Notify: Notify;
  ContextMenu: ContextMenu;
  private DWM: DWM;
  getWindow:DWM["getWindow"]
  State: State;
  DragWindow:ReturnType<typeof DragWindowFactory>
  constructor(option:partialOption) {
    // generate id
    this.id='win10'+Math.random().toString(36).substr(2, 9);
    // init Config
    this.SystemConfig=new SystemConfig(this)
    this.SystemConfig.initConfig(option)
    // register system
    this.Power =new Power(this);
    this.Notify = new Notify(this);
    this.ContextMenu =new ContextMenu(this);
    this.DWM = new DWM(this);
    this.getWindow = this.DWM.getWindow.bind(this.DWM);
    ({...this.State} = stateInit());
    this.DragWindow=DragWindowFactory(this)
  }
  ClearPlace(place:'appList'|'startupList'|'magnet'){
    this.State[place].splice(0, this.State[place].length)
  }
  AddToPlace(place:'appList'|'startupList'|'magnet',app:appInfo){
    this.State[place].push(Object.assign({
      name: defaultOption.untitle,
      icon: defaultOption.icon,
    }, app))
  }
  ClearDesktop() {
    this.ClearPlace('appList');
  }
  AddToDesktop(app:appInfo) {
    this.AddToPlace('appList',app);
  }
  ClearStartupList() {
    this.ClearPlace('startupList');
  }
  AddToStartupList(app:appInfo) {
    this.AddToPlace('startupList',app);
  }
  ClearMagnet() {
    this.ClearPlace('magnet');
  }
  AddToMagnet(app:appInfo) {
    this.AddToPlace('magnet',app);
  }
}
export { System };