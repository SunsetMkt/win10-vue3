<template>
  <div
    class="appicon"
    :class="{
      'appicon-top': windowNode.windowInfo.istop,
      'appicon-minimize': windowNode.windowInfo.state === WindowStateEnum.minimize,
    }"
    @contextmenu.prevent="handleRightClick"
    @click="handleClick"
  >
    <div class="appicon-img">
      <FileIcon :icon="windowNode.windowInfo.icon" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { UnwrapNestedRefs } from 'vue';
import { BrowserWindow, WindowStateEnum } from '@/packages/services';
import FileIcon from '@/packages/computer/application/FileIcon.vue';
import { createTaskbarIconContextMenu } from '@/packages/computer/utils/createTaskbarContextMenu';

const props = defineProps<{
  windowNode: UnwrapNestedRefs<BrowserWindow>;
}>();
function handleRightClick(e: MouseEvent) {
  createTaskbarIconContextMenu(e, props.windowNode);
}
function handleClick() {
  if (props.windowNode.windowInfo.state === 'minimize') {
    props.windowNode.restore();
    props.windowNode.moveTop();
  } else if (props.windowNode.windowInfo.istop) {
    props.windowNode.minimize();
  } else {
    props.windowNode.moveTop();
  }
}
</script>
<style lang="scss" scoped>
.appicon {
  width: var(--task-bar-height);
  height: var(--task-bar-height);
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  transition: all 0.1s;
  position: relative;
  .appicon-img {
    user-select: none;
    width: 60%;
    height: 60%;
  }
}
.appicon::after {
  content: '';
  position: absolute;
  bottom: 0;
  width: 80%;
  height: 4px;
  box-sizing: border-box;
  transition: all 0.1s;
  background-color: var(--color-dark);
}
.appicon-top {
  // background-color: var(--color-gray-active);
  background-color: var(--theme-main-color);
  filter: brightness(110%);
}
.appicon-top::after {
  content: '';
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: 4px;
  box-sizing: border-box;
  transition: all 0.1s;
}
.appicon-minimize::after {
  content: '';
  position: absolute;
  bottom: -4px;
  width: 100%;
  height: 4px;
  box-sizing: border-box;
  transition: all 0.1s;
  background-color: var(--color-dark);
}

.appicon:hover {
  background-color: var(--color-gray-hover-op);
}
.appicon-top:hover {
  background-color: var(--color-gray-active-op);
}
</style>
